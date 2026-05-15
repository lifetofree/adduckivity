# System Spec: Ignition Sequence

**Last updated:** 2026-05-11  
**Files:** `src/lib/ignition-store.ts`, `src/lib/ignition-audio.ts`, `src/app/ignition/page.tsx`, `src/components/IgnitionOverlay.tsx`

---

## Purpose

600-second power-up ritual divided into three phases: Spark (200s) → Target (200s) → Launch (200s). Uses audio crossfade between phases and a visual overlay for phase transitions.

---

## Phases

| Phase | Duration | Audio | Focus |
|---|---|---|---|
| Spark | 200s | Ambient intro | Intention setting |
| Target | 200s | Peak energy | Goal alignment |
| Launch | 200s | Launch energy | Action preparation |

---

## State (Zustand)

```typescript
type IgnitionPhase = 'spark' | 'target' | 'launch' | 'idle'

interface IgnitionState {
  phase: IgnitionPhase
  isRunning: boolean
  startTime: number | null
  elapsed: number
  targetNodeId: string | null
}
```

---

## Audio Manager (`ignition-audio.ts`)

- Single Audio element lifecycle
- Crossfade between phase audio tracks
- Phase-specific audio files
- Graceful fallback if audio files missing (`.catch()` handles errors silently)

---

## localStorage Key

| Key | Purpose |
|---|---|
| `duckos:ignition:done:<date>` | Today's ignition completion flag (written on completion) |

Set to `true` on Launch phase completion with current date. Used by Protocol Builder to show pre-flight nudge.

---

## Timer Implementation

Timer derives from `Date.now() - startTime` (not incrementing state) to prevent drift over 600s.

---

## Key Files

- `src/lib/ignition-store.ts` — Zustand store for phase/timer state
- `src/lib/ignition-audio.ts` — Audio manager with crossfade
- `src/app/ignition/page.tsx` — Main ignition page
- `src/components/IgnitionOverlay.tsx` — Phase transition overlay
- `src/components/useIgnitionScene.ts` — R3F hook for ignition 3D effects
