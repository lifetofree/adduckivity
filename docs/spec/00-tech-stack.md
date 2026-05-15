# Duck OS — Tech Stack

**Last updated:** 2026-05-11  
**Status:** Production Live

---

## Overview

Duck OS is a multi-tool productivity platform for neurodivergent creators, built on a Cloudflare Edge-first architecture. It emphasizes zero-cold-start performance, edge-distributed rendering, and energy-aware tool access.

---

## Architecture

```
Browser → Cloudflare CDN → Next.js App (Edge Runtime) → Cloudflare KV + R2
                                         ↓
                              WordPress REST API (blog)
                              SendFox (email)
                              Facebook Graph API (auto-post)
                              MiniMax + Gemini AI
```

**Deployment:** Cloudflare Pages with `--no-bundle` flag (bypasses 3 MiB bundler limit; Workers Paid plan required for ~9.8 MiB bundle)

**Edge constraint:** All API routes MUST use `export const runtime = 'edge'`. No Node.js built-ins (`fs`, `path`, `crypto`) allowed.

---

## Frontend

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.4 |
| Language | TypeScript | 5 |
| 3D Rendering | Three.js + React Three Fiber + Drei | three 0.184, R3F 9.6, Drei 10.7 |
| Post-processing | @react-three/postprocessing | 3.0.4 |
| Styling | Tailwind CSS | 4 |
| Animation | Framer Motion | 12.38.0 |
| Icons | Lucide React | 1.8.0 |
| State | Zustand 5 (via transitive dep) + React Context | — |

---

## Backend / Edge Functions

| Layer | Technology |
|---|---|
| Runtime | Cloudflare Workers Edge (via next-on-pages) |
| KV Storage | Cloudflare KV (`POSTS_KV` binding) |
| Blob Storage | Cloudflare R2 (`ASSETS_BUCKET` binding) |
| Local dev mock | `src/lib/dev-kv.ts` (in-memory, activates when `NODE_ENV === 'development'`) |

---

## AI Providers

| Provider | Model | Use Case |
|---|---|---|
| MiniMax | `abab6.5s-chat` | Primary AI (Atomizer + CMS assistant) |
| Google Gemini | `gemini-1.5-flash` | Fallback AI + CMS assistant |

**Fallback logic:** MiniMax is primary; if it fails or times out, falls back to Gemini. Configured via `MINIMAX_API_KEY` and `GEMINI_API_KEY`.

---

## Integrations

| Service | Env Var | Purpose |
|---|---|---|
| WordPress | — | Blog content source (`wp.adduckivity.com/wp-json/wp/v2/posts`) |
| Facebook | `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID` | Auto-post on first publish |
| SendFox | `SENDFOX_API_TOKEN`, `SENDFOX_LIST_ID` | Email subscription |
| Unsplash | `UNSPLASH_ACCESS_KEY` | Cover image search proxy |

---

## Environment Variables

```bash
# Required
GEMINI_API_KEY
MINIMAX_API_KEY
UNSPLASH_ACCESS_KEY
FACEBOOK_PAGE_ACCESS_TOKEN
FACEBOOK_PAGE_ID=865781466614960
SITE_URL=https://immersive.adduckivity.com
SENDFOX_API_TOKEN
SENDFOX_LIST_ID=614719
MAINTENANCE_KEY

# Cloudflare Bindings (wrangler.toml)
POSTS_KV       — KV namespace: a07209b5ad9a4972aa82a30d0af3071e
ASSETS_BUCKET  — R2 bucket: immersive-assets
```

---

## Key Files

| Path | Purpose |
|---|---|
| `src/lib/system-context.tsx` | Global state (energy, sensory, gradient lock) |
| `src/lib/theme.ts` | Centralized `ET` color palette |
| `src/lib/dev-kv.ts` | In-memory KV mock for local dev |
| `src/lib/posts.ts` | Post CRUD, KV operations, Facebook posting |
| `src/lib/wordpress.ts` | WordPress REST API client |
| `src/lib/atomizer.ts` | Task persistence (localStorage) |
| `src/lib/protocol-store.ts` | Protocol graph state (localStorage) |
| `src/lib/ignition-store.ts` | Ignition phase/timer state (Zustand) |
| `src/lib/ignition-audio.ts` | Audio manager for ignition phases |
| `src/lib/markdown.ts` | Markdown → HTML renderer |
| `src/lib/timer-audio.ts` | Web Audio API synthesis for timer sounds |

---

## Bundle Size

- **Total worker bundle:** ~9.8 MiB (21 modules)
- **Largest worker:** `index.func.js` (1.4 MiB) — homepage with Three.js
- **Free tier limit:** 3 MiB — **requires Workers Paid plan** ($5/mo)
- **Build command:** `npm run build:cf` (`npx @cloudflare/next-on-pages`)
- **Deploy command:** `wrangler pages deploy .vercel/output/static --project-name immersive-adduckivity --no-bundle`

---

## Testing

- **Framework:** Vitest 4.1 + jsdom 29 + Testing Library (DOM 10.4, React 16.3)
- **Test files:** 12 files, 118 tests
- **Run:** `npm test` from `apps/immersive/momentum-3d`
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) — typecheck + tests on push/PR to main
