// Vibe Wall — SQLite + Express backend
// Run: npm install && npm start
// Listens on http://127.0.0.1:3001 by default

import express from 'express';
import cors from 'cors';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = path.resolve(__dirname, '..');   // project root with index.html
const DB_PATH = path.join(__dirname, 'vibewall.db');

// Tiny .env loader — avoids the dotenv dependency.
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const PORT = process.env.PORT || 3001;

const db = new DatabaseSync(DB_PATH);
db.exec(`PRAGMA journal_mode = WAL;`);

// ---------- schema ----------
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    payload TEXT NOT NULL,
    mood TEXT,
    who TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS mood_checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mood TEXT NOT NULL,
    zone INTEGER,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS letters (
    id TEXT PRIMARY KEY,
    to_mood TEXT,
    body TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    claimed_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS reactions (
    post_id TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (post_id, fingerprint)
  );

  CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_posts_kind    ON posts(kind);
  CREATE INDEX IF NOT EXISTS idx_moods_created ON mood_checkins(created_at DESC);
`);

// ---------- prepared statements ----------
const Q = {
  insertPost: db.prepare(`INSERT INTO posts (id, kind, payload, mood, who, created_at) VALUES (?, ?, ?, ?, ?, ?)`),
  listPosts:  db.prepare(`SELECT id, kind, payload, mood, who, created_at FROM posts ORDER BY created_at DESC LIMIT ?`),
  byKind:     db.prepare(`SELECT id, kind, payload, mood, who, created_at FROM posts WHERE kind = ? ORDER BY created_at DESC LIMIT ?`),

  insertMood: db.prepare(`INSERT INTO mood_checkins (mood, zone, created_at) VALUES (?, ?, ?)`),
  moodStats:  db.prepare(`
    SELECT mood, COUNT(*) AS count
    FROM mood_checkins
    WHERE created_at > ?
    GROUP BY mood
  `),
  recentZones: db.prepare(`SELECT mood, zone FROM mood_checkins WHERE zone IS NOT NULL ORDER BY created_at DESC LIMIT 64`),

  insertLetter: db.prepare(`INSERT INTO letters (id, to_mood, body, created_at) VALUES (?, ?, ?, ?)`),
  pullLetter:   db.prepare(`SELECT id, to_mood, body, created_at FROM letters WHERE claimed_at IS NULL AND (to_mood = ? OR to_mood IS NULL) ORDER BY RANDOM() LIMIT 1`),
  claimLetter:  db.prepare(`UPDATE letters SET claimed_at = ? WHERE id = ? AND claimed_at IS NULL`),

  react:        db.prepare(`INSERT OR IGNORE INTO reactions (post_id, fingerprint, created_at) VALUES (?, ?, ?)`),
  countReacts:  db.prepare(`SELECT COUNT(*) AS n FROM reactions WHERE post_id = ?`)
};

// ---------- app ----------
const app = express();
app.use(cors());                             // open CORS — campus-local app
app.use(express.json({ limit: '2mb' }));     // doodle SVGs can be a few hundred KB

const now = () => Date.now();
const newId = () => crypto.randomUUID();

// health
app.get('/api/health', (req, res) => res.json({ ok: true, t: now() }));

// posts
app.get('/api/posts', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '60', 10), 200);
  const rows = req.query.kind && req.query.kind !== 'all'
    ? Q.byKind.all(req.query.kind, limit)
    : Q.listPosts.all(limit);
  res.json(rows.map(r => ({ ...r, payload: JSON.parse(r.payload) })));
});

app.post('/api/posts', (req, res) => {
  const { kind, payload, mood, who } = req.body || {};
  if (!kind || !payload) return res.status(400).json({ error: 'kind and payload required' });
  if (!['doodle', 'poem', 'song', 'confession', 'note', 'photo'].includes(kind)) {
    return res.status(400).json({ error: 'invalid kind' });
  }
  const id = newId();
  Q.insertPost.run(id, kind, JSON.stringify(payload), mood || null, who || 'anon', now());
  res.json({ id, kind, payload, mood, who: who || 'anon', created_at: now() });
});

// reactions
app.post('/api/posts/:id/react', (req, res) => {
  const fp = (req.body && req.body.fingerprint) || req.ip;
  Q.react.run(req.params.id, fp, now());
  res.json({ count: Q.countReacts.get(req.params.id).n });
});

// moods
app.post('/api/moods', (req, res) => {
  const { mood, zone } = req.body || {};
  if (!mood) return res.status(400).json({ error: 'mood required' });
  Q.insertMood.run(mood, zone ?? null, now());
  res.json({ ok: true });
});

app.get('/api/moods/stats', (req, res) => {
  const since = now() - 24 * 60 * 60 * 1000;        // last 24 hours
  const counts = Q.moodStats.all(since);
  const zones  = Q.recentZones.all();
  res.json({ counts, zones });
});

// letters (pass it forward)
app.post('/api/letters', (req, res) => {
  const { to_mood, body } = req.body || {};
  if (!body || body.trim().length < 4) return res.status(400).json({ error: 'letter body required' });
  const id = newId();
  Q.insertLetter.run(id, to_mood || null, body.trim(), now());
  res.json({ id, ok: true });
});

app.get('/api/letters/pull', (req, res) => {
  const mood = req.query.mood || null;
  const letter = Q.pullLetter.get(mood);
  if (!letter) return res.status(204).end();
  Q.claimLetter.run(now(), letter.id);
  res.json(letter);
});

// ---------- OpenRouter (OpenAI-compatible) ----------
const OPENROUTER_KEY      = process.env.OPENROUTER_KEY || '';
const OPENROUTER_MODEL    = process.env.OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free';
const OPENROUTER_FALLBACKS = (process.env.OPENROUTER_FALLBACKS || '').split(',').map(s => s.trim()).filter(Boolean);

async function callOpenRouter(messages, { temperature = 0, max_tokens = 200 } = {}) {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_KEY not configured');
  const tryModels = [OPENROUTER_MODEL, ...OPENROUTER_FALLBACKS];
  let lastErr;
  for (const model of tryModels) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': 'https://github.com/vibewall',
          'X-Title': 'Vibe Wall (NUTECH)'
        },
        body: JSON.stringify({ model, messages, temperature, max_tokens })
      });
      const data = await r.json();
      if (data.error) { lastErr = data.error; continue; }       // rate-limited / unavailable → try next model
      const content = data?.choices?.[0]?.message?.content;
      if (!content) { lastErr = { message: 'empty response', model }; continue; }
      return { content, model };
    } catch (err) { lastErr = err; }
  }
  throw new Error('all OpenRouter models failed: ' + JSON.stringify(lastErr));
}

// Moderate a piece of user text. Returns { allowed, reason?, source, model? }.
app.post('/api/moderate', async (req, res) => {
  const text = (req.body && req.body.text || '').trim();
  if (!text) return res.json({ allowed: true, source: 'empty' });
  if (!OPENROUTER_KEY) return res.json({ allowed: true, source: 'no-llm' });

  try {
    const { content, model } = await callOpenRouter([
      { role: 'system', content:
        'You moderate a soft, anonymous student wall. Output ONLY a JSON object: {"allow":true|false,"reason":"..."}. ' +
        'REJECT: hate speech, self-harm encouragement, doxxing (real names + locations), explicit sexual content, threats of violence. ' +
        'ALLOW: venting, sadness, mild profanity, romance, complaints, dark humour, exam stress, loneliness.'
      },
      { role: 'user', content: text }
    ], { temperature: 0, max_tokens: 80 });
    const json = content.match(/\{[\s\S]*?\}/)?.[0] || '{"allow":true}';
    const v = JSON.parse(json);
    res.json({ allowed: !!v.allow, reason: v.reason || null, source: 'openrouter', model });
  } catch (err) {
    console.error('[moderate] failed:', err.message);
    res.json({ allowed: true, source: 'llm-error', error: err.message });   // fail-open for soft launch
  }
});

// Generate a creative daily prompt (cached for the day).
let _sparkCache = { date: '', prompt: '' };
app.get('/api/spark', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  if (_sparkCache.date === today && _sparkCache.prompt) {
    return res.json({ prompt: _sparkCache.prompt, source: 'cache' });
  }
  if (!OPENROUTER_KEY) {
    return res.json({ prompt: 'draw what monday feels like in 30 seconds', source: 'fallback' });
  }
  try {
    const { content, model } = await callOpenRouter([
      { role: 'system', content: 'You write one warm, specific creative prompt for an anonymous student wall. Reply with ONLY the prompt itself, no quotes, no preamble. Under 14 words. Lowercase. About drawing, writing, or noticing something tiny about campus life. Examples: "draw the shape of your handwriting today", "write two lines about the chai you almost finished".' },
      { role: 'user', content: `Date: ${today}. Today\'s prompt:` }
    ], { temperature: 0.95, max_tokens: 40 });
    const prompt = content.trim().replace(/^["'`]|["'`]$/g, '').toLowerCase();
    _sparkCache = { date: today, prompt };
    res.json({ prompt, source: 'openrouter', model });
  } catch (err) {
    res.json({ prompt: 'draw what monday feels like in 30 seconds', source: 'llm-error', error: err.message });
  }
});

// ---------- seed once on first run ----------
const { c } = db.prepare(`SELECT COUNT(*) AS c FROM posts`).get();
if (c === 0) {
  console.log('[seed] empty DB — inserting starter posts');
  const seed = [
    ['confession', { text: 'i cried after viva and then bought myself biryani. recommend.' }, 'stressed', 'anon'],
    ['poem',       { lines: ['chai gets cold faster', 'than my will to attend 8am'] },       'bored',    'anon'],
    ['note',       { text: "you're doing better than you think. promise." },                 'stressed', '→ you'],
    ['confession', { text: 'the third floor has the best napping couch and no i won\'t say which.' }, 'bored', 'anon']
  ];
  db.exec('BEGIN');
  try {
    for (const [kind, payload, mood, who] of seed) {
      Q.insertPost.run(newId(), kind, JSON.stringify(payload), mood, who, now() - Math.floor(Math.random() * 86400000));
    }
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
}

// ---------- static frontend ----------
// Serves index.html, app.js, assets/ from the project root — so one process
// serves both the site and the API. Makes public tunneling much simpler.
app.use(express.static(STATIC_DIR, { extensions: ['html'], maxAge: '1h' }));

// Bind to 0.0.0.0 so the LAN / tunnel can reach it.
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`vibewall → http://${HOST === '0.0.0.0' ? '127.0.0.1' : HOST}:${PORT}`);
  console.log(`           serving static from: ${STATIC_DIR}`);
  console.log(`           OpenRouter: ${OPENROUTER_KEY ? '✓ configured (' + OPENROUTER_MODEL + ')' : '✗ not configured'}`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/posts?kind=all|doodle|…`);
  console.log(`  POST /api/posts        { kind, payload, mood, who }`);
  console.log(`  POST /api/moods        { mood, zone? }`);
  console.log(`  GET  /api/moods/stats`);
  console.log(`  POST /api/letters      { to_mood?, body }`);
  console.log(`  GET  /api/letters/pull?mood=...`);
  console.log(`  POST /api/moderate     { text }`);
  console.log(`  GET  /api/spark        (AI daily prompt, cached per day)`);
});
