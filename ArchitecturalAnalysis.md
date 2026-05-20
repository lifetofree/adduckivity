# Architectural Analysis: Duck OS (Immersive Adduckivity)

**Last updated:** 2026-05-15  
**Status:** Production Live — https://immersive.adduckivity.com

---

## 1. System Overview

Duck OS is a multi-tool productivity platform for neurodivergent creators, built on a **Cloudflare Edge-first architecture**. It prioritizes zero-cold-start performance, energy-aware tool access, and edge-distributed rendering.

```
Browser → Cloudflare CDN → Next.js App (Edge Runtime) → Cloudflare KV + R2
                                       ↓
                            WordPress REST API (blog)
                            SendFox (email subscription)
                            Facebook Graph API (auto-post on first publish)
                            MiniMax abab6.5s-chat (primary AI)
                            Google Gemini 1.5 Flash (fallback AI)
```

**Deployment:** Cloudflare Pages via `@cloudflare/next-on-pages`. Bundle ~9.8 MiB — requires Workers Paid plan (free limit is 3 MiB).  
**Edge constraint:** All API routes use `export const runtime = 'edge'`. No Node.js built-ins (`fs`, `path`, `crypto`) in any `src/app/api/` route.

---

## 2. Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage — hero CTA links to `/start` |
| `/start` | Public | Daily Protocol — biological check-in + energy-aware routing |
| `/ignition` | Public | 600s power-up ritual (spark → target → launch); auto-redirects to `/protocol-builder` on complete |
| `/protocol-builder` | Public | 3D node-graph tool — Architect mode (build) + Pilot mode (execute) |
| `/atomizer` | Public | AI task decomposition — breaks tasks into atomic steps |
| `/momentum` | Public | Emergency recovery — 5-step fail-safe for burnout spirals |
| `/blog` | Public | WordPress-sourced blog (REST API, `revalidate: 300`) |
| `/content` | Owner | CMS dashboard — full CRUD for Duck OS posts |
| `/os` | Localhost only | 3D command center — client-side hostname guard |

---

## 3. State Architecture

### Client-Side Stores

| Store | File | Technology | Scope |
|---|---|---|---|
| Global system state | `src/lib/system-context.tsx` | React Context + localStorage | energy, sensory, isLocked, lockProximity |
| Protocol graph | `src/lib/protocol-store.ts` | localStorage | node/edge graph, execution state |
| Ignition phase/timer | `src/lib/ignition-store.ts` | Zustand 5 | phase, isRunning, elapsed, targetNodeId |
| Atomizer tasks | `src/lib/atomizer.ts` | localStorage | active task + atomic steps |
| Protocol routing | `src/lib/protocol-router.ts` | Pure function (no state) | energy + isLocked → route recommendation |

### localStorage Key Registry

| Key | Owner | Purpose |
|---|---|---|
| `duckos:system:state` | system-context.tsx | Energy + sensory + lock state |
| `duckos:start:last_check` | /start | Last check-in timestamp |
| `duckos:start:email_shown` | /start | Email gate shown flag (once per device) |
| `duckos:ignition:done:<date>` | /ignition | Today's ignition completion flag |
| `duckos:protocol:visited` | /protocol-builder | First-visit flag (controls default node seeding) |
| `duckos:protocol:execution` | /protocol-builder | Active Pilot mode progress |
| `duckos:atomizer:active_task` | /atomizer | Current task + steps |
| `duckos:timer:sound` | /protocol-builder | Timer sound preference (chime/beep/duck) |

---

## 4. Gradient Lock Model

Energy-aware tool access control implemented in `system-context.tsx`.

| Energy | Sensory Required | Lock Condition |
|---|---|---|
| 7–10 | Any 1 of 3 | Never locked by sensory alone |
| 4–6 | Any 2 of 3 | Locked if < 2 sensory |
| 1–3 | All 3 | Locked if < 3 sensory |
| ≤2 | — | Hard lock regardless (fail-safe) |

**Effect on routing** (via `protocol-router.ts`):
- Energy 1–3 → `/momentum`
- Energy 4–6 + unlocked → `/atomizer`
- Energy 4–6 + locked → `/momentum`
- Energy 7–10 + unlocked → `/ignition`
- Energy 7–10 + locked → `/atomizer`

---

## 5. Data Flow

### Daily Protocol Flow
```
/start → 3 questions → getRecommendation({ energy, isLocked })
       → route to: /momentum | /atomizer | /ignition
       → email gate (post-routing, non-blocking)
       → subscribe to SendFox with source tag
```

### Ignition → Protocol Builder Flow
```
/ignition → Launch phase complete
          → write duckos:ignition:done:<date>
          → redirect to /protocol-builder after 2s
          → Protocol Builder reads flag → skips pre-flight nudge
```

### Atomizer Flow
```
/protocol-builder (tool node) → /atomizer?returnTo=/protocol-builder
                               → AI atomize via /api/ai/atomize
                               → steps completed → localStorage cleared
                               → auto-redirect back to /protocol-builder
```

### Post Publishing Flow
```
/content editor → auto-save (4s debounce) → /api/posts/save
                → Publish → /api/posts (PUT) → facebookPosted flag check
                → first publish → Facebook Graph API → set facebookPosted=true
```

---

## 6. API Routes (Edge Runtime)

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/ai` | POST | — | AI assistant (Gemini) for CMS |
| `/api/ai/atomize` | POST | — | MiniMax → Gemini fallback; returns atomic steps |
| `/api/assets/[...key]` | GET | — | R2 asset proxy |
| `/api/posts` | GET/PUT/DELETE | `x-admin-key` | Post CRUD |
| `/api/posts/save` | POST | `x-admin-key` | Auto-save (upsert) |
| `/api/posts/maintenance` | GET | `?key=` | Promote overdue scheduled posts (cron) |
| `/api/stats` | GET | — | KV analytics (paginated) |
| `/api/subscribe` | POST | — | SendFox subscription; requires `source` field |
| `/api/track` | POST | — | Privacy analytics event tracking |
| `/api/unsplash` | GET | — | Unsplash image search proxy |
| `/api/upload` | POST | `x-admin-key` | R2 image upload |
| `/api/roadmap` | GET | — | Roadmap data from filesystem |

---

## 7. AI Providers

| Provider | Model | Use Case | Priority |
|---|---|---|---|
| MiniMax | `abab6.5s-chat` | Atomizer task decomposition | Primary |
| Google Gemini | `gemini-1.5-flash` | CMS assistant + Atomizer fallback | Fallback |

Fallback logic: MiniMax is called first; if it fails or times out, the request retries against Gemini.

---

## 8. Infrastructure

| Resource | Binding | ID / Name |
|---|---|---|
| KV | `POSTS_KV` | `a07209b5ad9a4972aa82a30d0af3071e` |
| R2 | `ASSETS_BUCKET` | `immersive-assets` |
| Local KV mock | `src/lib/dev-kv.ts` | In-memory, activates when `NODE_ENV=development` |

**Cloudflare settings:** `nodejs_compat` flag enabled, compatibility date `2024-09-23`.

---

## 9. 3D Architecture Patterns

- All Three.js Canvas components set `dpr={[1, 1.5]}` — caps device pixel ratio for mobile performance
- Decorative 3D Canvas wrappers (e.g. `StateCheckScene`) must have `pointer-events-none` on their container — they must not capture user taps
- Absolute-positioned UI overlays in page content areas use `top-[72px]` minimum to clear the fixed SystemBar (`h-14` = 56px)
- Audio singletons (`ignition-audio.ts`, `_bioAudio` in `ShieldWeb.tsx`) prevent duplicate audio allocations on re-mount

---

## 10. NodeType System (Protocol Builder)

```typescript
type NodeType = 'action' | 'tool' | 'timer' | 'ignition'
```

| Type | Architect Config | Pilot Behavior |
|---|---|---|
| `action` | Label only | Shows "Awaiting manual completion" |
| `tool` | Label + toolId (`atomizer` / `emergency`) | Launch button; fallback if toolId missing |
| `timer` | Label + duration (1–120 min, default 25) | Countdown + sound + auto-advance at 0 |
| `ignition` | Label only | Auto-triggers Ignition Sequence |

Type change auto-initializes defaults: `timer` → `duration: 25`, `tool` → `toolId: 'atomizer'`.

---

## 11. Testing

- **Framework:** Vitest 4.1 + jsdom 29 + Testing Library (DOM 10.4, React 16.3)
- **Total:** 118 tests across 12 files
- **Run:** `npm test` from `apps/immersive/momentum-3d`
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) — typecheck + tests on push/PR to main
- **Key suite:** `protocol-router.test.ts` — 24 tests covering all 5 routing paths + edge cases
