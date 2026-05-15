# System Spec: Protocol Builder

**Last updated:** 2026-05-11  
**Files:** `src/lib/protocol-store.ts`, `src/app/protocol-builder/page.tsx`, `src/components/ProtocolBuilder/ProtocolScene.tsx`, `src/components/ProtocolBuilder/ArchitectSidebar.tsx`

---

## Purpose

3D momentum constellation tool for building and executing personal protocols. Users design directed graphs of action nodes, then "fly through" them in sequence.

---

## Two Modes

### Architect Mode
- Physics-engine node canvas (drag, drop, connect)
- Sidebar with node configuration
- Drag-to-connect edges between nodes
- Node deletion
- Node types: action, ignition, milestone, fork

### Pilot Mode
- Camera flight system through the node graph
- Per-node timer with auto-advance
- Auto-advance timer (configurable delay, default 1.5s after timer hits 0)
- Branching path selection at fork nodes
- Timer completion sounds (Web Audio API synthesis)

---

## Data Model

```typescript
interface ProtocolNode {
  id: string
  type: 'action' | 'ignition' | 'milestone' | 'fork'
  label: string
  duration?: number        // seconds
  content?: string        // markdown
  position?: { x: number; y: number }
  color?: string
}

interface ProtocolEdge {
  id: string
  source: string          // node id
  target: string          // node id
}

interface ProtocolGraph {
  nodes: ProtocolNode[]
  edges: ProtocolEdge[]
}
```

---

## localStorage Keys

| Key | Purpose |
|---|---|
| `duckos:protocol:visited` | First-visit flag (default nodes seeded once only) |
| `duckos:protocol:execution` | Active execution state (Pilot mode progress) |
| `duckos:ignition:done:<date>` | Ignition completion flag (read by Protocol Builder on load) |

---

## Timer Audio (Web Audio API)

Synthesized sounds via `src/lib/timer-audio.ts`:

| Sound | Waveform | Character |
|---|---|---|
| Chime | Sine | 880 Hz → 440 Hz sweep |
| Beep | Square | 440 Hz, short |
| Duck | Sawtooth | 580 Hz → 180 Hz sweep |

Sound preference stored in `duckos:timer:sound`. 5-second amber pulse warning before T=0. Respects `isProtected` (muted when sensory mode active).

---

## Default Seeding

On first visit (flagged by `duckos:protocol:visited`), seeds default protocol nodes:
- Duck OS Reset
- Energy Check
- Task Selection
- Shutdown Sequence

Subsequent visits do NOT re-seed — preserves user modifications.

---

## Integration

- **Atomizer launch:** Action nodes link to `/atomizer?returnTo=/protocol-builder`; on task completion, returns to Protocol Builder
- **Ignition flow:** Completion of ignition sets `duckos:ignition:done:<date>`; Protocol Builder shows soft pre-flight nudge overlay if not done today

---

## Key Files

- `src/lib/protocol-store.ts` — Graph state, localStorage persistence
- `src/app/protocol-builder/page.tsx` — Main page
- `src/components/ProtocolBuilder/ProtocolScene.tsx` — 3D scene with node graph
- `src/components/ProtocolBuilder/ArchitectSidebar.tsx` — Config sidebar
- `src/components/ProtocolBuilder/IntroSlides.tsx` — First-visit onboarding slides
- `src/lib/timer-audio.ts` — Web Audio API synthesis
