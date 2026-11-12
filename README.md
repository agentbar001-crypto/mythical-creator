# The Mythical Creator

Turn the real stories of the people you love into song lyrics, Suno style prompts, engraved lead sheets, short stories, poems, and a printable legacy book. *Nobody Gets Forgotten.*

Legacy Builder™ and the Mythical Creator framework by Billy Adono Robles.

## What's here

| Path | What it is |
|---|---|
| `app/page.tsx` | Public landing page (SEO metadata, JSON-LD, FAQ) |
| `public/studio/index.html` | The Studio app (served at `/studio`). Characters live in the browser's local storage. |
| `app/api/generate/route.ts` | Server route that calls Claude (`claude-opus-5-5`) for lyrics, style prompts, stories, poems, and memory tagging |
| `lib/prompts.ts` | Request validation and the creative prompts |
| `lib/rateLimit.ts` | Free-sample counter per visitor per day |
| `app/privacy`, `app/terms` | Privacy policy and terms |
| `app/sitemap.ts`, `app/robots.ts` | Sitemap and robots, built from `NEXT_PUBLIC_SITE_URL` |

## AI access

1. **Free samples**: a few generations per visitor per day on the server's `ANTHROPIC_API_KEY` (`FREE_GENERATIONS_PER_DAY`).
2. **Bring your own key**: visitors paste an Anthropic key in the Studio's AI Settings; it is sent per request in the `x-user-api-key` header and never stored server-side.
3. **Subscriptions**: planned (sign-in plus Stripe).
4. **Offline engine**: works with no key and no network.

## Run locally

```bash
cp .env.example .env.local   # add ANTHROPIC_API_KEY to enable free samples
npm install
npm run dev                  # http://localhost:3000 and http://localhost:3000/studio
```

## Deploy

Built for Vercel: import the repo, set the environment variables from `.env.example`, and deploy. Set `NEXT_PUBLIC_SITE_URL` to the final domain so canonical URLs and the sitemap use full absolute links.

Note: the free-sample counter is in memory per server instance. Move it to a shared store (Vercel KV / Upstash Redis) before relying on it to cap costs.
