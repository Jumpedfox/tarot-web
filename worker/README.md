# Tarot reading worker

Cloudflare Worker that turns the drawn cards (and the querent's optional question) into a tarot reading with the Groq API. The Groq key lives only here, as a secret.

**Request** `POST /`

```json
{
  "cards": [{ "name": "The Fool", "reversed": false }],
  "category": "Love",
  "question": "Will we meet again?"
}
```

**Response** `{ "reading": "..." }`, or `{ "error": "..." }` with a 4xx/5xx status.

The prompt is built inside the worker, so it can't be used as a general LLM proxy. Only the origins in `ALLOWED_ORIGINS` (by default `https://jumpedfox.github.io` and `http://localhost:3000`) are accepted, and the optional rate limit allows 10 readings per minute per IP.

## Deploy from the dashboard

1. Cloudflare dashboard → Workers & Pages → `groqkey` → **Edit code**.
2. Replace the code with `src/index.js` and press **Deploy**.
3. Settings → Variables and Secrets → add a **Secret** `GROQ_API_KEY` with a key from https://console.groq.com/keys.

The rate limit can only be added through Wrangler (below); without it the worker still works.

## Deploy with Wrangler

```bash
cd worker
npx wrangler login
npx wrangler secret put GROQ_API_KEY
npx wrangler deploy
```

## Model

Uses `openai/gpt-oss-120b` (Groq retired `llama-3.3-70b-versatile` on 2026-08-16). To switch models, change `MODEL` in `src/index.js`.
