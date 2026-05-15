# System Spec: Daily Protocol (/start)

**Last updated:** 2026-05-11  
**File:** `src/app/start/page.tsx`

---

## Purpose

Entry point for the Duck OS system. A 3-question biological check-in that diagnoses user state and routes them to the appropriate tool based on energy level.

---

## Check-In Questions

1. **Energy:** Slider 1–10 ("How's your energy right now?")
2. **Water:** Yes/No ("Have you had water in the last hour?")
3. **Light:** Comfortable/Harsh ("How's your light environment?")

---

## State Diagnosis

| Energy Range | Label | Color | Recommended Tool |
|---|---|---|---|
| 1–3 | Crash State | Red | `/momentum` (Emergency Recovery) |
| 4–6 | Low Fuel | Amber | `/atomizer` (Task decomposition) |
| 7–10 | Flight Ready | Green | `/protocol-builder` or `/ignition` |

---

## Features

| Feature | Implementation |
|---|---|
| Returning user banner | Shows last check-in date with "Update state?" CTA |
| Email gate (non-blocking) | Appears after routing decision; subscribe to SendFox |
| State persistence | `duckos:start:last_check` in localStorage |
| Mobile optimization | `pointer-events-none` on 3D Canvas for clickable UI |
| Static generation compat | `useSearchParams()` wrapped in `<Suspense>` boundary |
| `duckos:start:email_shown` | Prevents email gate from re-appearing on same session |

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
