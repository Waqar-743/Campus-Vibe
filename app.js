// ===== Campus Vibe Wall — vanilla JS, no React, no Babel =====
// Built for fast cold load: no in-browser transpilation, only one network request beyond fonts + images.

(() => {
'use strict';

// ---------- tiny DOM helper ----------
function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class' || k === 'className') el.className = v;
      else if (k === 'style' && typeof v === 'object') {
        for (const sk in v) {
          if (v[sk] == null) continue;
          if (sk.startsWith('--')) el.style.setProperty(sk, v[sk]);
          else el.style[sk] = v[sk];
        }
      }
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'dataset' && typeof v === 'object') Object.assign(el.dataset, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'ref' && typeof v === 'function') v(el);
      else el.setAttribute(k, v);
    }
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false || c === true) continue;
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}

// shorthand for an SVG element
function svg(inner, attrs = {}) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" ${Object.entries(attrs).map(([k,v])=>`${k}="${v}"`).join(' ')}>${inner}</svg>`;
  return wrap.firstChild;
}

// ---------- DATA ----------
const A = 'assets/';
const enc = s => A + encodeURIComponent(s);

const PHOTOS = {
  library: enc('liberary.png'),
  cafe: enc('cafetaria.png'),
  roof: enc('at-roof.png'),
  river: enc('at-rriver.png'),
  waterfall: enc('at-waterfall.png'),
  bench: enc('at-benceh.png'),
  bags: enc('bags.png'),
  campus1: enc('campus_life_06.png'),
  campus2: enc('campus_life_13.png'),
  campus3: enc('campus_life_14_campus_life.png'),
  mood1: enc('campus_moods_9_07.png'),
  mood2: enc('campus_moods_9_08.png'),
  mood3: enc('campus_moods_9_09.png'),
  competition: enc('competition.png'),
  drawing: enc('drawing.png'),
  food: enc('food.png'),
  friends: enc('fun-with-friend.png'),
  gossip: enc('goosip.png'),
  lab: enc('lab-task.png'),
  laptop: enc('laptop-with-dream.png'),
  playing: enc('playing-with-friend.png'),
  preview: enc('preview_contact_sheet.png'),
  bored1: enc('student_bored_10_01.png'),
  bored2: enc('student_bored_10_02.png'),
  bored3: enc('student_bored_10_03.png'),
  bored4: enc('student_bored_10_04.png'),
  bored6: enc('student_bored_10_06.png'),
  bored7: enc('student_bored_10_07.png'),
  bored8: enc('student_bored_10_08.png'),
  bored9: enc('student_bored_10_09.png'),
  bored10: enc('student_bored_10_10.png'),
  surrounded: enc('surrounded-by-people.png'),
  rain: enc('walking in rain.png'),
  social: enc('Social-media.png')
};

const MOODS = [
  { id: 'bored',    label: 'Bored',    glyph: '◌', color: 'var(--sage)',   tone: "We've got something for that.", textcolor: 'var(--sage-deep)' },
  { id: 'stressed', label: 'Stressed', glyph: '✦', color: 'var(--rose)',   tone: 'Soft landing inbound.',         textcolor: 'var(--rose-deep)' },
  { id: 'happy',    label: 'Happy',    glyph: '✿', color: 'var(--butter)', tone: 'Spread some of that around.',   textcolor: 'var(--butter-deep)' },
  { id: 'sad',      label: 'Sad',      glyph: '❍', color: 'var(--sky)',    tone: 'Someone left a note for you.',  textcolor: '#7a92b0' },
  { id: 'hyped',    label: 'Hyped',    glyph: '✺', color: 'var(--terra)',  tone: "Let's channel that.",           textcolor: 'var(--terra)' },
  { id: 'lost',     label: 'Lost',     glyph: '✸', color: 'var(--plum)',   tone: 'It happens. We\'re here.',      textcolor: 'var(--plum)' }
];

const MOOD_TO_PAIR = {
  bored:    ['#7e9078', '#a8b89e'],
  stressed: ['#c97862', '#e8c5b8'],
  happy:    ['#d9bf6c', '#f3dea4'],
  sad:      ['#7a92b0', '#b8c8d8'],
  hyped:    ['#c97862', '#e8c5b8'],
  lost:     ['#8a6a8b', '#c5a8c6']
};

// Wall items
const WALL = [
  { kind: 'photo', img: PHOTOS.library,   cap: '5pm light, library window', mood: 'happy',    who: 'F.S.',  tilt: -1.2 },
  { kind: 'confession', text: 'i cried after viva and then bought myself biryani. recommend.', mood: 'stressed', who: 'anon', tilt: 1 },
  { kind: 'song',  title: 'Pasoori', artist: 'Ali Sethi · Shae Gill', color: 'var(--rose)',  art: PHOTOS.social,     mood: 'hyped' },
  { kind: 'doodle', img: PHOTOS.drawing,  label: 'doodle no. 074', mood: 'bored', who: 'H.K.', tilt: -2 },
  { kind: 'poem',  lines: ['chai gets cold faster', 'than my will to attend 8am'], mood: 'bored', who: 'anon' },
  { kind: 'photo', img: PHOTOS.cafe,      cap: 'third cup, second wind', mood: 'stressed', who: 'R.M.', tilt: 1.5 },
  { kind: 'note',  text: "you're doing better than you think. promise.", mood: 'stressed', who: 'passed by anon → you' },
  { kind: 'song',  title: 'Tum Hi Aana', artist: 'Jubin Nautiyal',  color: 'var(--sky)',  art: PHOTOS.preview, mood: 'sad' },
  { kind: 'photo', img: PHOTOS.bored3,    cap: 'page 12. mostly margins.', mood: 'happy', who: 'Z.A.', tilt: -1 },
  { kind: 'doodle', img: PHOTOS.competition, label: 'study still life', mood: 'happy', who: 'M.K.' },
  { kind: 'confession', text: 'the third floor has the best napping couch and no i won\'t say which.', mood: 'bored', who: 'anon' },
  { kind: 'photo', img: PHOTOS.friends,   cap: 'dhaba run, 11:47pm',  mood: 'hyped', who: 'N.S.', tilt: 1.3 },
  { kind: 'poem',  lines: ['if monday were a person', 'i\'d unfollow them quietly'], mood: 'bored', who: 'F.K.' },
  { kind: 'song',  title: 'Tareefan', artist: 'Badshah', color: 'var(--butter)', art: PHOTOS.gossip, mood: 'hyped' },
  { kind: 'photo', img: PHOTOS.bench,     cap: 'found these by C-block', mood: 'happy', who: 'I.R.', tilt: -1.6 },
  { kind: 'note',  text: "drink water. it's the most boring advice and it works.", mood: 'stressed', who: '→ you' },
  { kind: 'doodle', img: PHOTOS.drawing,  label: 'watercolor mood', mood: 'happy', who: 'A.B.' },
  { kind: 'confession', text: 'i wave at the campus cat every morning. she\'s my only consistent relationship.', mood: 'lost', who: 'anon' },
  { kind: 'photo', img: PHOTOS.playing,   cap: 'race you to D-block', mood: 'hyped', who: 'anon', tilt: 1.1 },
  { kind: 'song',  title: 'Aaj Jaane Ki Zid Na Karo', artist: 'Farida Khanum', color: 'var(--plum)', art: PHOTOS.mood1, mood: 'sad' },
  { kind: 'photo', img: PHOTOS.roof,      cap: 'golden hour on the way home', mood: 'happy', who: 'S.T.', tilt: -1 },
  { kind: 'poem',  lines: ['library wifi: ★★★★★', 'library chairs: ★'], mood: 'bored', who: 'T.A.' },
  { kind: 'photo', img: PHOTOS.rain,      cap: 'walked home in it', mood: 'sad', who: 'anon', tilt: 1.4 },
  { kind: 'note',  text: "you don't have to figure out your whole life by tuesday.", mood: 'lost', who: 'passed forward' }
];

const LETTERS = [
  { from: 'anon, last tuesday', to: 'stressed', body: 'the night before viva i was you. i promise, you remember more than you think. just breathe.' },
  { from: 'F.K., 2:14am',       to: 'lost',     body: "i don't know what i'm doing either. neither does anyone else with a 4.0. we're guessing together." },
  { from: 'anon',               to: 'sad',      body: 'the campus cat by C-block will sit with you. she doesn\'t ask questions. ten minutes works wonders.' },
  { from: 'R.M.',               to: 'bored',    body: "go count the windows on B-block. there's a heart drawn in dust on the 3rd floor, second from left." },
  { from: 'anon',               to: 'happy',    body: "if you're reading this happy, drop a song on the wall. someone needs it more than you know." }
];

const TICKERS = [
  'i wave at the cleaning aunty every morning, she\'s my favourite person on campus',
  'the canteen samosa is mid but the chai is genuinely art',
  'i miss home but i don\'t miss home-cooked sabzi',
  'we live in the library now. send rations.',
  'if you see a girl crying in the staircase it\'s me. say hi.',
  'monday me would never recognize friday me',
  'midterms are a personality at this point',
  'someone leave me a song that doesn\'t make me cry'
];

const SPARKS = [
  'draw what monday feels like in 30 seconds',
  'write a 2-line couplet about chai',
  'describe today\'s sky in five words',
  'draw your hand without looking down',
  'leave a song for the next sad person',
  'design a logo for boredom'
];

const GAMES = [
  { id: 'reaction', name: 'Reaction Race', tag: '0.32s avg',     desc: 'Tap the dot the second it turns warm.',         cover: PHOTOS.roof,    color: 'var(--terra)' },
  { id: 'tictactoe', name: 'Tic-Tac-Toe', tag: 'vs. anon',       desc: 'You vs. the campus AI. Best of three.',         cover: PHOTOS.competition, color: 'var(--sage-deep)' },
  { id: 'rps',      name: 'Rock Paper Scissors', tag: 'quickplay', desc: 'Three taps, three outcomes. Settle it.',     cover: PHOTOS.playing, color: 'var(--rose-deep)' },
  { id: 'guess',    name: 'Number Guess',  tag: '1–100',          desc: 'Guess the number. Six tries. Hints included.', cover: PHOTOS.bored1,  color: 'var(--butter-deep)' },
  { id: 'wordknot', name: 'Word Knot',     tag: 'Urdu × English', desc: 'Untangle a 5-letter word before the kettle boils.', cover: PHOTOS.lab, color: 'var(--plum)' },
  { id: 'memory',   name: 'Memory Lane',   tag: 'Daily flip',     desc: 'Match polaroids of campus across years.',      cover: PHOTOS.preview, color: 'var(--terra)' },
  { id: 'trivia',   name: 'Trivia Tea',    tag: '12 sec rounds',  desc: 'Live trivia with whoever else is bored.',      cover: PHOTOS.cafe,    color: 'var(--butter-deep)' }
];

const MOOD_MAP_SEED = [
  'bored','stressed','happy','stressed','hyped','sad','bored','lost',
  'stressed','stressed','bored','bored','happy','stressed','happy','hyped',
  'lost','bored','stressed','happy','happy','hyped','stressed','bored',
  'bored','sad','sad','stressed','bored','bored','happy','stressed',
  'stressed','bored','happy','happy','hyped','happy','lost','stressed',
  'happy','hyped','happy','bored','stressed','sad','bored','happy',
  'bored','stressed','bored','happy','happy','hyped','stressed','bored',
  'stressed','stressed','bored','stressed','sad','bored','happy','hyped'
];

const HERO_COLLAGE = [
  { img: PHOTOS.library, cap: '5pm light, library', left: '4%',  top: '6%',  width: '44%', rot: -3 },
  { img: PHOTOS.cafe,    cap: 'dhaba run, late',     left: '52%', top: '4%',  width: '44%', rot: 2.5 },
  { img: PHOTOS.friends, cap: 'fun with friends',    left: '22%', top: '52%', width: '42%', rot: -1.5 }
];

// ---------- ICONS (inline svg as helpers) ----------
const I = {
  plus: (s=14) => svg(`<path class="li" d="M${s/2} 2 V${s-2} M2 ${s/2} H${s-2}"/>`, { width: s, height: s, viewBox:`0 0 ${s} ${s}`, fill:'none'}),
  arrow: (s=14) => svg(`<path class="li" d="M2 ${s/2} H${s-3} M${s-7} ${s/2-4} L${s-3} ${s/2} L${s-7} ${s/2+4}"/>`, { width:s, height:s, viewBox:`0 0 ${s} ${s}`}),
  arrowUR: (s=14) => svg(`<path class="li" d="M3 ${s-3} L${s-3} 3 M5 3 H${s-3} V${s-5}"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  brush: (s=18) => svg(`<path class="li" d="M3 ${s-3} L${s/2-1} ${s/2+1} M${s/2} ${s/2} L${s-4} 4 L${s-2} 6 L${s/2+2} ${s/2+2} Z"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  pen: (s=18) => svg(`<path class="li" d="M3 ${s-3} L${s/2-1} ${s/2+1} L${s-4} 4 L${s-2} 6 L${s/2+1} ${s/2+3} Z"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  music: (s=18) => svg(`<path class="li" d="M${s/2-3} ${s-4} a3 3 0 1 1 -3 -3 V4 H${s-3} V${s-7} a3 3 0 1 1 -3 -3"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  mic: (s=18) => svg(`<rect class="li" x="${s/2-3}" y="2" width="6" height="9" rx="3"/><path class="li" d="M3 ${s/2} a${s/2-3} ${s/2-3} 0 0 0 ${s-6} 0 M${s/2} ${s-5} V${s-2} M${s/2-3} ${s-2} H${s/2+3}"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  letter: (s=14) => svg(`<rect class="li" x="2" y="3" width="${s-4}" height="${s-6}" rx="1"/><path class="li" d="M2 4 L${s/2} ${s/2+1} L${s-2} 4"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  heart: (s=14) => svg(`<path class="li" d="M${s/2} ${s-3} C 2 ${s-7}, 1 4, ${s/2} 5 C ${s-1} 4, ${s-2} ${s-7}, ${s/2} ${s-3} Z"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  controller: (s=18) => svg(`<rect class="li" x="2" y="5" width="${s-4}" height="9" rx="3"/><path class="li" d="M5 9 H8 M6.5 7.5 V10.5 M${s-7} 9 H${s-5} M${s-9} 11 H${s-7}"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  camera: (s=18) => svg(`<rect class="li" x="2" y="5" width="${s-4}" height="${s-7}" rx="2"/><circle class="li" cx="${s/2}" cy="${s/2+1}" r="3"/><path class="li" d="M6 5 L7 3 H${s-7} L${s-6} 5"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  map: (s=18) => svg(`<path class="li" d="M3 5 L7 3 L${s-7} 5 L${s-3} 3 V${s-3} L${s-7} ${s-1} L7 ${s-3} L3 ${s-1} Z M7 3 V${s-3} M${s-7} 5 V${s-1}"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  star: (s=14) => svg(`<path class="li" d="M${s/2} 2 L${s/2+1.5} ${s/2-1} L${s-2} ${s/2-1} L${s/2+2} ${s/2+1.5} L${s/2+3} ${s-2} L${s/2} ${s/2+2} L${s/2-3} ${s-2} L${s/2-2} ${s/2+1.5} L2 ${s/2-1} L${s/2-1.5} ${s/2-1} Z"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`}),
  play: (s=12) => svg(`<path class="li" d="M3 2 L${s-2} ${s/2} L3 ${s-2} Z" fill="currentColor"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`, fill:'currentColor'}),
  close: (s=16) => svg(`<path class="li" d="M3 3 L${s-3} ${s-3} M${s-3} 3 L3 ${s-3}"/>`, {width:s,height:s,viewBox:`0 0 ${s} ${s}`})
};

// ---------- STATE ----------
const state = {
  mood: 'bored',
  composeOpen: false,
  composeTab: 'doodle',
  noteClicks: 0,           // for dodging "Drop something" button
  noteDodgeUntil: 0,
  wall: WALL.map((w, i) => ({ ...w, _id: 'w' + i, pinned: true, posX: 0, posY: 0 })),
  customLetters: [],
  customWall: [],
  composeDraft: { doodle: [], poem: ['',''], song: '', confession: '' },
  filter: 'all',
  sparkTimer: 30,
  sparkRunning: false,
  streak: 7
};

// ---------- backend bridge ----------
// If the SQLite backend is running on :3001, posts/moods are persisted there.
// If it's offline, everything still works locally (in-memory only).
// Backend now serves the static site too, so same-origin works everywhere
// (localhost, LAN, tunneled public URL). Override with window.__VIBEWALL_API.
// Fallback to :3001 if you ever load index.html via file:// or python -m http.server.
const API_BASE = (window.location.protocol === 'file:' || window.location.port === '5173')
  ? 'http://127.0.0.1:3001'
  : '';
const api = {
  base: () => window.__VIBEWALL_API || API_BASE,
  online: false,
  async ping() {
    try {
      const r = await fetch(this.base() + '/api/health', { cache: 'no-store' });
      this.online = r.ok;
    } catch { this.online = false; }
    return this.online;
  },
  async post(path, body) {
    if (!this.online) return null;
    try {
      const r = await fetch(this.base() + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) return null;
      return await r.json();
    } catch { return null; }
  },
  async get(path) {
    if (!this.online) return null;
    try {
      const r = await fetch(this.base() + path);
      if (!r.ok) return null;
      return r.status === 204 ? null : await r.json();
    } catch { return null; }
  }
};

// Map a backend post row into the shape the wall renderer expects
function backendRowToWallItem(row) {
  const base = { _id: row.id, kind: row.kind, mood: row.mood, who: row.who || 'anon', pinned: true };
  const p = row.payload || {};
  switch (row.kind) {
    case 'doodle':     return { ...base, img: p.img, label: p.label || 'doodle' };
    case 'poem':       return { ...base, lines: p.lines || ['',''] };
    case 'song':       return { ...base, title: p.title, artist: p.artist, color: p.color || 'var(--terra)', art: p.art || PHOTOS.social };
    case 'confession': return { ...base, text: p.text };
    case 'note':       return { ...base, text: p.text };
    case 'photo':      return { ...base, img: p.img, cap: p.cap };
    default:           return null;
  }
}

// ---------- helpers ----------
function setAccentForMood(m) {
  const pair = MOOD_TO_PAIR[m] || MOOD_TO_PAIR.bored;
  document.documentElement.style.setProperty('--accent', pair[0]);
  document.documentElement.style.setProperty('--accent-soft', pair[1]);
}

function toast(msg, ms = 2200) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), ms);
}

function eyebrow(text, color) {
  return h('span', { class: 'eyebrow' },
    h('span', { class: 'dot', style: color ? { background: color } : null }),
    text
  );
}

function pillBtn(label, opts = {}) {
  const cls = ['pill-btn'];
  if (opts.variant === 'ghost') cls.push('ghost');
  if (opts.variant === 'accent') cls.push('accent');
  const inner = [
    h('span', null, label),
    h('span', { class: 'icon-pod' }, opts.icon || I.arrow(14))
  ];
  if (opts.as === 'a') return h('a', { class: cls.join(' '), href: opts.href, style: opts.style }, inner);
  return h('button', { class: cls.join(' '), onClick: opts.onClick, style: opts.style, id: opts.id }, inner);
}

function bezel(inner, style, innerStyle, cls = '') {
  return h('div', { class: 'bezel ' + cls, style },
    h('div', { class: 'bezel-inner', style: innerStyle }, inner)
  );
}

// Reveal-on-scroll
const revealObserver = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.delay || '0', 10);
      setTimeout(() => e.target.classList.add('in'), delay);
      revealObserver.unobserve(e.target);
    }
  }
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

function reveal(node, delay = 0) {
  node.classList.add('reveal');
  if (delay) node.dataset.delay = delay;
  // Wait for it to be in DOM before observing
  queueMicrotask(() => revealObserver.observe(node));
  return node;
}

// ---------- NAV ----------
function FloatingNav() {
  const links = [
    { id: 'wall',    label: 'The Wall' },
    { id: 'mood',    label: 'Mood Check-in' },
    { id: 'forward', label: 'Pass Forward' },
    { id: 'create',  label: 'Create' },
    { id: 'map',     label: 'Mood Map' },
    { id: 'games',   label: 'Games' }
  ];
  const logoMark = h('div', {
    class: 'bezel', style: { padding: '5px', borderRadius: '999px', cursor: 'pointer' },
    onClick: handleLogoTap
  },
    h('div', { class: 'bezel-inner', style: { borderRadius:'999px', padding:'10px 18px', display:'flex', alignItems:'center', gap:'10px' } },
      h('span', { style: { width:'8px', height:'8px', borderRadius:'99px', background:'var(--accent)', boxShadow:'0 0 0 4px color-mix(in oklch, var(--accent) 20%, transparent)' } }),
      h('span', { class: 'serif-i', style: { fontSize:'20px', color:'var(--espresso)', letterSpacing:'-0.01em' } }, 'vibe wall'),
      h('span', { class: 'mono', style: { fontSize:'9px', letterSpacing:'0.18em', color:'var(--mocha)', textTransform:'uppercase', paddingLeft:'4px', borderLeft:'1px solid color-mix(in oklch, var(--espresso) 10%, transparent)' } }, 'nutech')
    )
  );

  const dropBtn = pillBtn('Drop something', { icon: I.plus(14), variant: 'accent', onClick: () => openCompose() });

  const wrap = h('div', {
    style: { position:'fixed', top:'24px', left:'0', right:'0', zIndex: 60, display:'flex', justifyContent:'center', pointerEvents:'none', transition: 'top 0.7s var(--ease-fluid)' }
  },
    h('div', { style: { pointerEvents:'auto', display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap', justifyContent:'center' } },
      logoMark,
      h('nav', { class: 'bezel', style: { padding:'5px', borderRadius:'999px' } },
        h('div', { class: 'bezel-inner', style: { borderRadius:'999px', padding:'6px 8px', display:'flex', gap:'2px' } },
          links.map(l => h('a', {
            href: '#' + l.id,
            style: { padding:'10px 14px', borderRadius:'999px', fontSize:'13.5px', color:'var(--cocoa)', textDecoration:'none', fontWeight:'500', transition:'background 0.5s var(--ease-fluid), color 0.5s var(--ease-fluid)' },
            onMouseenter: e => { e.currentTarget.style.background = 'color-mix(in oklch, var(--espresso) 6%, transparent)'; e.currentTarget.style.color = 'var(--espresso)'; },
            onMouseleave: e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cocoa)'; }
          }, l.label))
        )
      ),
      dropBtn
    )
  );

  window.addEventListener('scroll', () => {
    wrap.style.top = window.scrollY > 30 ? '16px' : '24px';
  }, { passive: true });

  return wrap;
}

// Easter egg — tap logo 5×
let _logoTaps = 0;
let _logoResetTimer;
function handleLogoTap() {
  _logoTaps++;
  clearTimeout(_logoResetTimer);
  _logoResetTimer = setTimeout(() => _logoTaps = 0, 1500);
  if (_logoTaps >= 5) { _logoTaps = 0; openEasterEgg(); }
}

// ---------- HERO ----------
function Hero() {
  const now = new Date();
  const hr = now.getHours();
  const greet = hr < 5 ? 'still up?' : hr < 12 ? 'morning, you' : hr < 17 ? 'afternoon, you' : hr < 21 ? 'evening, you' : 'late one tonight';

  const heroSection = h('section', { style: { position:'relative', paddingTop:'140px', paddingBottom:'80px' } },
    h('div', { class: 'container' },
      h('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px', flexWrap:'wrap', gap:'16px' } },
        reveal(h('div', null, eyebrow('Soft place between classes · NUTECH ’26'))),
        reveal(h('div', { class: 'mono', style: { fontSize:'11px', color:'var(--mocha)', letterSpacing:'0.16em', textTransform:'uppercase', textAlign:'right' } },
          h('div', null, now.toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' })),
          h('div', { style: { color:'var(--cocoa)', marginTop:'2px' } }, greet + '.')
        ), 120)
      ),
      reveal(h('h1', { class: 'hero-title', html: 'the campus,<br /><em>quietly</em> talking<br />to itself.' }), 80),
      h('div', { style: { display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:'50px', marginTop:'60px', alignItems:'end' } },
        reveal(h('div', null,
          h('p', { class:'serif', style: { fontSize:'24px', lineHeight:'1.35', color:'var(--cocoa)', maxWidth:'540px', margin:'0' },
            html: 'A soft, anonymous wall where students drop <span class="uline-accent">doodles</span>, <span class="uline-accent">two-line poems</span>, <span class="uline-accent">songs</span>, and tiny notes for whoever shows up next.'
          }),
          h('div', { style: { display:'flex', gap:'12px', marginTop:'32px', flexWrap:'wrap' } },
            DodgyAddNoteButton(),
            pillBtn('Find me an activity', { icon: I.arrowUR(14), as:'a', href:'#mood', variant:'ghost' })
          ),
          h('div', { style: { marginTop:'36px', display:'flex', gap:'24px', color:'var(--mocha)', flexWrap:'wrap' } },
            stat('2,847', 'things dropped today'),
            h('div', { class: 'vhair' }),
            stat('312', 'letters passed forward'),
            h('div', { class: 'vhair' }),
            stat('74%', 'campus feels okay')
          )
        ), 180),
        reveal(HeroCollage(), 260)
      )
    )
  );
  return heroSection;
}

function stat(n, l) {
  return h('div', null,
    h('div', { class: 'serif', style: { fontSize:'36px', lineHeight:'1', color:'var(--espresso)' } }, n),
    h('div', { class: 'mono', style: { fontSize:'10px', letterSpacing:'0.16em', color:'var(--mocha)', marginTop:'6px', textTransform:'uppercase' } }, l)
  );
}

// ---------- DRAGGABLE HERO COLLAGE ----------
function HeroCollage() {
  const wrap = h('div', { class: 'hero-collage' });

  HERO_COLLAGE.forEach((item, i) => {
    const inner = h('div', { class: 'polaroid', style: { transform: `rotate(${item.rot}deg)`, position:'static' } },
      h('img', { src: item.img, alt: item.cap, loading: 'eager', draggable:'false' }),
      h('div', { class: 'cap' }, item.cap)
    );
    const node = h('div', {
      class: 'drag-item',
      style: { left: item.left, top: item.top, width: item.width, '--r': item.rot + 'deg', animationDelay: (i * 0.3) + 's' }
    },
      h('span', { class: 'drag-hint' }, '☍ drag me anywhere'),
      inner
    );
    enableDrag(node, wrap);
    wrap.appendChild(node);
  });

  // Floating tiny note
  const note = h('div', {
    class: 'drag-item',
    style: { right:'10%', bottom:'20px', width:'120px', height:'120px', borderRadius:'999px', background:'var(--paper)', display:'grid', placeItems:'center', boxShadow:'0 20px 40px -20px rgba(0,0,0,0.35)', left:'auto', top:'auto', '--r':'8deg', transform:'rotate(8deg)' }
  },
    h('div', { class: 'serif-i', style: { fontSize:'14px', color:'var(--accent)', textAlign:'center', lineHeight:'1.1' },
      html: 'vibe<br />wall<br /><span style="font-size:9px;color:var(--mocha);letter-spacing:0.1em;font-style:normal;font-family: JetBrains Mono">est. ’26</span>' })
  );
  // Adjust positioning: convert right/bottom to left/top after first paint
  enableDrag(note, wrap);
  wrap.appendChild(note);
  // Move note to absolute left/top
  requestAnimationFrame(() => {
    const wrapRect = wrap.getBoundingClientRect();
    const noteRect = note.getBoundingClientRect();
    note.style.left = (noteRect.left - wrapRect.left) + 'px';
    note.style.top  = (noteRect.top - wrapRect.top) + 'px';
    note.style.right = 'auto'; note.style.bottom = 'auto';
  });

  return wrap;
}

function enableDrag(node, container) {
  let dragging = false, startX = 0, startY = 0, origLeft = 0, origTop = 0;
  node.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, input, textarea')) return;
    dragging = true;
    node.setPointerCapture(e.pointerId);
    node.classList.add('dragging');
    const nr = node.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    origLeft = nr.left - cr.left;
    origTop  = nr.top  - cr.top;
    // Lock to pixel position to override % values
    node.style.left = origLeft + 'px';
    node.style.top  = origTop + 'px';
    node.style.right = 'auto'; node.style.bottom = 'auto';
    startX = e.clientX; startY = e.clientY;
    e.preventDefault();
  });
  node.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const cr = container.getBoundingClientRect();
    const nw = node.offsetWidth, nh = node.offsetHeight;
    let nx = origLeft + (e.clientX - startX);
    let ny = origTop  + (e.clientY - startY);
    nx = Math.max(0, Math.min(cr.width  - nw, nx));
    ny = Math.max(0, Math.min(cr.height - nh, ny));
    node.style.left = nx + 'px';
    node.style.top  = ny + 'px';
  });
  const stop = (e) => {
    if (!dragging) return;
    dragging = false;
    node.classList.remove('dragging');
    try { node.releasePointerCapture(e.pointerId); } catch(_) {}
  };
  node.addEventListener('pointerup', stop);
  node.addEventListener('pointercancel', stop);
}

// ---------- DODGY "drop something" button ----------
// Generalized dodgy-button. After two evasions, the third click fires `onAccept`.
function makeDodgyButton({ label, icon, variant = 'accent', onAccept, hints }) {
  const btn = h('button', { type:'button', class: 'pill-btn ' + variant + ' dodgy' },
    h('span', null, label),
    h('span', { class: 'icon-pod' }, icon || I.plus(14))
  );
  const holder = h('span', { style: { position:'relative', display:'inline-block' } }, btn);

  let clicks = 0;
  let dodgeActive = false;
  let dodgeEndsAt = 0;
  let offX = 0, offY = 0;

  const msg = Object.assign({ first:'hm. try again.', second:'catch me if you can — 5s', ready:'ok. you can click me now.' }, hints || {});

  function apply() { btn.style.transform = `translate(${offX}px, ${offY}px)`; }

  btn.addEventListener('click', (e) => {
    const now = Date.now();
    if (dodgeActive && now < dodgeEndsAt) { e.preventDefault(); return; }
    clicks++;
    if (clicks === 1) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      offX += dir * (60 + Math.random() * 40);
      offY += (Math.random() - 0.5) * 20;
      apply();
      toast(msg.first);
    } else if (clicks === 2) {
      dodgeActive = true;
      dodgeEndsAt = now + 5400;
      toast(msg.second);
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const dx = cx - e.clientX, dy = cy - e.clientY;
      const mag = Math.hypot(dx, dy) || 1;
      offX += (dx/mag) * 140;
      offY += (dy/mag) * 60;
      apply();
    } else {
      offX = 0; offY = 0; apply();
      clicks = 0;
      if (typeof onAccept === 'function') onAccept(e);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!dodgeActive) return;
    if (Date.now() > dodgeEndsAt) {
      dodgeActive = false;
      toast(msg.ready);
      offX *= 0.2; offY *= 0.2; apply();
      return;
    }
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = cx - e.clientX, dy = cy - e.clientY;
    const dist = Math.hypot(dx, dy);
    if (dist < 180) {
      const force = (180 - dist) / 180;
      const mag = dist || 1;
      offX += (dx/mag) * force * 18;
      offY += (dy/mag) * force * 12;
      offX = Math.max(-260, Math.min(260, offX));
      offY = Math.max(-120, Math.min(120, offY));
      apply();
    }
  });

  return holder;
}

function DodgyAddNoteButton() {
  return makeDodgyButton({
    label: 'Drop something',
    icon: I.plus(14),
    variant: 'accent',
    onAccept: () => openCompose()
  });
}

// ---------- TICKER ----------
function ConfessionTicker() {
  const items = [...TICKERS, ...TICKERS];
  return h('section', { style: { padding:'20px 0 30px' } },
    h('div', { class:'container' },
      bezel(
        h('div', { style: { display:'flex', alignItems:'center', gap:'18px' } },
          h('span', { class:'stamp', style:{ flexShrink:0 } }, '● live · anon confessions'),
          h('div', { class: 'ticker' },
            h('div', { class: 'ticker-track' }, items.map(t => h('span', { class:'ticker-item' }, t)))
          )
        ),
        { background: 'color-mix(in oklch, var(--espresso) 8%, transparent)' },
        { padding:'16px 24px', background:'var(--paper)' }
      )
    )
  );
}

// ---------- VIBE WALL ----------
function VibeWall() {
  const filterIds = [
    { id:'all', l:'all 24' },
    { id:'photo', l:'photos' },
    { id:'doodle', l:'doodles' },
    { id:'song', l:'songs' },
    { id:'poem', l:'poems' },
    { id:'confession', l:'confessions' },
    { id:'note', l:'notes' }
  ];
  const filtersWrap = h('div', { class:'bezel', style: { borderRadius:'999px', padding:'5px' } },
    h('div', { class:'bezel-inner', style: { borderRadius:'999px', padding:'6px 8px', display:'flex', gap:'2px', flexWrap:'wrap' } },
      filterIds.map(f => h('button', {
        style: {
          padding:'9px 14px', borderRadius:'999px', fontSize:'12.5px', letterSpacing:'-0.005em',
          background: state.filter === f.id ? 'var(--espresso)' : 'transparent',
          color: state.filter === f.id ? 'var(--paper)' : 'var(--cocoa)',
          border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:'500',
          transition:'background 0.5s var(--ease-fluid)'
        },
        onClick: (e) => {
          state.filter = f.id;
          // Update buttons styling
          filtersWrap.querySelectorAll('button').forEach(b => {
            b.style.background = 'transparent'; b.style.color = 'var(--cocoa)';
          });
          e.currentTarget.style.background = 'var(--espresso)';
          e.currentTarget.style.color = 'var(--paper)';
          renderMasonry();
        }
      }, f.l))
    )
  );

  const masonryEl = h('div', { class: 'wall-grid', id: 'masonry' });

  function renderMasonry() {
    masonryEl.innerHTML = '';
    const items = state.wall.filter(w => state.filter === 'all' || w.kind === state.filter);
    items.forEach((item) => {
      if (!item.pinned) return; // currently floating — render in floating layer instead
      const card = WallCard(item);
      masonryEl.appendChild(card);
    });
  }

  // expose to global so other functions can re-render
  window.__renderMasonry = renderMasonry;
  renderMasonry();

  return h('section', { id:'wall', style:{ padding:'100px 0 80px' } },
    h('div', { class:'container' },
      h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'end', flexWrap:'wrap', gap:'24px', marginBottom:'30px' } },
        reveal(h('div', null,
          eyebrow('01 · live · the wall'),
          h('h2', { class:'serif', style:{ fontSize:'clamp(40px, 6.5vw, 88px)', lineHeight:'0.96', margin:'14px 0 0', letterSpacing:'-0.02em' },
            html: 'everything the campus<br /><em class="serif-i" style="color:var(--accent)">dropped</em> today.' })
        )),
        reveal(filtersWrap, 120)
      ),
      reveal(masonryEl, 150)
    )
  );
}

function WallCard(item) {
  const card = h('div', { class:'wall-card', 'data-id': item._id });
  // The visual content
  let body;
  switch (item.kind) {
    case 'photo':      body = PhotoCard(item); break;
    case 'confession': body = ConfessionCard(item); break;
    case 'song':       body = SongCard(item); break;
    case 'doodle':     body = DoodleCard(item); break;
    case 'poem':       body = PoemCard(item); break;
    case 'note':       body = NoteCard(item); break;
    default:           body = h('div', null, '?');
  }
  card.appendChild(body);

  // PIN
  const pin = h('button', {
    class: 'pin',
    'aria-label': 'unpin',
    title: 'unpin and let it fall',
    onClick: (e) => { e.stopPropagation(); unpinCard(item, card); }
  });
  card.appendChild(pin);

  return card;
}

function unpinCard(item, card) {
  // Get current screen position
  const rect = card.getBoundingClientRect();
  const layer = document.getElementById('floating-layer');

  card.style.position = 'fixed';
  card.style.left = rect.left + 'px';
  card.style.top  = rect.top + 'px';
  card.style.width = rect.width + 'px';
  card.style.margin = '0';
  layer.appendChild(card);

  void card.offsetWidth;
  card.classList.add('falling');
  item.pinned = false;

  // Reflow masonry without the now-floating card
  if (window.__renderMasonry) window.__renderMasonry();

  card.addEventListener('animationend', function onEnd() {
    card.removeEventListener('animationend', onEnd);
    const cr = card.getBoundingClientRect();
    card.classList.remove('falling');
    card.classList.add('floating');
    card.style.left = cr.left + 'px';
    card.style.top  = cr.top + 'px';
    card.style.transform = 'rotate(8deg)';
    // Click anywhere on the floating card to repin
    card.addEventListener('click', () => repinCard(item, card), { once: true });
    toast('it floated away. click it to pin back.');
  });
}

function repinCard(item, card) {
  // Animate a quick fade then remove and reflow masonry which will recreate the card
  card.style.transition = 'opacity 0.45s var(--ease-fluid), transform 0.45s var(--ease-fluid)';
  card.style.opacity = '0';
  card.style.transform = 'rotate(0deg) scale(0.92)';
  setTimeout(() => {
    card.remove();
    item.pinned = true;
    if (window.__renderMasonry) window.__renderMasonry();
    toast('pinned back to the wall.');
  }, 350);
}

// ---------- Wall card variants ----------
function PhotoCard({ img, cap, who, tilt = 0 }) {
  return h('div', { style: { display:'flex', flexDirection:'column', height:'100%' } },
    h('div', { class:'polaroid lift', style:{ flex:'1', minHeight:'0' } },
      h('img', { src: img, alt: cap, loading:'lazy' }),
      h('div', { class:'cap' }, cap)
    )
  );
}
function ConfessionCard({ text, who }) {
  return bezel(
    h('div', { style: { padding:'22px 22px 18px' } },
      h('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' } },
        h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.2em', color:'var(--cocoa)', textTransform:'uppercase' } }, '· confession ·'),
        h('span', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)' } }, who)
      ),
      h('p', { class:'serif-i', style:{ fontSize:'24px', lineHeight:'1.18', margin:'0', color:'var(--espresso)', textWrap:'pretty' } }, '"' + text + '"'),
      h('div', { style: { marginTop:'16px', display:'flex', gap:'8px', alignItems:'center' } },
        I.heart(14),
        h('span', { class:'mono', style:{ fontSize:'11px', color:'var(--mocha)' } }, '23 felt this')
      )
    ),
    { background: 'color-mix(in oklch, var(--rose) 30%, transparent)' }
  );
}
function PoemCard({ lines, who }) {
  return bezel(
    h('div', { style: { padding:'26px 24px' } },
      eyebrow('two lines', 'var(--butter-deep)'),
      h('div', { class:'serif-i', style:{ fontSize:'28px', lineHeight:'1.18', marginTop:'16px', color:'var(--espresso)' } },
        lines.map(l => h('div', null, l))
      ),
      h('div', { class:'mono', style: { marginTop:'16px', fontSize:'11px', color:'var(--mocha)' } }, '— ' + who)
    ),
    { background:'color-mix(in oklch, var(--butter) 30%, transparent)' },
    { background:'color-mix(in oklch, var(--butter) 12%, var(--paper))' }
  );
}
function SongCard({ title, artist, color, art }) {
  return bezel(
    h('div', { style: { padding:'14px', display:'flex', flexDirection:'column' } },
      h('div', { class: 'song-art', style: { position:'relative', borderRadius:'12px', overflow:'hidden', aspectRatio:'1' } },
        h('img', { src: art, alt: title, style:{ width:'100%', height:'100%', objectFit:'cover', display:'block' }, loading:'lazy' }),
        h('div', { style: { position:'absolute', inset:'0', background:`linear-gradient(180deg, transparent 50%, color-mix(in oklch, ${color} 70%, black) 100%)` } }),
        h('button', {
          style: { position:'absolute', right:'12px', bottom:'12px', width:'40px', height:'40px', borderRadius:'999px', background:'var(--paper)', border:'none', cursor:'pointer', display:'grid', placeItems:'center', boxShadow:'0 8px 20px -8px rgba(0,0,0,0.35)' },
          onClick: (e) => { e.stopPropagation(); toast(`▶ playing "${title}" on kiosk speaker`); }
        }, I.play(16)),
        h('span', { class:'stamp', style: { position:'absolute', top:'12px', left:'12px', background:'rgba(255,255,255,0.85)', color:'var(--espresso)' } }, '♪ song rec')
      ),
      h('div', { style: { padding:'14px 6px 6px' } },
        h('div', { class:'serif', style:{ fontSize:'22px', lineHeight:'1.05', color:'var(--espresso)' } }, title),
        h('div', { class:'mono', style:{ fontSize:'11px', color:'var(--mocha)', marginTop:'4px', letterSpacing:'0.08em' } }, artist)
      )
    ),
    { background:`color-mix(in oklch, ${color} 25%, transparent)` }
  );
}
function DoodleCard({ img, label, who, tilt = 0 }) {
  return h('div', { style: { position:'relative', transform:`rotate(${tilt}deg)` } },
    h('div', { class:'tape' }),
    bezel(
      h('div', { style: { padding:'12px', display:'flex', flexDirection:'column' } },
        h('div', { class:'doodle-img', style: { aspectRatio:'4/5', borderRadius:'10px', overflow:'hidden' } },
          h('img', { src: img, alt: label, loading:'lazy', style:{ width:'100%', height:'100%', objectFit:'cover', display:'block', filter:'saturate(0.85)' } })
        ),
        h('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'12px 8px 4px' } },
          h('span', { class:'hand', style:{ fontSize:'22px', color:'var(--cocoa)' } }, label),
          h('span', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)' } }, who)
        )
      ),
      { background:'color-mix(in oklch, var(--sage) 25%, transparent)' }
    )
  );
}
function NoteCard({ text, who }) {
  return bezel(
    h('div', { style: { padding:'22px 22px 20px', position:'relative' } },
      h('span', { class:'stamp', style: { background:'color-mix(in oklch, var(--sage-deep) 25%, transparent)', color:'var(--sage-deep)' } }, '✉ passed forward'),
      h('p', { class:'serif-i', style:{ fontSize:'26px', lineHeight:'1.18', margin:'16px 0 8px', color:'var(--espresso)', textWrap:'pretty' } }, text),
      h('div', { class:'mono', style:{ fontSize:'10px', color:'var(--sage-deep)', letterSpacing:'0.16em', textTransform:'uppercase' } }, who)
    ),
    { background:'color-mix(in oklch, var(--sage) 30%, transparent)' },
    { background:'color-mix(in oklch, var(--sage) 14%, var(--paper))' }
  );
}

// ---------- MOOD CHECK-IN ----------
function MoodCheckIn() {
  const section = h('section', { id:'mood', style:{ padding:'100px 0 60px' } });
  function render() {
    section.innerHTML = '';
    const m = MOODS.find(x => x.id === state.mood) || MOODS[0];
    section.appendChild(h('div', { class:'container' },
      h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'end', flexWrap:'wrap', gap:'24px', marginBottom:'36px' } },
        reveal(h('div', null,
          eyebrow('02 · mood check-in'),
          h('h2', { class:'serif', style:{ fontSize:'clamp(40px, 6vw, 84px)', lineHeight:'0.98', margin:'14px 0 0', letterSpacing:'-0.02em' },
            html: 'how are you<br /><em class="serif-i" style="color:var(--accent)">actually</em> today?' })
        )),
        reveal(h('p', { class:'serif', style:{ fontSize:'19px', lineHeight:'1.35', color:'var(--cocoa)', maxWidth:'360px', margin:'0' } },
          'Tap a feeling. The page softens around it. You get three things that match — and a note from someone who felt the same.'), 140)
      ),
      reveal(h('div', { class:'moods' }, MOODS.map(opt =>
        h('button', {
          style: { background:'transparent', border:'none', padding:'0', cursor:'pointer', fontFamily:'inherit', textAlign:'left' },
          onClick: () => {
            state.mood = opt.id; setAccentForMood(opt.id); render();
            toast(`mood set: ${opt.label.toLowerCase()}`);
            api.post('/api/moods', { mood: opt.id, zone: Math.floor(Math.random() * 64) });
          }
        },
          bezel(
            h('div', null,
              h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' } },
                h('span', { style: { fontSize:'26px', color:opt.textcolor, fontFamily:'Instrument Serif', lineHeight:'1' } }, opt.glyph),
                h('span', { style: { width:'8px', height:'8px', borderRadius:'99px', background:opt.textcolor, opacity: state.mood===opt.id?'1':'0.3', transition:'opacity 0.5s var(--ease-fluid)' } })
              ),
              h('div', { class:'serif', style:{ fontSize:'26px', lineHeight:'1', color:'var(--espresso)' } }, opt.label),
              h('div', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--mocha)', marginTop:'8px', textTransform:'uppercase' } }, "· tap if it's you ·")
            ),
            { background: state.mood===opt.id ? `color-mix(in oklch, ${opt.color} 60%, transparent)` : 'color-mix(in oklch, var(--linen) 50%, transparent)', transition: 'background 0.6s var(--ease-fluid)' },
            { background: state.mood===opt.id ? `color-mix(in oklch, ${opt.color} 22%, var(--paper))` : 'var(--paper)', padding:'20px 18px 22px', transition:'background 0.6s var(--ease-fluid)' },
            'lift'
          )
        )
      )), 180),
      h('div', { style: { marginTop:'36px' } },
        bezel(
          h('div', { style: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'22px' } },
            h('div', null,
              h('span', { class:'stamp', style:{ background:`color-mix(in oklch, ${m.textcolor} 22%, transparent)`, color:m.textcolor } }, '· you said: ' + m.label.toLowerCase() + ' ·'),
              h('h3', { class:'serif-i', style:{ fontSize:'34px', lineHeight:'1.05', margin:'16px 0 8px', color:'var(--espresso)' } }, m.tone),
              h('p', { class:'serif', style:{ fontSize:'16px', lineHeight:'1.4', color:'var(--cocoa)', margin:'0' } },
                "We pulled three soft things from the wall that match how you're feeling. Pick one. Or just sit here. No pressure.")
            ),
            ActivityCard(state.mood, 0),
            ActivityCard(state.mood, 1)
          ),
          { background: `color-mix(in oklch, ${m.color} 50%, transparent)` },
          { background: `color-mix(in oklch, ${m.color} 12%, var(--paper))`, padding:'28px' }
        )
      )
    ));
  }
  render();
  return section;
}

function ActivityCard(mood, idx) {
  const recs = {
    bored: [
      { tag:'60 sec', title:'Reaction Race',     body:'Hands on, brain off. Tap when the dot warms up.', icon:I.controller(18), action: openEasterEgg },
      { tag:'2 min',  title:'Doodle no. 075',     body:"Today's prompt: draw your hand without looking.", icon:I.brush(18), action: () => openCompose('doodle') }
    ],
    stressed: [
      { tag:'1 min',  title:'A letter found you', body:'Someone passed forward a note for stressed students.', icon:I.letter(18), action: () => scrollTo('forward') },
      { tag:'3 min',  title:'Slow chai playlist', body:'12 songs, no skips, made by anon for anon.', icon:I.music(18), action: () => toast('▶ slow chai playlist · 12 tracks queued') }
    ],
    happy: [
      { tag:'30 sec', title:'Pass it forward',    body:'Leave one good thing for the next stressed student.', icon:I.letter(18), action: () => scrollTo('forward') },
      { tag:'1 min',  title:'Drop a song',        body:'Spread the good. Someone needs your taste right now.', icon:I.music(18), action: () => openCompose('song') }
    ],
    sad: [
      { tag:'2 min',  title:'Sit with this',      body:'A 2-line poem someone wrote for exactly this feeling.', icon:I.pen(18), action: () => scrollTo('wall') },
      { tag:'1 min',  title:'The campus cat',     body:"Live cam from C-block. She's currently asleep. So real.", icon:I.camera(18), action: () => toast('· cat cam offline today. she\'s on a walk. ·') }
    ],
    hyped: [
      { tag:'2 min',  title:'Doodle Wars',        body:'Same prompt, two people, ninety seconds. Tournament style.', icon:I.brush(18), action: () => openCompose('doodle') },
      { tag:'12 sec', title:'Trivia Tea',         body:'Whoever else is online vs. you. Quick rounds, no mercy.', icon:I.controller(18), action: () => toast('☕ trivia tea · matching you with 1 other anon…') }
    ],
    lost: [
      { tag:'1 min',  title:"You're not alone-lost", body:'Read 5 notes from other lost students. Anonymity attached.', icon:I.letter(18), action: () => scrollTo('forward') },
      { tag:'2 min',  title:'A mini map of right now', body:"Where everyone else's heads are at, this exact minute.", icon:I.map(18), action: () => scrollTo('map') }
    ]
  };
  const card = (recs[mood] || recs.bored)[idx];
  return h('div', {
    style: { background:'var(--paper)', borderRadius:'16px', padding:'20px',
             boxShadow:'inset 0 0 0 1px color-mix(in oklch, var(--espresso) 8%, transparent), 0 14px 30px -20px rgba(40,28,16,0.2)',
             display:'flex', flexDirection:'column', justifyContent:'space-between' }
  },
    h('div', null,
      h('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'center' } },
        h('span', { style:{ width:'36px', height:'36px', borderRadius:'99px', background:'color-mix(in oklch, var(--accent) 14%, transparent)', color:'var(--accent)', display:'grid', placeItems:'center' } }, card.icon),
        h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.16em', color:'var(--mocha)', textTransform:'uppercase' } }, card.tag)
      ),
      h('h4', { class:'serif', style:{ fontSize:'26px', lineHeight:'1.05', margin:'18px 0 8px', color:'var(--espresso)' } }, card.title),
      h('p', { style: { fontSize:'14px', lineHeight:'1.45', color:'var(--cocoa)', margin:'0' } }, card.body)
    ),
    h('button', { class:'pill-btn', style:{ marginTop:'18px', width:'fit-content' }, onClick: card.action },
      h('span', null, 'begin'),
      h('span', { class:'icon-pod' }, I.arrow(12))
    )
  );
}

function scrollTo(id) {
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- PASS IT FORWARD ----------
function PassForward() {
  const section = h('section', { id:'forward', style:{ padding:'120px 0 80px' } });
  let openIdx = null;
  let draft = '';

  function render() {
    section.innerHTML = '';
    const draftEl = h('textarea', {
      placeholder: 'i wish someone had told me…',
      maxlength: '180',
      rows: '3',
      style: { width:'100%', padding:'16px 18px', fontFamily:'Instrument Serif, serif', fontStyle:'italic', fontSize:'22px', background:'var(--paper)', color:'var(--espresso)', border:'none', borderRadius:'14px', boxShadow:'inset 0 0 0 1px color-mix(in oklch, var(--espresso) 10%, transparent)', resize:'none', outline:'none' },
      onInput: (e) => { draft = e.target.value; counter.textContent = `${draft.length}/180`; }
    });
    draftEl.value = draft;
    const counter = h('span', { class:'mono', style:{ position:'absolute', bottom:'12px', right:'16px', fontSize:'10px', color:'var(--mocha)' } }, `${draft.length}/180`);

    const sendBtn = makeDodgyButton({
      label: 'pass it forward',
      icon: I.letter(14),
      variant: 'accent',
      hints: { first: 'wait — make sure you mean it.', second: 'really? prove it. catch me — 5s', ready: 'ok. one more click sends it.' },
      onAccept: () => {
        if (!draft.trim()) { toast('write at least one line ✎'); return; }
        const letter = { from: 'you, just now', to: state.mood, body: draft.trim() };
        state.customLetters.unshift(letter);
        toast('✉ delivered to one anon.');
        draft = ''; draftEl.value = ''; counter.textContent = '0/180';
        render();
      }
    });

    const allLetters = [...state.customLetters, ...LETTERS];

    section.appendChild(h('div', { class:'container' },
      h('div', { style:{ textAlign:'center', marginBottom:'50px' } },
        reveal(h('div', null, eyebrow('03 · pass it forward'))),
        reveal(h('h2', { class:'serif', style:{ fontSize:'clamp(46px, 7vw, 104px)', lineHeight:'0.95', margin:'16px auto 16px', letterSpacing:'-0.02em', maxWidth:'900px' },
          html: 'leave one good thing for<br /><em class="serif-i" style="color:var(--accent)">the next bored student.</em>' }), 120),
        reveal(h('p', { class:'serif', style:{ fontSize:'19px', lineHeight:'1.4', color:'var(--cocoa)', maxWidth:'580px', margin:'0 auto' } },
          'An anonymous letter chain. You read one, you write one. It gets delivered to someone feeling exactly the way you felt today.'), 200)
      ),
      reveal(h('div', { style:{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'22px', marginBottom:'30px' } },
        allLetters.slice(0, 3).map((l, i) => h('div', {
          class: 'envelope lift' + (openIdx === i ? ' open' : ''),
          style: { animationDelay: (i * 0.2) + 's' },
          onClick: () => { openIdx = openIdx === i ? null : i; render(); }
        },
          h('div', { class:'envelope-flap' }),
          h('div', { class:'envelope-letter' },
            h('span', { class:'mono', style:{ fontSize:'9px', letterSpacing:'0.16em', color:'var(--mocha)', textTransform:'uppercase' } }, 'to: feeling ' + l.to),
            h('p', { class:'serif-i', style:{ fontSize:'19px', lineHeight:'1.25', margin:'8px 0 8px', color:'var(--espresso)' } }, '"' + l.body + '"'),
            h('span', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)' } }, '— ' + l.from)
          ),
          h('div', { class:'envelope-seal' }, 'w')
        )
      )), 250),
      reveal(bezel(
        h('div', { style:{ display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:'28px', alignItems:'center' } },
          h('div', null,
            eyebrow('your turn', 'var(--sage-deep)'),
            h('h3', { class:'serif-i', style:{ fontSize:'38px', lineHeight:'1.04', margin:'12px 0 8px', color:'var(--espresso)' } }, 'write something for whoever needs it next.'),
            h('p', { class:'serif', style:{ fontSize:'16px', lineHeight:'1.4', color:'var(--cocoa)', margin:'0 0 20px' },
              html: 'No names, no logins. Just one line that would have helped <em>you</em> earlier today.' }),
            h('div', { style:{ position:'relative' } }, draftEl, counter),
            h('div', { style: { display:'flex', gap:'12px', marginTop:'16px', alignItems:'center', flexWrap:'wrap' } },
              sendBtn,
              h('span', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)', letterSpacing:'0.14em', textTransform:'uppercase' } }, '· delivered to one anon ·')
            )
          ),
          h('div', { style:{ position:'relative', aspectRatio:'1', maxWidth:'380px', marginLeft:'auto' } },
            [2,1,0].map(i => h('div', {
              style: {
                position:'absolute', inset:'0',
                transform:`rotate(${(i-1)*4}deg) translate(${(i-1)*14}px, ${i*-10}px)`,
                background: ['color-mix(in oklch, var(--rose) 60%, var(--paper))','color-mix(in oklch, var(--butter) 60%, var(--paper))','color-mix(in oklch, var(--sage) 60%, var(--paper))'][i],
                borderRadius:'14px',
                boxShadow:'0 24px 40px -24px rgba(40,28,16,0.4), inset 0 0 0 1px rgba(0,0,0,0.06)',
                padding:'22px', display:'flex', flexDirection:'column', justifyContent:'space-between'
              }
            },
              h('div', null,
                h('div', { class:'mono', style:{ fontSize:'9px', letterSpacing:'0.18em', color:'var(--mocha)', textTransform:'uppercase', marginBottom:'8px' } }, 'letter no. ' + (1247 - i)),
                h('p', { class:'serif-i', style:{ fontSize:'18px', lineHeight:'1.2', color:'var(--espresso)', margin:'0' } },
                  ['...','...the chai stand at 11pm is open later than you think.', ''][i] || '')
              ),
              h('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'end' } },
                h('span', { class:'hand', style:{ fontSize:'22px', color:'var(--cocoa)' } }, '♡'),
                h('span', { class:'mono', style:{ fontSize:'9px', color:'var(--mocha)' } }, 'via anon')
              )
            ))
          )
        ),
        { background:'color-mix(in oklch, var(--sage) 40%, transparent)' },
        { padding:'28px', background:'color-mix(in oklch, var(--sage) 8%, var(--paper))' }
      ), 300)
    ));
  }
  render();
  return section;
}

// ---------- CREATIVE DROP ZONE ----------
function CreativeDropZone() {
  const tiles = [
    { key:'poem',       label:'Two Lines',    desc:'Urdu / English / Roman Urdu — say it small.', color:'var(--butter)', icon:I.pen(20),   kicker:'a couplet about chai is mandatory' },
    { key:'song',       label:'Drop a Song',  desc:'10 seconds, played on the kiosk speaker.',    color:'var(--rose)',   icon:I.music(20), kicker:"today's most-dropped: 'Pasoori'" },
    { key:'confession', label:'Voice / Confess', desc:'A laugh, a thought, a confession — 180 chars.', color:'var(--plum)', icon:I.mic(20), kicker:"the wall's quietest section" }
  ];

  const featured = h('div', { class:'bezel-inner doodle-pad', style:{ padding:'30px', position:'relative' } },
    h('div', { style: { display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'24px', alignItems:'center' } },
      h('div', null,
        eyebrow('featured · doodle pad', 'var(--sage-deep)'),
        h('h3', { class:'serif', style:{ fontSize:'clamp(32px, 4vw, 48px)', lineHeight:'1', margin:'14px 0 10px', color:'var(--espresso)' } }, 'draw on a shared canvas.'),
        h('p', { class:'serif', style:{ fontSize:'16px', lineHeight:'1.4', color:'var(--cocoa)', margin:'0 0 22px', maxWidth:'420px' } },
          'Open the pad. Pick a brush. Doodle anything — a face, your mood, a stupid shape. It joins everyone else\'s on the wall.'),
        h('div', { style: { display:'flex', gap:'10px', marginBottom:'22px', flexWrap:'wrap', alignItems:'center' } },
          h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--mocha)', textTransform:'uppercase', marginRight:'4px' } }, 'pick a brush:'),
          ['#2A221B','#C97862','#A8B89E','#F3DEA4','#E8C5B8','#8A6A8B'].map(c =>
            h('button', {
              type: 'button',
              style: { width:'34px', height:'34px', borderRadius:'999px', background:c, boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.08), 0 4px 10px -6px rgba(0,0,0,0.3)', cursor:'pointer', border:'none', transition:'transform 0.2s var(--ease-spring)' },
              title: 'draw with ' + c,
              onMouseenter: (e) => { e.currentTarget.style.transform = 'scale(1.15)'; },
              onMouseleave: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
              onClick: () => openCompose('doodle', { color: c })
            })
          )
        ),
        h('div', { style:{ display:'flex', gap:'10px', flexWrap:'wrap' } },
          pillBtn('open the pad', { variant:'accent', icon: I.arrowUR(14), onClick: () => openCompose('doodle') }),
          pillBtn("see today's prompt", { variant:'ghost', icon: I.brush(14), onClick: () => { toast("today's prompt: " + SPARKS[new Date().getDate() % SPARKS.length], 3200); } })
        )
      ),
      h('div', { style: { background:'var(--paper)', borderRadius:'18px', padding:'18px', boxShadow:'inset 0 0 0 1px color-mix(in oklch, var(--espresso) 10%, transparent)' } },
        svg(`<path d="M30,120 C 60,40, 110,160, 150,90 S 230,30, 270,110 S 350,140, 380,60" stroke="var(--accent)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M50,150 q 40,-20, 80,0 t 80,0 t 80,0 t 80,0" stroke="var(--espresso)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5"/>
          <circle cx="100" cy="60" r="7" fill="var(--butter-deep)"/>
          <circle cx="240" cy="50" r="5" fill="var(--sage-deep)"/>
          <circle cx="340" cy="100" r="6" fill="var(--rose-deep)"/>`,
          { viewBox:'0 0 400 180', preserveAspectRatio:'xMidYMid meet', style:'width:100%;height:auto;display:block;' })
      )
    )
  );

  return h('section', { id:'create', style:{ padding:'120px 0 80px' } },
    h('div', { class:'container' },
      h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'end', flexWrap:'wrap', gap:'24px', marginBottom:'50px' } },
        reveal(h('div', null,
          eyebrow('04 · creative drop zone'),
          h('h2', { class:'serif', style:{ fontSize:'clamp(40px, 6vw, 84px)', lineHeight:'0.98', margin:'14px 0 0', letterSpacing:'-0.02em' },
            html: 'four soft ways<br />to <em class="serif-i" style="color:var(--accent)">make something.</em>' })
        )),
        reveal(h('p', { class:'serif', style:{ fontSize:'18px', lineHeight:'1.35', color:'var(--cocoa)', maxWidth:'360px', margin:'0' } },
          "Each one finishes in under two minutes. Each one ends up on the wall, anonymously. That's the only rule."), 120)
      ),
      // Featured first, full width
      reveal(h('div', { class:'bezel', style:{ background:'color-mix(in oklch, var(--sage) 40%, transparent)', marginBottom:'22px' } }, featured), 120),
      // Tiles row underneath
      h('div', { style: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'22px' } },
        tiles.map((t, i) => reveal(h('div', { class:'bezel lift', style:{ background:`color-mix(in oklch, ${t.color} 35%, transparent)` } },
          h('div', { class:'bezel-inner', style:{ background:`color-mix(in oklch, ${t.color} 10%, var(--paper))`, padding:'22px', minHeight:'230px', display:'flex', flexDirection:'column', justifyContent:'space-between' } },
            h('div', null,
              h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' } },
                h('span', { style:{ width:'40px', height:'40px', borderRadius:'999px', background:`color-mix(in oklch, ${t.color} 50%, var(--paper))`, color:'var(--espresso)', display:'grid', placeItems:'center' } }, t.icon),
                h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--mocha)', textTransform:'uppercase' } }, '0' + (i + 2))
              ),
              h('h4', { class:'serif', style:{ fontSize:'30px', lineHeight:'1', margin:'4px 0 6px', color:'var(--espresso)' } }, t.label),
              h('p', { style:{ fontSize:'14px', lineHeight:'1.4', color:'var(--cocoa)', margin:'0' } }, t.desc)
            ),
            h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'end', marginTop:'18px', gap:'10px' } },
              h('span', { class:'hand', style:{ fontSize:'18px', color:'var(--cocoa)', lineHeight:'1.05', flex:'1' } }, t.kicker),
              h('button', { type:'button', class:'pill-btn ghost', style:{ padding:'6px 6px 6px 14px', fontSize:'12px' }, onClick: () => openCompose(t.key) },
                h('span', null, 'start'),
                h('span', { class:'icon-pod', style: { width:'24px', height:'24px' } }, I.arrow(11))
              )
            )
          )
        ), 180 + i * 80))
      )
    )
  );
}

// ---------- DAILY SPARK ----------
function DailySpark() {
  const fallback = SPARKS[new Date().getDate() % SPARKS.length];
  const promptEl = h('h3', { class:'serif-i', style:{ fontSize:'clamp(40px, 5.5vw, 72px)', lineHeight:'1', margin:'16px 0 12px', color:'var(--espresso)' } }, '"' + fallback + '"');
  // Fetch an AI-generated prompt from /api/spark if the backend is online.
  const tryAISpark = async () => {
    if (!api.online) return;
    const result = await api.get('/api/spark');
    if (result && result.prompt) {
      promptEl.textContent = '"' + result.prompt + '"';
    }
  };
  // Wait a tick so api.ping() can complete first
  setTimeout(tryAISpark, 800);

  const timerEl = h('span', { class:'serif', style:{ fontSize:'40px', color:'var(--accent)' } }, '0:30');
  let timer = null;

  function start() {
    if (state.sparkRunning) return;
    state.sparkRunning = true; state.sparkTimer = 30;
    timer = setInterval(() => {
      state.sparkTimer--;
      timerEl.textContent = '0:' + String(state.sparkTimer).padStart(2,'0');
      if (state.sparkTimer <= 0) {
        clearInterval(timer); state.sparkRunning = false;
        toast('time! drop your spark on the wall →');
        openCompose('doodle');
      }
    }, 1000);
    toast('30s timer started — make something fast.');
  }

  const sparkImgs = [PHOTOS.drawing, PHOTOS.lab, PHOTOS.competition, PHOTOS.mood2, PHOTOS.mood3, PHOTOS.preview];

  return h('section', { style:{ padding:'60px 0 60px' } },
    h('div', { class:'container' },
      reveal(h('div', { class:'bezel', style:{ background:'color-mix(in oklch, var(--terra) 40%, transparent)' } },
        h('div', { class:'bezel-inner', style:{ background:'linear-gradient(135deg, color-mix(in oklch, var(--terra) 18%, var(--paper)) 0%, color-mix(in oklch, var(--butter) 25%, var(--paper)) 100%)', padding:'36px' } },
          h('div', { style:{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'30px', alignItems:'center' } },
            h('div', null,
              eyebrow("today's daily spark · " + new Date().toLocaleDateString(undefined,{ day:'numeric', month:'short' }).toLowerCase(), 'var(--terra)'),
              promptEl,
              h('p', { class:'serif', style:{ fontSize:'16px', lineHeight:'1.4', color:'var(--cocoa)', margin:'0 0 22px', maxWidth:'460px' } },
                "One creative prompt a day. Everyone's responses get hung side by side on the wall — a campus art gallery refreshing every 24 hours."),
              h('div', { style:{ display:'flex', gap:'16px', alignItems:'center', flexWrap:'wrap' } },
                pillBtn('start the timer', { variant:'accent', icon: I.brush(14), onClick: start }),
                timerEl,
                h('span', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)', letterSpacing:'0.14em', textTransform:'uppercase' } }, '· 184 responses already ·')
              )
            ),
            h('div', { style:{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px' } },
              sparkImgs.map((p, i) => h('div', { style:{ aspectRatio:'1', borderRadius:'10px', overflow:'hidden', transform:`rotate(${(i%2?1:-1)*1.5}deg)`, boxShadow:'0 14px 24px -16px rgba(0,0,0,0.3)' } },
                h('img', { src: p, loading:'lazy', style:{ width:'100%', height:'100%', objectFit:'cover', display:'block', filter:'saturate(0.85)' } })
              ))
            )
          )
        )
      ))
    )
  );
}

// ---------- MOOD MAP ----------
function MoodMap() {
  const colors = { bored:'var(--sage)', stressed:'var(--rose)', happy:'var(--butter)', sad:'var(--sky)', hyped:'var(--terra)', lost:'var(--plum)' };
  const counts = MOOD_MAP_SEED.reduce((a, m) => { a[m] = (a[m] || 0) + 1; return a; }, {});
  const total = MOOD_MAP_SEED.length;
  return h('section', { id:'map', style:{ padding:'120px 0 80px' } },
    h('div', { class:'container' },
      h('div', { style:{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'50px', alignItems:'center' } },
        reveal(h('div', null,
          eyebrow('05 · mood map · live'),
          h('h2', { class:'serif', style:{ fontSize:'clamp(40px, 6vw, 80px)', lineHeight:'0.98', margin:'14px 0 16px', letterSpacing:'-0.02em' },
            html: 'how the campus<br /><em class="serif-i" style="color:var(--accent)">feels</em>, right now.' }),
          h('p', { class:'serif', style:{ fontSize:'18px', lineHeight:'1.4', color:'var(--cocoa)', margin:'0 0 28px', maxWidth:'460px' } },
            "Anonymous mood check-ins, plotted as a soft heatmap of the campus. You see you're not alone in feeling whatever you're feeling."),
          h('div', { style:{ display:'flex', flexDirection:'column', gap:'12px' } },
            MOODS.map(m => {
              const c = counts[m.id] || 0;
              const pct = Math.round((c / total) * 100);
              return h('div', { style:{ display:'flex', alignItems:'center', gap:'14px' } },
                h('span', { style:{ width:'14px', height:'14px', borderRadius:'4px', background:colors[m.id], boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.06)' } }),
                h('span', { style:{ fontSize:'14px', color:'var(--cocoa)', width:'80px', textTransform:'lowercase' } }, m.label),
                h('div', { class:'progress-track', style:{ flex:'1' } },
                  h('div', { style:{ width: pct + '%', background:colors[m.id] } })
                ),
                h('span', { class:'mono', style:{ fontSize:'11px', color:'var(--mocha)', width:'36px', textAlign:'right' } }, pct + '%')
              );
            })
          )
        )),
        reveal(bezel(
          h('div', null,
            h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' } },
              h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.16em', color:'var(--mocha)', textTransform:'uppercase' } }, 'nutech main campus · 8×8 zones'),
              h('span', { class:'stamp' }, '● 247 check-ins · live')
            ),
            h('div', { style:{ display:'grid', gridTemplateColumns:'repeat(8, 1fr)', gap:'6px' } },
              MOOD_MAP_SEED.map((m, i) => h('div', {
                class:'moodmap-cell',
                style:{ background:colors[m], opacity: 0.45 + (((i * 7) % 11) / 22), boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.04)' },
                title: m, onClick: () => toast(`zone ${i+1}: ${m}`)
              }))
            ),
            h('div', { style:{ marginTop:'16px', display:'flex', justifyContent:'space-between', alignItems:'center' } },
              h('span', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)' } }, '← A-block'),
              h('span', { class:'serif-i', style:{ fontSize:'16px', color:'var(--cocoa)' } }, "turns out you're really not the only one."),
              h('span', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)' } }, 'D-block →')
            )
          ),
          { background:'color-mix(in oklch, var(--linen) 60%, transparent)' },
          { padding:'20px', background:'var(--paper)' }
        ), 150)
      )
    )
  );
}

// ---------- GAMES ----------
function Games() {
  return h('section', { id:'games', style:{ padding:'100px 0 80px' } },
    h('div', { class:'container' },
      h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'end', flexWrap:'wrap', gap:'24px', marginBottom:'40px' } },
        reveal(h('div', null,
          eyebrow('06 · quick quest · games corner'),
          h('h2', { class:'serif', style:{ fontSize:'clamp(40px, 6vw, 80px)', lineHeight:'0.98', margin:'14px 0 0', letterSpacing:'-0.02em' },
            html: 'sixty-second games, for<br /><em class="serif-i" style="color:var(--accent)">the in-between.</em>' })
        )),
        reveal(h('div', { class:'bezel', style:{ borderRadius:'999px', padding:'5px' } },
          h('div', { class:'bezel-inner', style:{ padding:'10px 18px', borderRadius:'999px', display:'flex', alignItems:'center', gap:'12px' } },
            I.star(14),
            h('span', { class:'serif-i', style:{ fontSize:'18px', color:'var(--espresso)' } }, 'your streak:'),
            h('span', { class:'serif', style:{ fontSize:'22px', color:'var(--accent)' } }, state.streak + ' days'),
            h('span', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)', letterSpacing:'0.14em', textTransform:'uppercase' } }, '· brush unlocked ·')
          )
        ), 140)
      ),
      h('div', { style:{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'22px' } },
        GAMES.map((g, i) => reveal(h('div', { class:'bezel lift', style:{ background:`color-mix(in oklch, ${g.color} 30%, transparent)` } },
          h('div', { class:'bezel-inner', style:{ padding:'14px' } },
            h('div', { class:'game-cover', style:{ backgroundImage:`url(${g.cover})` } },
              h('div', { style:{ position:'absolute', inset:'0', background:`linear-gradient(180deg, transparent 50%, color-mix(in oklch, ${g.color} 75%, black) 100%)` } }),
              h('span', { class:'stamp', style:{ position:'absolute', top:'10px', left:'10px', background:'rgba(255,255,255,0.85)', color:'var(--espresso)' } }, g.tag),
              h('span', { class:'hand', style:{ position:'absolute', bottom:'14px', left:'14px', fontSize:'28px', color:'var(--paper)' } }, g.name)
            ),
            h('div', { style:{ padding:'14px 8px 6px', display:'flex', justifyContent:'space-between', alignItems:'end', gap:'10px' } },
              h('p', { class:'serif', style:{ fontSize:'14px', lineHeight:'1.35', color:'var(--cocoa)', margin:'0', flex:'1' } }, g.desc),
              h('button', { class:'pill-btn', style:{ padding:'6px 6px 6px 12px', fontSize:'12px' }, onClick: () => launchGame(g) },
                h('span', null, 'play'),
                h('span', { class:'icon-pod', style:{ width:'24px', height:'24px' } }, I.play(11))
              )
            )
          )
        ), 120 + i * 80))
      ),
      reveal(h('div', { style:{ marginTop:'32px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'22px' } },
        LeaderCard(1, "Hadia · CS '27", '14,820', false, false),
        LeaderCard(7, 'you', '9,140', true, false),
        LeaderCard(28, 'campus avg', '3,210', false, true)
      ), 400)
    )
  );
}

function LeaderCard(rank, who, pts, me, sub) {
  return bezel(
    h('div', { style:{ padding:'18px', background: me ? 'color-mix(in oklch, var(--accent) 10%, var(--paper))' : 'var(--paper)', display:'flex', alignItems:'center', gap:'16px', borderRadius:'calc(var(--radius-xl) - 0.375rem)' } },
      h('div', { class:'serif-i', style:{ fontSize:'44px', color: me ? 'var(--accent)' : 'var(--mocha)', lineHeight:'1', width:'60px' } }, '#' + rank),
      h('div', { style:{ flex:'1' } },
        h('div', { class:'serif', style:{ fontSize:'22px', color:'var(--espresso)' } }, who),
        h('div', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)', letterSpacing:'0.14em', textTransform:'uppercase', marginTop:'2px' } }, sub ? 'across 2,847 students' : 'boredom points · this week')
      ),
      h('div', { class:'serif', style:{ fontSize:'22px', color: me ? 'var(--accent)' : 'var(--espresso)' } }, pts)
    ),
    { background: me ? 'color-mix(in oklch, var(--accent) 35%, transparent)' : 'color-mix(in oklch, var(--linen) 50%, transparent)' }
  );
}

function launchGame(g) {
  if (g.id === 'reaction')      openEasterEgg();
  else if (g.id === 'tictactoe') openGameModal(TicTacToe());
  else if (g.id === 'rps')      openGameModal(RockPaperScissors());
  else if (g.id === 'guess')    openGameModal(NumberGuess());
  else if (g.id === 'wordknot') openGameModal(WordKnot());
  else if (g.id === 'memory')   openGameModal(MemoryLane());
  else if (g.id === 'trivia')   openGameModal(TriviaTea());
}

function openGameModal(content) {
  const modal = document.getElementById('game-modal');
  const body  = document.getElementById('game-modal-body');
  body.innerHTML = '';
  body.appendChild(content);
  modal.classList.add('show');
  // backdrop click to close
  modal.onclick = (e) => { if (e.target === modal) closeGameModal(); };
}
function closeGameModal() {
  document.getElementById('game-modal').classList.remove('show');
}

function gameHeader(title, sub) {
  return h('div', null,
    h('h3', null, title),
    h('p', { class:'sub' }, sub)
  );
}
function gameFooter(onClose) {
  return h('div', { style:{ display:'flex', justifyContent:'flex-end', marginTop:'18px' } },
    pillBtn('close', { variant:'ghost', icon: I.close(12), onClick: onClose || closeGameModal })
  );
}

// ----- Tic-Tac-Toe (you = X, AI = O, simple "win/block/center/corner" heuristic) -----
function TicTacToe() {
  let board = Array(9).fill(null);
  let gameOver = false;
  let status = "you're X. tap a square.";

  const wrap = h('div');
  const grid = h('div', { class:'ttt-grid' });
  const statusEl = h('p', { class:'sub' }, status);

  function lines() {
    return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  }
  function winner(b) {
    for (const ln of lines()) {
      const [a, c, d] = ln;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return { who: b[a], line: ln };
    }
    if (b.every(x => x)) return { who: 'draw', line: [] };
    return null;
  }
  function aiMove() {
    // 1) win
    for (let i = 0; i < 9; i++) if (!board[i]) { const b = board.slice(); b[i]='O'; if (winner(b)?.who==='O') return i; }
    // 2) block
    for (let i = 0; i < 9; i++) if (!board[i]) { const b = board.slice(); b[i]='X'; if (winner(b)?.who==='X') return i; }
    // 3) center
    if (!board[4]) return 4;
    // 4) corner
    const corners = [0,2,6,8].filter(i => !board[i]);
    if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
    // 5) side
    const sides = [1,3,5,7].filter(i => !board[i]);
    return sides[Math.floor(Math.random()*sides.length)];
  }
  function render() {
    grid.innerHTML = '';
    const w = winner(board);
    for (let i = 0; i < 9; i++) {
      const cls = ['ttt-cell'];
      if (board[i] === 'X') cls.push('x');
      if (board[i] === 'O') cls.push('o');
      if (w && w.line.includes(i)) cls.push('win');
      const btn = h('button', {
        class: cls.join(' '),
        disabled: !!board[i] || gameOver,
        onClick: () => play(i)
      }, board[i] || '');
      grid.appendChild(btn);
    }
    statusEl.textContent = status;
  }
  function play(i) {
    if (board[i] || gameOver) return;
    board[i] = 'X';
    let w = winner(board);
    if (w) { finish(w); return; }
    const ai = aiMove();
    if (ai != null) board[ai] = 'O';
    w = winner(board);
    if (w) { finish(w); return; }
    status = "your turn.";
    render();
  }
  function finish(w) {
    gameOver = true;
    if (w.who === 'X') status = "you won. respect.";
    else if (w.who === 'O') status = "you lost. blame the wifi.";
    else status = "draw. classic.";
    render();
    toast(status);
  }
  function reset() {
    board = Array(9).fill(null);
    gameOver = false;
    status = "you're X. tap a square.";
    render();
  }
  render();
  wrap.appendChild(gameHeader('Tic-Tac-Toe', 'vs. the campus AI'));
  wrap.appendChild(statusEl);
  wrap.appendChild(grid);
  wrap.appendChild(h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'12px' } },
    pillBtn('new game', { variant:'ghost', icon: I.arrow(12), onClick: reset }),
    pillBtn('close', { variant:'accent', icon: I.close(12), onClick: closeGameModal })
  ));
  return wrap;
}

// ----- Rock Paper Scissors -----
function RockPaperScissors() {
  let you = 0, ai = 0;
  const moves = [
    { id:'rock', emoji:'🪨', beats:'scissors' },
    { id:'paper', emoji:'📄', beats:'rock' },
    { id:'scissors', emoji:'✂️', beats:'paper' }
  ];
  const result = h('p', { class:'rps-result' }, 'tap one to play.');
  const score = h('p', { class:'sub', style:{ textAlign:'center' } }, `you 0 — 0 anon`);
  function play(myId) {
    const myMove = moves.find(m => m.id === myId);
    const aiMove = moves[Math.floor(Math.random()*3)];
    let outcome;
    if (myMove.id === aiMove.id) outcome = 'draw';
    else if (myMove.beats === aiMove.id) { outcome = 'you win'; you++; }
    else { outcome = 'anon wins'; ai++; }
    result.textContent = `${myMove.emoji}  vs  ${aiMove.emoji}  · ${outcome}`;
    score.textContent = `you ${you} — ${ai} anon`;
  }
  const wrap = h('div', null,
    gameHeader('Rock · Paper · Scissors', 'tap one. fast.'),
    score,
    h('div', { class:'rps-row' },
      moves.map(m => h('button', { class:'rps-btn', onClick: () => play(m.id) }, m.emoji))
    ),
    result,
    gameFooter()
  );
  return wrap;
}

// ----- Number Guess -----
function NumberGuess() {
  let target = Math.floor(Math.random() * 100) + 1;
  let tries = 0;
  const max = 6;
  const hint = h('p', { class:'sub' }, `pick a number 1–100. you have ${max} tries.`);
  const log = h('div', { style:{ marginTop:'8px', display:'flex', flexDirection:'column', gap:'6px', maxHeight:'160px', overflowY:'auto' } });
  const input = h('input', {
    type:'number', min:'1', max:'100', placeholder:'your guess',
    class: 'input-clean',
    onKeydown: (e) => { if (e.key === 'Enter') submit(); }
  });
  function submit() {
    const v = parseInt(input.value, 10);
    if (!v || v < 1 || v > 100) { toast('1–100 only.'); return; }
    tries++;
    let msg;
    if (v === target) msg = `✓ ${v} — got it in ${tries} ${tries===1?'try':'tries'}!`;
    else if (v < target) msg = `${v} — go higher  ↑`;
    else msg = `${v} — go lower  ↓`;
    log.prepend(h('div', { class:'mono', style:{ fontSize:'13px', color:'var(--cocoa)' } }, msg));
    input.value = '';
    if (v === target) {
      hint.textContent = "nice. play again?";
      input.disabled = true;
    } else if (tries >= max) {
      hint.textContent = `out of tries. the number was ${target}.`;
      input.disabled = true;
    } else {
      hint.textContent = `${max - tries} ${max-tries===1?'try':'tries'} left.`;
    }
  }
  function reset() {
    target = Math.floor(Math.random() * 100) + 1;
    tries = 0;
    log.innerHTML = '';
    input.disabled = false;
    input.value = '';
    hint.textContent = `pick a number 1–100. you have ${max} tries.`;
  }
  return h('div', null,
    gameHeader('Number Guess', '1 to 100. six tries.'),
    hint,
    h('div', { style:{ display:'flex', gap:'10px', alignItems:'center' } },
      input,
      pillBtn('guess', { variant:'accent', icon: I.arrow(12), onClick: submit })
    ),
    log,
    h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'18px' } },
      pillBtn('reset', { variant:'ghost', icon: I.arrow(12), onClick: reset }),
      pillBtn('close', { variant:'accent', icon: I.close(12), onClick: closeGameModal })
    )
  );
}

// ----- Word Knot — tiny anagram puzzle -----
function WordKnot() {
  const words = ['chai','desk','viva','book','quiz','exam','flat','calm','past','rain'];
  let target = words[Math.floor(Math.random()*words.length)];
  let scrambled = target.split('').sort(() => Math.random() - 0.5).join('');
  if (scrambled === target) scrambled = scrambled.split('').reverse().join('');
  const hint = h('p', { class:'sub' }, `untangle these letters: ${scrambled.toUpperCase()}`);
  const input = h('input', {
    type:'text', maxlength:'5', class:'input-clean', placeholder:'your guess',
    onKeydown: (e) => { if (e.key === 'Enter') submit(); }
  });
  const out = h('p', { class:'rps-result' });
  function submit() {
    const v = (input.value || '').trim().toLowerCase();
    if (v === target) { out.textContent = `✓ "${target}" — untangled!`; toast('nice knot.'); }
    else if (v.split('').sort().join('') === target.split('').sort().join('')) out.textContent = 'real word, but not the target.';
    else out.textContent = `not it. try again — letters: ${scrambled.toUpperCase()}`;
  }
  return h('div', null,
    gameHeader('Word Knot', 'untangle a 5-letter word'),
    hint,
    h('div', { style:{ display:'flex', gap:'10px', alignItems:'center' } },
      input,
      pillBtn('check', { variant:'accent', icon: I.arrow(12), onClick: submit })
    ),
    out,
    gameFooter()
  );
}

// ----- Memory Lane — 4-pair grid -----
function MemoryLane() {
  const pool = [PHOTOS.bench, PHOTOS.cafe, PHOTOS.library, PHOTOS.roof];
  const deck = [...pool, ...pool].sort(() => Math.random() - 0.5).map((src, i) => ({ id: i, src, flipped: false, matched: false }));
  let first = null;
  let pairs = 0;
  const status = h('p', { class:'sub' }, 'match all 4 pairs.');
  const grid = h('div', { style:{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'10px' } });

  function render() {
    grid.innerHTML = '';
    deck.forEach(card => {
      const tile = h('button', {
        style: {
          aspectRatio:'3/4', borderRadius:'10px', border:'none', cursor:'pointer', overflow:'hidden', padding:'0',
          background: card.flipped || card.matched ? 'var(--paper)' : 'color-mix(in oklch, var(--accent) 30%, var(--paper))',
          boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--espresso) 8%, transparent)',
          opacity: card.matched ? '0.65' : '1', transition: 'opacity 0.4s, background 0.3s'
        },
        onClick: () => flip(card)
      },
        (card.flipped || card.matched) ? h('img', { src: card.src, style:{ width:'100%', height:'100%', objectFit:'cover' } }) : h('span', { style:{ color:'var(--paper)', fontSize:'24px' } }, '?')
      );
      grid.appendChild(tile);
    });
  }
  function flip(card) {
    if (card.matched || card.flipped) return;
    card.flipped = true;
    render();
    if (!first) { first = card; return; }
    if (first.src === card.src && first.id !== card.id) {
      first.matched = card.matched = true;
      pairs++;
      first = null;
      if (pairs === pool.length) { status.textContent = 'all matched. softly proud of you.'; toast('memory lane · perfect.'); }
    } else {
      const a = first, b = card;
      first = null;
      setTimeout(() => { a.flipped = false; b.flipped = false; render(); }, 700);
    }
  }
  render();
  return h('div', null,
    gameHeader('Memory Lane', 'flip to match campus polaroids'),
    status,
    grid,
    gameFooter()
  );
}

// ----- Trivia Tea — local 5-question quiz -----
function TriviaTea() {
  const qs = [
    { q: 'NUTECH is located in which Pakistani city?', a: ['Islamabad','Lahore','Karachi','Peshawar'], correct: 0 },
    { q: 'Which drink is most-dropped on the wall?', a: ['Coffee','Chai','Lassi','Water'], correct: 1 },
    { q: 'Who sings "Pasoori"?', a: ['Atif Aslam','Ali Sethi & Shae Gill','Farida Khanum','Jubin Nautiyal'], correct: 1 },
    { q: 'How long is each Daily Spark prompt?', a: ['10 sec','30 sec','60 sec','5 min'], correct: 1 },
    { q: 'What animal lives by C-block?', a: ['dog','cat','crow','squirrel'], correct: 1 }
  ];
  let idx = 0, score = 0;
  const wrap = h('div');
  function render() {
    wrap.innerHTML = '';
    wrap.appendChild(gameHeader('Trivia Tea', `question ${idx+1} of ${qs.length} · score ${score}`));
    if (idx >= qs.length) {
      wrap.appendChild(h('p', { class:'sub' }, `done. ${score}/${qs.length}. ${score >= 4 ? 'campus expert ☕' : score >= 2 ? 'not bad.' : 'tea? we need more tea.'}`));
      wrap.appendChild(h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'18px' } },
        pillBtn('play again', { variant:'ghost', icon: I.arrow(12), onClick: () => { idx=0; score=0; render(); } }),
        pillBtn('close', { variant:'accent', icon: I.close(12), onClick: closeGameModal })
      ));
      return;
    }
    const q = qs[idx];
    wrap.appendChild(h('p', { class:'sub' }, q.q));
    wrap.appendChild(h('div', { style:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', margin:'10px 0' } },
      q.a.map((opt, i) => h('button', {
        style: { padding:'14px', borderRadius:'12px', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:'15px',
                 background:'color-mix(in oklch, var(--linen) 30%, var(--paper))',
                 boxShadow:'inset 0 0 0 1px color-mix(in oklch, var(--espresso) 8%, transparent)',
                 textAlign:'left' },
        onClick: () => {
          if (i === q.correct) { score++; toast('✓ correct'); } else { toast('✗ not quite — was: ' + q.a[q.correct]); }
          idx++; render();
        }
      }, opt))
    ));
    wrap.appendChild(gameFooter());
  }
  render();
  return wrap;
}

// ---------- EASTER EGG ----------
function openEasterEgg() {
  const overlay = document.getElementById('easter');
  const dot = document.getElementById('easter-dot');
  const scoreEl = document.getElementById('easter-score');
  let score = 0;
  let warm = false;
  let to;
  const cycle = () => {
    warm = false; dot.classList.remove('warm');
    to = setTimeout(() => {
      warm = true; dot.classList.add('warm');
      to = setTimeout(() => { cycle(); }, 900);
    }, 600 + Math.random() * 1800);
  };
  dot.onclick = () => {
    if (warm) { score++; scoreEl.textContent = 'score · ' + score; clearTimeout(to); cycle(); }
    else { score = Math.max(0, score - 1); scoreEl.textContent = 'score · ' + score + ' (too early!)'; }
  };
  document.getElementById('easter-close').onclick = () => {
    clearTimeout(to);
    overlay.classList.remove('show');
  };
  cycle();
  overlay.classList.add('show');
}

// ---------- COMPOSE MODAL ----------
function ComposeModal() {
  const backdrop = h('div', { class:'modal-backdrop', id:'compose-backdrop' });
  const stage = h('div', {
    style:{ position:'fixed', inset:'0', display:'grid', placeItems:'center', padding:'30px', pointerEvents:'none', zIndex:'90' },
    onClick: (e) => { if (e.target === stage) closeCompose(); }
  });

  const tabsConfig = [
    { id:'doodle', l:'Doodle Pad', icon: I.brush(14) },
    { id:'poem',   l:'Two Lines',  icon: I.pen(14) },
    { id:'song',   l:'Drop a Song', icon: I.music(14) },
    { id:'confession', l:'Confession', icon: I.heart(14) }
  ];

  // Doodle canvas state — held outside re-render so strokes persist while tabbing
  const doodleState = { paths: [], drawing: false, color: 'var(--accent)' };

  function render() {
    stage.innerHTML = '';
    const card = h('div', { class:'modal-card bezel', style:{ width:'min(960px, 92vw)', maxHeight:'88vh', overflow:'hidden', background:'color-mix(in oklch, var(--linen) 60%, transparent)' },
      onClick: (e) => e.stopPropagation() },
      h('div', { class:'bezel-inner', style:{ background:'var(--paper)', padding:'0' } },
        // header
        h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 24px 18px', borderBottom:'1px solid color-mix(in oklch, var(--espresso) 8%, transparent)' } },
          h('div', null,
            eyebrow('compose'),
            h('div', { class:'serif-i', style:{ fontSize:'30px', color:'var(--espresso)', lineHeight:'1', marginTop:'6px' } }, 'drop something on the wall.')
          ),
          h('button', { onClick: closeCompose, style:{ width:'40px', height:'40px', borderRadius:'99px', border:'none', background:'color-mix(in oklch, var(--espresso) 6%, transparent)', cursor:'pointer', display:'grid', placeItems:'center' } }, I.close(16))
        ),
        // tabs
        h('div', { style:{ display:'flex', gap:'2px', padding:'12px 16px 0', borderBottom:'1px solid color-mix(in oklch, var(--espresso) 6%, transparent)', flexWrap:'wrap' } },
          tabsConfig.map(t => h('button', {
            onClick: () => { state.composeTab = t.id; render(); },
            style: {
              display:'inline-flex', alignItems:'center', gap:'8px',
              padding:'12px 16px', border:'none', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:'13.5px', fontWeight:'500',
              color: state.composeTab===t.id ? 'var(--espresso)' : 'var(--mocha)',
              borderBottom: '2px solid ' + (state.composeTab===t.id ? 'var(--accent)' : 'transparent'),
              transition: 'all 0.4s var(--ease-fluid)'
            }
          }, t.icon, t.l))
        ),
        // body
        h('div', { style:{ padding:'24px', maxHeight:'60vh', overflowY:'auto' } }, renderBody()),
        // footer
        h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 24px', borderTop:'1px solid color-mix(in oklch, var(--espresso) 8%, transparent)', background:'color-mix(in oklch, var(--cream-deep) 22%, var(--paper))', flexWrap:'wrap', gap:'12px' } },
          h('span', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)', letterSpacing:'0.14em', textTransform:'uppercase' } }, '· no names attached, ever ·'),
          h('div', { style:{ display:'flex', gap:'8px' } },
            pillBtn('cancel', { variant:'ghost', icon: I.close(12), onClick: closeCompose }),
            pillBtn('drop it on the wall', { variant:'accent', icon: I.arrowUR(14), onClick: submitCompose })
          )
        )
      )
    );
    stage.style.pointerEvents = state.composeOpen ? 'auto' : 'none';
    stage.appendChild(card);
  }

  function renderBody() {
    if (state.composeTab === 'doodle') return doodleBody();
    if (state.composeTab === 'poem') return poemBody();
    if (state.composeTab === 'song') return songBody();
    return confessionBody();
  }

  function doodleBody() {
    let svgEl;
    const colors = ['var(--espresso)','var(--accent)','var(--sage-deep)','var(--butter-deep)','var(--rose-deep)','var(--plum)'];
    function redraw() {
      svgEl.innerHTML = doodleState.paths.map(p => `<path d="${p.d}" stroke="${p.c}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
    }
    function getXY(e) {
      const r = svgEl.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      const x = (t.clientX - r.left) * (800 / r.width);
      const y = (t.clientY - r.top) * (380 / r.height);
      return x.toFixed(1) + ',' + y.toFixed(1);
    }
    const board = h('div', { style:{ borderRadius:'14px', overflow:'hidden', border:'1px solid color-mix(in oklch, var(--espresso) 10%, transparent)' } });
    board.innerHTML = `<svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid meet" class="doodle-pad" style="width:100%;height:380px;display:block;touch-action:none;cursor:crosshair" xmlns="http://www.w3.org/2000/svg"></svg>`;
    svgEl = board.firstChild;
    const onDown = (e) => { doodleState.drawing = true; doodleState.paths.push({ d:'M' + getXY(e), c: doodleState.color }); redraw(); e.preventDefault(); };
    const onMove = (e) => { if (!doodleState.drawing) return; const cur = doodleState.paths[doodleState.paths.length-1]; cur.d += ' L' + getXY(e); redraw(); };
    const onUp = () => { doodleState.drawing = false; };
    svgEl.addEventListener('mousedown', onDown);
    svgEl.addEventListener('mousemove', onMove);
    svgEl.addEventListener('mouseup', onUp);
    svgEl.addEventListener('mouseleave', onUp);
    svgEl.addEventListener('touchstart', onDown);
    svgEl.addEventListener('touchmove', onMove);
    svgEl.addEventListener('touchend', onUp);
    redraw();

    return h('div', null,
      h('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px', flexWrap:'wrap', gap:'10px' } },
        h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--mocha)', textTransform:'uppercase' } }, 'tap and drag to draw · 60 sec'),
        h('div', { style:{ display:'flex', gap:'6px', flexWrap:'wrap' } },
          colors.map(c => h('button', {
            onClick: () => { doodleState.color = c; render(); },
            style: { width:'26px', height:'26px', borderRadius:'99px', background: c, border:'none', cursor:'pointer',
              boxShadow: doodleState.color === c ? '0 0 0 2px var(--paper), 0 0 0 4px var(--espresso)' : '0 0 0 1px rgba(0,0,0,0.1)' }
          })),
          h('button', { onClick: () => { doodleState.paths = []; redraw(); }, style:{ padding:'0 12px', borderRadius:'99px', border:'none', background:'color-mix(in oklch, var(--espresso) 6%, transparent)', cursor:'pointer', fontSize:'12px', color:'var(--cocoa)' } }, 'clear')
        )
      ),
      board
    );
  }

  function poemBody() {
    return h('div', { style:{ background:'color-mix(in oklch, var(--butter) 14%, var(--paper))', padding:'28px', borderRadius:'16px', border:'1px solid color-mix(in oklch, var(--butter-deep) 35%, transparent)' } },
      h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--mocha)', textTransform:'uppercase' } }, 'two lines · any language · 90 chars each'),
      h('input', {
        value: state.composeDraft.poem[0], maxlength:'90', placeholder:'first line…',
        style: { width:'100%', padding:'14px 0 8px', border:'none', borderBottom:'1px dashed color-mix(in oklch, var(--espresso) 18%, transparent)', background:'transparent', fontFamily:'Instrument Serif', fontStyle:'italic', fontSize:'32px', outline:'none', color:'var(--espresso)' },
        onInput: (e) => state.composeDraft.poem[0] = e.target.value
      }),
      h('input', {
        value: state.composeDraft.poem[1], maxlength:'90', placeholder:'…and the second.',
        style: { width:'100%', padding:'12px 0', marginTop:'6px', border:'none', background:'transparent', fontFamily:'Instrument Serif', fontStyle:'italic', fontSize:'32px', outline:'none', color:'var(--espresso)' },
        onInput: (e) => state.composeDraft.poem[1] = e.target.value
      })
    );
  }

  function songBody() {
    return h('div', null,
      h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--mocha)', textTransform:'uppercase' } }, 'paste a link or search · plays on kiosk speakers'),
      h('div', { style:{ marginTop:'14px', padding:'14px 18px', borderRadius:'14px', background:'color-mix(in oklch, var(--rose) 14%, var(--paper))', border:'1px solid color-mix(in oklch, var(--rose-deep) 30%, transparent)', display:'flex', alignItems:'center', gap:'14px' } },
        I.music(20),
        h('input', {
          placeholder:'spotify / youtube link or song name…',
          value: state.composeDraft.song,
          style: { flex:'1', background:'transparent', border:'none', outline:'none', fontFamily:'inherit', fontSize:'17px', color:'var(--espresso)' },
          onInput: (e) => state.composeDraft.song = e.target.value
        })
      ),
      h('div', { style:{ marginTop:'18px' } },
        h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--mocha)', textTransform:'uppercase' } }, '· trending on campus today ·'),
        h('div', { style:{ marginTop:'10px', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px' } },
          [
            { t:'Pasoori',           a:'Ali Sethi · Shae Gill' },
            { t:'Tum Hi Aana',        a:'Jubin Nautiyal' },
            { t:'Aaj Jaane Ki Zid',   a:'Farida Khanum' }
          ].map(s => h('button', {
            onClick: () => { state.composeDraft.song = s.t + ' — ' + s.a; render(); toast('picked: ' + s.t); },
            style: { padding:'12px 14px', borderRadius:'12px', background:'color-mix(in oklch, var(--espresso) 5%, transparent)', border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit' }
          },
            h('div', { class:'serif', style:{ fontSize:'17px', color:'var(--espresso)' } }, s.t),
            h('div', { class:'mono', style:{ fontSize:'10px', color:'var(--mocha)', marginTop:'2px' } }, s.a)
          ))
        )
      )
    );
  }

  function confessionBody() {
    return h('div', { style:{ background:'color-mix(in oklch, var(--rose) 12%, var(--paper))', padding:'28px', borderRadius:'16px', border:'1px solid color-mix(in oklch, var(--rose-deep) 30%, transparent)' } },
      h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--mocha)', textTransform:'uppercase' } }, '180 characters · totally anonymous · no logins'),
      h('textarea', {
        placeholder: 'i…', maxlength:'180', rows:'4',
        style:{ width:'100%', marginTop:'12px', padding:'0', border:'none', background:'transparent', fontFamily:'Instrument Serif', fontStyle:'italic', fontSize:'28px', outline:'none', color:'var(--espresso)', resize:'none', lineHeight:'1.2' },
        onInput: (e) => state.composeDraft.confession = e.target.value
      }, state.composeDraft.confession)
    );
  }

  async function submitCompose() {
    const tab = state.composeTab;
    let newItem;
    if (tab === 'doodle') {
      if (doodleState.paths.length === 0) { toast('doodle something first ✎'); return; }
      // Convert paths to a data URL SVG image
      const varToHex = {
        'var(--espresso)':   '#2a221b',
        'var(--accent)':     getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c97862',
        'var(--sage-deep)':  '#7e9078',
        'var(--butter-deep)':'#d9bf6c',
        'var(--rose-deep)':  '#d49a8a',
        'var(--plum)':       '#8a6a8b'
      };
      const resolveColor = (c) => varToHex[c] || (c.startsWith('var(') ? '#2a221b' : c);
      const svgStr = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 380' style='background:#faf6ed'>${doodleState.paths.map(p=>`<path d='${p.d}' stroke='${resolveColor(p.c)}' stroke-width='3.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/>`).join('')}</svg>`;
      const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr);
      newItem = { _id: 'u' + Date.now(), kind:'doodle', img: dataUrl, label:'your doodle', mood: state.mood, who:'you, just now', tilt: 0, pinned:true };
      doodleState.paths = [];
    } else if (tab === 'poem') {
      if (!state.composeDraft.poem[0].trim() && !state.composeDraft.poem[1].trim()) { toast('write two lines first ✎'); return; }
      newItem = { _id: 'u' + Date.now(), kind:'poem', lines: state.composeDraft.poem.slice(), mood: state.mood, who:'you, just now', pinned:true };
      state.composeDraft.poem = ['',''];
    } else if (tab === 'song') {
      if (!state.composeDraft.song.trim()) { toast('paste a song first ♪'); return; }
      const parts = state.composeDraft.song.split('—').map(s=>s.trim());
      newItem = { _id: 'u' + Date.now(), kind:'song', title: parts[0] || state.composeDraft.song, artist: parts[1] || 'unknown', color:'var(--terra)', art: PHOTOS.social, mood: state.mood, pinned:true };
      state.composeDraft.song = '';
    } else {
      if (!state.composeDraft.confession.trim()) { toast('write something first ✎'); return; }
      const confText = state.composeDraft.confession.trim();
      // AI moderation — fail-open: if the LLM is offline, we still accept.
      if (api.online) {
        toast('· checking with the wall keeper ·', 1500);
        const verdict = await api.post('/api/moderate', { text: confText });
        if (verdict && verdict.allowed === false) {
          toast('hmm — try softening that: ' + (verdict.reason || 'against house rules'), 4200);
          return;
        }
      }
      newItem = { _id: 'u' + Date.now(), kind:'confession', text: confText, mood: state.mood, who:'anon · just now', tilt: 0, pinned:true };
      state.composeDraft.confession = '';
    }
    state.wall.unshift(newItem);
    closeCompose();
    if (window.__renderMasonry) window.__renderMasonry();
    toast(api.online ? '✓ dropped on the wall · saved.' : '✓ dropped on the wall · (offline mode)');
    setTimeout(() => scrollTo('wall'), 400);

    // Persist to backend (fire-and-forget). Build a clean payload for the API.
    if (api.online) {
      let payload;
      const kind = newItem.kind;
      if (kind === 'doodle')         payload = { img: newItem.img, label: newItem.label };
      else if (kind === 'poem')      payload = { lines: newItem.lines };
      else if (kind === 'song')      payload = { title: newItem.title, artist: newItem.artist, color: newItem.color, art: newItem.art };
      else if (kind === 'confession')payload = { text: newItem.text };
      api.post('/api/posts', { kind, payload, mood: state.mood, who: newItem.who || 'anon' })
        .then(saved => { if (saved && saved.id) newItem._id = saved.id; });
    }
  }

  function show() {
    state.composeOpen = true;
    backdrop.classList.add('open');
    stage.style.pointerEvents = 'auto';
    render();
  }
  function hide() {
    state.composeOpen = false;
    backdrop.classList.remove('open');
    stage.style.pointerEvents = 'none';
  }

  window.__openCompose = (tab, opts) => {
    if (tab) state.composeTab = tab;
    if (opts && opts.color) doodleState.color = opts.color;
    show();
  };
  window.__closeCompose = hide;

  // ESC to close
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });

  return h('div', null, backdrop, stage);
}

function openCompose(tab, opts) { if (window.__openCompose) window.__openCompose(tab, opts); }
function closeCompose() { if (window.__closeCompose) window.__closeCompose(); }

// ---------- FOOTER ----------
function Footer() {
  const cols = [
    { title:'explore',     links:['the wall','mood check-in','pass it forward','creative drop','mood map','games'], targets:['wall','mood','forward','create','map','games'] },
    { title:'the project', links:['how it works','anonymity & safety','house rules','credits'] },
    { title:'campus',      links:['a-block kiosk','library kiosk','c-block kiosk','mobile · scan QR'] }
  ];
  return h('footer', { style: { padding:'60px 0 80px', position:'relative', zIndex:'1' } },
    h('div', { class:'container' },
      h('div', { class:'hair', style: { marginBottom:'40px' } }),
      h('div', { style: { display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', gap:'30px' } },
        h('div', null,
          h('div', { class:'serif-i', style:{ fontSize:'48px', lineHeight:'0.96', color:'var(--espresso)' } },
            'vibe wall', h('span', { style:{ color:'var(--accent)' } }, '.')),
          h('p', { class:'serif', style:{ fontSize:'16px', color:'var(--cocoa)', lineHeight:'1.35', margin:'10px 0 0', maxWidth:'320px' } },
            'A soft place between classes. Built by students, for students, anonymously.')
        ),
        cols.map(c => h('div', null,
          h('div', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.2em', color:'var(--mocha)', textTransform:'uppercase', marginBottom:'14px' } }, c.title),
          h('ul', { style:{ listStyle:'none', padding:'0', margin:'0', display:'flex', flexDirection:'column', gap:'8px' } },
            c.links.map((l, i) => h('li', null,
              h('a', {
                href: c.targets ? '#' + c.targets[i] : '#',
                onClick: (e) => {
                  if (!c.targets) { e.preventDefault(); toast(l + ' · coming soon'); }
                },
                style:{ color:'var(--cocoa)', textDecoration:'none', fontFamily:'Instrument Serif', fontSize:'19px' }
              }, l)
            ))
          )
        ))
      ),
      h('div', { style:{ marginTop:'50px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' } },
        h('span', { class:'mono', style:{ fontSize:'10px', letterSpacing:'0.18em', color:'var(--mocha)', textTransform:'uppercase' } }, '© 2026 vibe wall · nutech islamabad · final year project'),
        h('span', { class:'hand', style:{ fontSize:'22px', color:'var(--cocoa)' } }, 'made softly, with chai, by anon ♡')
      )
    )
  );
}

// ---------- MOUNT ----------
function App() {
  return h('div', null,
    FloatingNav(),
    Hero(),
    ConfessionTicker(),
    VibeWall(),
    MoodCheckIn(),
    PassForward(),
    CreativeDropZone(),
    DailySpark(),
    MoodMap(),
    Games(),
    Footer(),
    ComposeModal()
  );
}

let _mounted = false;
async function mount() {
  if (_mounted) return;
  _mounted = true;
  setAccentForMood(state.mood);
  const root = document.getElementById('root');
  if (root) root.appendChild(App());

  // Ping backend, then merge any persisted posts onto the wall.
  await api.ping();
  if (api.online) {
    console.log('[vibewall] backend online — loading persisted posts');
    const rows = await api.get('/api/posts?limit=40');
    if (Array.isArray(rows) && rows.length) {
      const items = rows.map(backendRowToWallItem).filter(Boolean)
        .map(it => ({ ...it, tilt: (Math.random() - 0.5) * 3 }));
      // Prepend persisted posts (newest first) — keep seed posts after.
      state.wall = [...items, ...state.wall];
      if (window.__renderMasonry) window.__renderMasonry();
      toast(`· wall synced · ${items.length} saved posts ·`, 1800);
    }
  } else {
    console.log('[vibewall] backend offline — running in local-only mode');
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}

})();
