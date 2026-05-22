# vibe wall.

> *A soft, anonymous wall for NUTECH students — doodles, two-line poems, songs, and tiny notes between classes.*

---

## the idea

There's a specific kind of loneliness that happens in the middle of a packed campus. You're surrounded by people, your next class is in forty minutes, and you have absolutely no idea what to do with the feeling you're carrying.

Vibe Wall is the answer to that. Not a social network. Not a confession page. Something quieter — a digital pinboard on the wall between classes, where students drop things anonymously and move on. A doodle that took thirty seconds. Two lines about chai going cold. A song that got someone through their 8am. A note for whoever shows up next.

No accounts. No usernames. No likes. Just the wall.

---

## what it looks like

| Section | What it does |
|---|---|
| **The Wall** | A live masonry grid of everything students have dropped — photos, confessions, poems, songs, doodles. Filter by type. Unpin a card and watch it float off. |
| **Mood Check-in** | Six moods. Tap yours. The page colour shifts around it. You get three things from the wall that match. |
| **Pass It Forward** | Anonymous letters — written for a specific feeling, delivered to the next person who checks in with that feeling. |
| **Creative Drop Zone** | Four ways to make something in under two minutes: a doodle on a shared canvas, two lines of poetry, a song rec, or a voice note. |
| **Daily Spark** | One AI-generated creative prompt, refreshed every 24 hours. A 30-second timer. Everyone's responses hang side by side. |
| **Mood Map** | An 8×8 heatmap of the campus. Every check-in lights up a zone. You see you're not the only one. |
| **Games** | Reaction Race, Tic-Tac-Toe, Rock Paper Scissors, Number Guess — for the forty minutes between lectures. |

---

## the stack

This is a deliberately small project. No React, no build step, no bundler. Just a browser loading one JS file.

```
frontend         vanilla JS (no framework, no transpile)
                 hand-rolled h() DOM helper — React-like, 35 lines
                 CSS custom properties for theming + mood transitions
                 IntersectionObserver reveal animations
                 Pointer Events API for drag-and-drop

backend          Node.js 24 + Express
                 node:sqlite (built-in — zero native compilation)
                 OpenRouter API (LLM moderation + daily spark prompts)

tunnel           Cloudflare Tunnel (cloudflared) for public sharing
```

**Why no framework?** This started as a design prototype and needed to stay fast on a cold load — no React runtime, no hydration, no build step. The whole app is one 100 KB JS file. It loads in under a second on campus WiFi.

**Why node:sqlite?** `better-sqlite3` (the usual choice) requires Visual Studio Build Tools to compile on Windows. Node 24 ships SQLite natively. Zero install friction, one fewer dependency.

---

## run it locally

**Prerequisites:** Node.js 22.5+ (for built-in `node:sqlite`).

```bash
# 1. clone
git clone https://github.com/YOUR_USERNAME/vibewall.git
cd vibewall

# 2. start the backend (serves the site + API + SQLite)
cd backend
npm install
node --experimental-sqlite server.js
```

Open **http://127.0.0.1:3001** — the wall loads with four seed posts.

On first run, `backend/vibewall.db` is created automatically. To reset:
```bash
rm backend/vibewall.db && node --experimental-sqlite backend/server.js
```

---

## environment variables

Create `backend/.env` (never committed):

```env
PORT=3001

# OpenRouter key — free tier works (https://openrouter.ai/keys)
OPENROUTER_KEY=sk-or-v1-...
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free
OPENROUTER_FALLBACKS=deepseek/deepseek-v4-flash:free,qwen/qwen3-next-80b-a3b-instruct:free,meta-llama/llama-3.3-70b-instruct:free
```

Without a key, the app still runs fully — LLM moderation just fails open (allows everything), and Daily Spark falls back to the hardcoded prompt list.

---

## make it public

```bash
# download cloudflared once
# Windows: already in repo root (cloudflared.exe)
# Mac:     brew install cloudflare/cloudflare/cloudflared
# Linux:   curl -Lo cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64

cloudflared tunnel --url http://127.0.0.1:3001 --no-autoupdate
# prints: https://something.trycloudflare.com
```

Share that URL. It stays alive as long as the terminal stays open.

---

## API

The backend exposes a REST API at `/api/`. The frontend hits it from the same origin — no CORS issues when using the backend to serve the static files.

| Method | Path | Description |
|---|---|---|
| `GET`  | `/api/health` | Liveness check |
| `GET`  | `/api/posts?kind=&limit=` | All posts, filterable by kind |
| `POST` | `/api/posts` | Submit a doodle / poem / song / confession |
| `POST` | `/api/posts/:id/react` | React to a post |
| `POST` | `/api/moods` | Record a mood check-in (feeds the map) |
| `GET`  | `/api/moods/stats` | Mood distribution for the last 24 hours |
| `POST` | `/api/letters` | Write a pass-it-forward letter |
| `GET`  | `/api/letters/pull?mood=` | Claim one unclaimed letter |
| `POST` | `/api/moderate` | AI moderation check (uses OpenRouter) |
| `GET`  | `/api/spark` | Today's AI-generated creative prompt (cached per day) |

---

## project structure

```
vibewall/
├── index.html          # full CSS + layout shell
├── app.js              # entire frontend — one file, no build step
│
├── backend/
│   ├── server.js       # Express + node:sqlite + OpenRouter
│   ├── package.json    # express + cors only
│   └── README.md       # API reference
│
├── assets/             # campus photography
│
├── LLM-SETUP.md        # optional: how to add more LLM providers
└── .gitignore
```

The `.jsx` files (`app.jsx`, `sections.jsx`, etc.) are source sketches used during prototyping — the actual served code is the compiled `app.js`. They're kept for reference.

---

## ai moderation

Confessions are screened by an LLM before hitting the wall. The prompt is intentionally permissive:

> **Reject:** hate speech, self-harm encouragement, doxxing, explicit sexual content, threats.  
> **Allow:** venting, sadness, mild profanity, romance, complaints, dark humour, exam stress, loneliness.

If the LLM is unavailable (rate-limited, no key), the check fails open — the post goes through. This is intentional for a soft launch: better to have an unmoderated wall than a broken one.

The moderation model is `google/gemma-4-26b-a4b-it:free` by default, with a 5-model fallback chain. Cost on the free tier: $0.

---

## the details that matter

**Anonymity is structural, not promised.** There are no user accounts to build, no IDs to leak. Posts have a randomised `who` field like `anon` or `F.S.` — initials that aren't linked to anything real.

**The wall is ephemeral by design.** Falling cards. Disappearing pins. Nothing is meant to live forever.

**Mood drives the whole page.** Tap "Stressed" and the accent colour shifts to terracotta. Tap "Happy" and it goes butter yellow. Every section responds to the current mood.

**One hardcoded easter egg.** Tap the logo five times fast.

---

## context

The wall lives (or lived) at a kiosk in the campus corridors.  
Made softly, with chai, by anon ♡

---

## licence

 Take it, fork it, hang your own wall somewhere.
