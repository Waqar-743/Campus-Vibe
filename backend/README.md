# Vibe Wall — Backend

Tiny Node + Express + SQLite server that persists doodles, poems, songs, confessions, notes, mood check-ins, and "pass forward" letters for the Vibe Wall front-end.

## Why SQLite (not Supabase)

- **Zero hosting cost** — the database is a single `vibewall.db` file on disk.
- **Zero external account** — no signup, no API key for the DB itself.
- **Zero native compilation** — uses Node 24's built-in `node:sqlite` (no `better-sqlite3`, no Visual Studio Build Tools needed on Windows).
- Trade-off: only one process can write at a time. Fine for a campus-sized app; the day you have >50 concurrent writers, swap to Postgres.

## Requirements

- **Node.js 22.5+ or 24+** (for the built-in `node:sqlite` module). Check with `node --version`.

## Run

```bash
cd backend
npm install        # installs express + cors only
npm start          # http://127.0.0.1:3001
```

On first run, a `vibewall.db` file appears next to `server.js` with 4 seed posts.

## Endpoints

| Method | Path | Body / Query | Returns |
|---|---|---|---|
| GET  | `/api/health`              |                                       | `{ ok, t }` |
| GET  | `/api/posts`               | `?kind=all\|doodle\|poem\|song\|confession\|note\|photo&limit=N` | array of posts |
| POST | `/api/posts`               | `{ kind, payload, mood?, who? }`      | new post row |
| POST | `/api/posts/:id/react`     | `{ fingerprint? }`                    | `{ count }` |
| POST | `/api/moods`               | `{ mood, zone? }`                     | `{ ok: true }` |
| GET  | `/api/moods/stats`         |                                       | `{ counts, zones }` (last 24h) |
| POST | `/api/letters`             | `{ to_mood?, body }`                  | `{ id, ok }` |
| GET  | `/api/letters/pull`        | `?mood=stressed`                      | one unclaimed letter, claims it |
| POST | `/api/moderate`            | `{ text }`                            | `{ allowed, reason?, source }` |

## Optional: LLM-based confession moderation

The `/api/moderate` endpoint is a no-op (always `allowed: true`) unless you wire it to an OpenAI-compatible LLM proxy. We use [freellmapi](https://github.com/tashfeenahmed/freellmapi) for this — it lets you stack 11 free LLM provider tiers behind one endpoint.

See the project root `LLM-SETUP.md` for the step-by-step.

## File layout

```
backend/
  package.json     # express + cors only
  server.js        # the whole server (~150 lines)
  vibewall.db      # SQLite file (auto-created, gitignored)
  vibewall.db-wal  # WAL log (auto-created)
  vibewall.db-shm  # shared memory (auto-created)
```

## Reset

```bash
rm vibewall.db*
npm start          # fresh DB + seed posts
```
