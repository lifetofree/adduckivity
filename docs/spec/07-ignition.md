# System Spec: Ignition Sequence

**Last updated:** 2026-05-15  
**Files:** `src/lib/ignition-store.ts`, `src/lib/ignition-audio.ts`, `src/app/ignition/page.tsx`, `src/components/IgnitionOverlay.tsx`

---

## Tech Spec

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js 16.2 App Router (Edge Runtime) |
| State | Zustand 5 |
| 3D | Three.js 0.184, React Three Fiber 9.6, Drei 10.7 |
| Audio | HTML5 `<audio>` element managed by `ignition-audio.ts` |
| Animation | Framer Motion 12 |

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

## Post-Completion Flow

On Launch phase completion:
1. Writes `duckos:ignition:done:<date>` to localStorage
2. Auto-redirects to `/protocol-builder` after **2 seconds** (not homepage)

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
- `src/components/ProtocolBuilder/IgnitionOverlay.tsx` — Phase transition overlay
- `src/components/ProtocolBuilder/useIgnitionScene.ts` — R3F hook for ignition 3D effects

## Known Issues

| Issue | Location | Severity | Fix |
|---|---|---|---|
| `NodeJS.Timeout` type in browser file | `ignition-audio.ts:4` | Low | `setInterval` in browser returns `number`; change to `ReturnType<typeof setInterval>` |
| Audio files missing | `ignition-audio.ts:8-12` | Low | Phase audio tracks (spark/target/launch MP3s) don't exist; code handles gracefully via `.catch()` |
