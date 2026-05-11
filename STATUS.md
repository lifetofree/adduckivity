# Duck OS — Project Status

**Last updated:** 2026-05-11  
**Branch:** dev (13 commits ahead of main)  
**Deploy target:** Cloudflare Pages (Workers paid plan — bundle ~9.8 MiB)  
**Tests:** 118 passing across 12 files (Vitest)

---

## Live Routes

| Route | Status | Description |
|---|---|---|
| `/` | ✅ Live | Homepage — hero CTA points to `/start` ("Start Your Day →") |
| `/start` | ✅ Live | Daily Protocol check-in (energy/water/light → state diagnosis → routing) |
| `/os` | ✅ Live | OS Launchpad — tool grid with biological lock overlay |
| `/ignition` | ✅ Live | 10-min ignition session (600s). Redirects to `/protocol-builder` on complete |
| `/protocol-builder` | ✅ Live | Node-graph protocol builder — Build + Pilot modes |
| `/atomizer` | ✅ Live | Task atomizer — breaks tasks into timed micro-steps |
| `/momentum` | ✅ Live | Emergency recovery protocol |
| `/blog` | ✅ Live | Blog CMS (markdown posts) |

---

## Features Shipped (Phase 3)

### Daily Protocol (`/start`)
- 3-question biological check-in: energy (1–10), water (yes/no), light (comfortable/harsh)
- State diagnosis: Crash State (1–3) / Low Fuel (4–6) / Flight Ready (7–10) with color + recommended tool
- Returns users: banner shows last check-in date with "Update state?" CTA (clears SystemBar z-index)
- Email gate (non-blocking, post-value): appears after routing, not before
- State persists in localStorage; returning users skip check-in or update
- Mobile-optimized with `pointer-events-none` on 3D Canvas so UI remains clickable
- `useSearchParams()` wrapped in `<Suspense>` for static generation build compatibility

### Ignition → Protocol Builder flow
- Ignition completion writes `duckos:ignition:done:<date>` to localStorage
- Protocol Builder reads this flag and shows soft "pre-flight" nudge overlay (not a hard gate)
- Users can skip to builder directly from nudge; bypasses if already done today

### Protocol Builder improvements
- **Start Fresh** button in ArchitectSidebar with confirm dialog — resets graph to empty
- **First-visit seeding** — default nodes only seeded on very first visit (controlled by `duckos:protocol:visited` flag; no re-seed on refresh)
- **Timer completion sound** — Web Audio API synthesis, no external files
  - Three sounds: Chime (sine), Beep (square), Duck 🦆 (sawtooth sweep 580→180 Hz)
  - Sound preference persists in `duckos:timer:sound`
  - 5-second warning flash (amber pulse) before T=0
  - Respects `isProtected` (sensory mode): muted + selector disabled when active
- Timer auto-advances to next node 1.5s after completion

### Atomizer improvements
- Auto-clears on task completion — no manual reset needed when returning
- Initial load guard: if all steps completed, does not restore stale state

---

## localStorage Key Registry

| Key | Set by | Purpose |
|---|---|---|
| `duckos:system:state` | system-context.tsx | Energy + sensory + lock state |
| `duckos:start:last_check` | /start | Last check-in timestamp |
| `duckos:start:email_shown` | /start | Email gate shown flag |
| `duckos:ignition:done:<date>` | /ignition | Today's ignition completion flag |
| `duckos:protocol:visited` | /protocol-builder | First-visit flag (controls default seeding) |
| `duckos:protocol:execution` | /protocol-builder | Active execution state |
| `duckos:atomizer:active_task` | /atomizer | Current atomizer task |
| `duckos:timer:sound` | /protocol-builder | Timer sound preference (chime/beep/duck) |

---

## Architecture Notes

- **Fixed SystemBar**: `z-[100]` / `h-14` (56px). Absolute elements need `top-[72px]` minimum to clear it.
- **3D Canvas**: always apply `pointer-events-none` to decorative R3F Canvas wrappers — otherwise intercepts all clicks on overlaid UI.
- **Edge runtime**: `src/app/api/` routes are Cloudflare Workers edge-compatible. No Node.js APIs.
- **KV mocking**: `src/lib/dev-kv.ts` provides in-memory mock for local dev. Real KV binding used on Cloudflare.
- **Bundle size**: ~9.8 MiB total. Requires Cloudflare Workers **paid** plan (free limit is 3 MiB).

---

## Pending / Next Up

| Item | Priority | Notes |
|---|---|---|
| Starter Kit delivery | High | Email gate promises "5 protocols + Notion template" — nothing is sent yet |
| ROADMAP.md sync | Medium | Phase 3 marked as "next" but shipped; test count shows 94 (should be 118) |
| Mobile Protocol Builder | Medium | PO approved concept: Pilot mode only on mobile (skip graph, go straight to card flow) |

---

## Agent Team Files

`.ai.agents/` — role-specific briefings for PO, PM, Tech Lead, Architect, Coder, Reviewer, DevOps  
Each file updated to reflect current feature set, localStorage keys, pre-deploy checklist.
