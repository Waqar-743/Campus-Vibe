# Optional: LLM moderation via freellmapi

The Vibe Wall works without any LLM — confessions are saved as-is, the daily spark is a hardcoded list.

If you want **AI moderation** (auto-flag hate / self-harm / doxxing) or **AI-generated daily sparks**, wire up [freellmapi](https://github.com/tashfeenahmed/freellmapi). It's already cloned at `./.freellmapi/`.

## What freellmapi is (and isn't)

It is **not** an API key. It's a proxy that lets you stack 11 free LLM provider tiers (Groq, Google Gemini, Cerebras, Mistral, OpenRouter, etc.) behind a single OpenAI-compatible endpoint. You still need to register with at least one provider and paste their key into its dashboard.

**Easiest free provider (no credit card, instant signup):**

- **Groq** — https://console.groq.com/keys → `gsk_...` key in ~30 seconds.
- Google AI Studio — https://aistudio.google.com/apikey → free Gemini access.
- OpenRouter — https://openrouter.ai/keys → has many free-tier models.

## Windows prerequisite

freellmapi depends on `better-sqlite3`, which compiles native bindings. On Windows you need either:

1. **Visual Studio Build Tools 2022** (free) → https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - During install, check "Desktop development with C++".
2. **OR** run inside WSL2 — Linux side has no compile issues.

(Our `backend/server.js` uses Node 24's built-in `node:sqlite` precisely to avoid this. freellmapi was written before that module existed.)

## Steps

```bash
cd .freellmapi
npm install        # ~3 minutes; needs the build tools above
npm run dev        # starts proxy on :3002, dashboard on :5173
```

The .env is already configured (port 3002, fresh encryption key).

1. Open http://localhost:5173 (freellmapi's Vite dashboard).
2. Go to **Keys** → add your Groq (or other) provider key.
3. Copy the **unified API key** from the Keys page header (looks like `freellmapi-xxxxxxxxx...`).

## Wire the Vibe Wall backend to it

Add to `backend/.env` (create if missing):

```env
LLM_URL=http://127.0.0.1:3002/v1/chat/completions
LLM_KEY=freellmapi-your-unified-key-here
LLM_MODEL=llama-3.3-70b-versatile
```

Then restart the backend:

```bash
cd backend
npm start
```

Now `POST /api/moderate { "text": "..." }` returns a JSON verdict from the LLM. To gate confessions, change `submitCompose` in `app.js` to call moderation before posting — sketch:

```js
// inside submitCompose, for the 'confession' case:
const verdict = await api.post('/api/moderate', { text: newItem.text });
if (verdict && !verdict.allowed) {
  toast('this might break the wall\'s house rules — try softening it');
  return;
}
```

## Skip this entirely?

You can. The Vibe Wall app is fully functional with just the SQLite backend. LLM moderation is a nice-to-have for when you open it to a wider campus audience.
