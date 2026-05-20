# Duck OS — Functional Requirements

**Last updated:** 2026-05-15  
**Owner:** Product Manager  
**Status:** Phase 3 complete. Phase 4 in progress.

---

## Daily Protocol (`/start`)

### Check-In Gate
- **3 questions:** energy tap 1–10, water yes/no, light comfortable/harsh
- **Returning users (<4h):** skip questions entirely; jump to state diagnosis using `duckos:start:last_check`
- **`?reset=true`:** forces full re-check regardless of last check time — used post-Emergency Recovery

### Routing Logic
Implemented in `src/lib/protocol-router.ts` — pure function, no React, no side effects.

| Energy | Lock State | Route | Reason |
|---|---|---|---|
| 1–3 | any | `/momentum` | Crash state |
| 4–6 | unlocked | `/atomizer` | Low fuel, task-safe |
| 4–6 | locked | `/momentum` | Sensory override |
| 7–10 | unlocked | `/ignition` | Flight ready |
| 7–10 | locked | `/atomizer` | Skip Ignition, go direct |

### Email Gate
- Appears **after** routing decision — never before
- Shows **once per device** (`duckos:start:email_shown` flag)
- Never blocks navigation
- Copy: Starter Kit offer (5 protocols + Notion template)
- On subscribe: calls `/api/subscribe` with `source: 'daily-checkin'`

### Subscribe Source Tags
All `/api/subscribe` calls must include a `source` field:
- `daily-checkin` — from `/start`
- `emergency-protocol` — from `/momentum`
- `starter-kit-homepage` — from homepage

---

## Gradient Lock Model (`system-context.tsx`)

| Energy | Sensory Required | Lock Condition |
|---|---|---|
| 7–10 | Any 1 of 3 | Never locked by sensory alone |
| 4–6 | Any 2 of 3 | Locked if < 2 sensory checks |
| 1–3 | All 3 | Locked if < 3 sensory checks |
| ≤2 | — | Hard lock regardless (fail-safe) |

- **Fail-safe:** Critical energy (≤2) resets all sensory to `true` and hard-locks — prevents lockout when user needs tools most
- **Warning:** `lockProximity` (0–1) drives UI glow intensity as user approaches lock threshold
- **First visit:** defaults to all sensory `true` (unlocked) — no barrier on first visit

---

## Ignition Sequence (`/ignition`)

- **Duration:** 600s total — Spark (200s) → Target (200s) → Launch (200s)
- **Timer:** derived from `Date.now() - startTime` (not incrementing state) to prevent drift
- **Post-completion:** writes `duckos:ignition:done:<date>` → auto-redirects to `/protocol-builder` after 2s

---

## Protocol Builder (`/protocol-builder`)

### Modes
- **Architect Mode:** drag-drop node canvas, sidebar config, edge connections, node deletion
- **Pilot Mode:** camera flight through graph, per-node timer, auto-advance, sound alerts

### Node Types
| Type | Config | Pilot Behavior |
|---|---|---|
| `action` | Label only | "Awaiting manual completion" |
| `tool` | Label + toolId | Launch button (atomizer/emergency); fallback if missing |
| `timer` | Label + duration (1–120 min) | Countdown + sound + 1.5s auto-advance |
| `ignition` | Label only | Triggers Ignition Sequence |

- **Type change** auto-initializes defaults: `timer` → `duration: 25`, `tool` → `toolId: 'atomizer'`

### Default Seeding
- Seeds 3 default nodes **only on first visit** (flagged by `duckos:protocol:visited`)
- Empty after that — never re-seeds on refresh or refresh

### Start Fresh
- Available in Architect sidebar only (build mode)
- Requires `window.confirm` before clearing
- Clears to blank canvas; does **not** route to Ignition afterward

### Pre-Flight Nudge
- If `duckos:ignition:done:<date>` is absent: shows soft interstitial on entry
- Options: "Run Ignition (10 min)" or "Go straight to Builder"
- **Never a hard gate** — user can always skip

### Timer Audio (Web Audio API — no external files)
| Sound | Waveform | Character |
|---|---|---|
| Chime | Sine | 880 Hz → 440 Hz sweep |
| Beep | Square | 440 Hz, short |
| Duck | Sawtooth | 580 Hz → 180 Hz sweep |

- 5-second amber pulse warning before T=0
- Muted + selector disabled when `isProtected` (sensory mode active)
- Preference persists in `duckos:timer:sound`

---

## The Atomizer (`/atomizer`)

- **Input:** "What's the scary task?" (free text)
- **AI call:** `/api/ai/atomize` → 12–15 atomic steps, each ≤2 min
- **Focus Window:** only 3 steps visible at once (Law 3)
- **Energy Check:** mandatory interrupt every 6 completed steps
- **Completion:** localStorage cleared **immediately** on last step — returning visits always show fresh input
- **Return redirect:** `?returnTo=/protocol-builder` → auto-redirect on completion

---

## Emergency Recovery (`/momentum`)

- **5-step fail-safe:** Breathe → Hydrate → Ground → Reset → Start
- **Post-completion CTA:** redirects to `/start?reset=true` to force re-diagnosis after recovery

---

## CMS Dashboard (`/content`)

- **Auto-save:** 4-second debounce; preserves status (draft/published/scheduled)
- **Delete protection:** published posts cannot be deleted (403); must unpublish first
- **Facebook auto-post:** triggers on first publish via `facebookPosted` flag (KV-locked for dedup)
- **Unsplash:** `/api/unsplash` proxy for cover image search
- **AI assistant:** `/api/ai` for titles, excerpt, SEO, tags, outline (Gemini)
- **Scheduled publishing:** overdue `scheduled` posts auto-promoted to `published` on fetch or via `/api/posts/maintenance` (hourly cron)

---

## Blog (`/blog`)

- Source: `wp.adduckivity.com` via WordPress REST API v2
- SEO: pulled from Yoast `yoast_head_json` and Jetpack `meta` fields
- Cache: Next.js `revalidate: 300` (5 min)
- Filter: English-only posts via `isEnglishPost()`

---

## Acceptance Criteria Checklist

### Daily Protocol
- [ ] 3 questions displayed in sequence; energy uses 1–10 tap input
- [ ] Returning users (<4h) skip to diagnosis
- [ ] `?reset=true` bypasses returning-user skip
- [ ] Routing matches 5-path table above exactly
- [ ] Email gate appears only after routing, never before, once per device
- [ ] Subscribe call includes `source: 'daily-checkin'`

### Protocol Builder
- [ ] Start Fresh only in Architect sidebar; requires confirm; no Ignition redirect
- [ ] Default nodes seed once only (absent `duckos:protocol:visited`)
- [ ] Type change auto-initializes defaults
- [ ] Pilot mode shows correct content for all 4 node types
- [ ] Pre-flight nudge is soft; "Go straight to Builder" option available
- [ ] Timer audio plays at T=0; amber pulse at T=5s
- [ ] Timer muted when `isProtected`

### Atomizer
- [ ] localStorage cleared immediately on last step (not next visit)
- [ ] No reset button; fresh input on return
- [ ] `?returnTo=` redirect fires on completion
