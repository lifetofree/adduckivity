# System Spec: Daily Protocol (/start)

**Last updated:** 2026-05-15  
**Files:** `src/app/start/page.tsx`, `src/lib/protocol-router.ts`

---

## Tech Spec

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js 16.2 App Router (Edge Runtime + `force-dynamic`) |
| 3D | Three.js 0.184, React Three Fiber 9.6, Drei 10.7 (lazy-loaded, `ssr: false`) |
| Email | SendFox REST API via `/api/subscribe` |
| Persistence | localStorage |
| Animation | Framer Motion 12 |

---

## Purpose

Entry point for the Duck OS system. A 3-question biological check-in that diagnoses user state and routes them to the appropriate tool based on energy level.

---

## Check-In Questions

1. **Energy:** Slider 1–10 ("How's your energy right now?")
2. **Water:** Yes/No ("Have you had water in the last hour?")
3. **Light:** Comfortable/Harsh ("How's your light environment?")

---

## State Diagnosis & Routing

Routing logic lives in `src/lib/protocol-router.ts` — pure function `getRecommendation({ energy, isLocked }) → ProtocolRecommendation`. No React, no side effects, fully testable.

| Energy Range | Lock State | Route | Reason |
|---|---|---|---|
| 1–3 | any | `/momentum` | Crash state — Emergency Recovery |
| 4–6 | unlocked | `/atomizer` | Low fuel — task decomposition |
| 4–6 | locked | `/momentum` | Sensory override — Emergency Recovery |
| 7–10 | unlocked | `/ignition` | Flight ready — power-up ritual first |
| 7–10 | locked | `/atomizer` | Sensory override — skip Ignition, go direct |

---

## Check-In Gate

- **Returning users (<4h):** Skip questions entirely; jump straight to state diagnosis using cached energy/lock state from localStorage (`duckos:start:last_check`)
- **`?reset=true` param:** Forces full 3-question re-check regardless of last check time — used after Emergency Recovery completes to capture updated state

## Features

| Feature | Implementation |
|---|---|
| Returning user skip | <4h since last check → skip to diagnosis via `LAST_CHECK_KEY` |
| `?reset=true` | Forces full re-check; used post-Emergency Recovery |
| Email gate (non-blocking) | Appears **after** routing decision; once per device (`duckos:start:email_shown`); never blocks navigation; copy = Starter Kit offer |
| Subscribe source tag | All `/api/subscribe` calls from `/start` pass `source: 'daily-checkin'` |
| State persistence | `duckos:start:last_check` in localStorage |
| Mobile optimization | `pointer-events-none` on 3D Canvas wrapper div in `start/page.tsx` — `StateCheckScene` has no internal guard; relies on caller to apply this class |
| Subscribe source optional | `/api/subscribe` accepts but does not require `source`; call sites always supply it but the route won't reject a missing field |
| Static generation compat | `useSearchParams()` wrapped in `<Suspense>` boundary |

---

## Ignition Integration

Ignition completion sets `duckos:ignition:done:<date>`. `/start` does not block on this flag — it's informational only for routing nudges.

---

## Key Files

- `src/app/start/page.tsx` — Main check-in page with routing logic
- `src/components/StateCheckScene.tsx` — 3D background for the check-in (lazy-loaded, `ssr: false`)

---

## localStorage Keys

| Key | Purpose |
|---|---|
| `duckos:start:last_check` | Last check-in timestamp |
| `duckos:start:email_shown` | Email gate shown flag (prevents re-prompt) |
