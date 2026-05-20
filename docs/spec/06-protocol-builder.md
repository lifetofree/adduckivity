# System Spec: Protocol Builder

**Last updated:** 2026-05-15  
**Files:** `src/lib/protocol-store.ts`, `src/app/protocol-builder/page.tsx`, `src/components/ProtocolBuilder/ProtocolScene.tsx`, `src/components/ProtocolBuilder/ArchitectSidebar.tsx`

---

## Tech Spec

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js 16.2 App Router (Edge Runtime) |
| 3D | Three.js 0.184, React Three Fiber 9.6, Drei 10.7, Postprocessing 3.0 |
| Persistence | localStorage (`duckos:protocol:visited`, `duckos:protocol:execution`) |
| Animation | Framer Motion 12 |
| Audio | Web Audio API (synthesized via `timer-audio.ts`) |
| State | React Context + custom hook (no external state lib for graph) |

---

## Purpose

3D momentum constellation tool for building and executing personal protocols. Users design directed graphs of action, tool, timer, and ignition nodes, then "fly through" them in sequence.

---

## Two Modes

### Architect Mode
- Physics-engine node canvas (drag, drop, connect)
- Sidebar with node configuration
- Drag-to-connect edges between nodes
- Node deletion
- Node types: `action`, `tool`, `timer`, `ignition`
- Type change auto-initializes defaults: `timer` → `duration: 25`, `tool` → `toolId: 'atomizer'`

### Pilot Mode
- Camera flight system through the node graph
- Per-node timer with auto-advance
- Auto-advance timer (configurable delay, default 1.5s after timer hits 0)
- Branching path selection at fork nodes
- Timer completion sounds (Web Audio API)
- Tool nodes show launch button (e.g. Atomizer) with fallback message for unconfigured tools
- Action nodes show "Awaiting manual completion" message

---

## Data Model

```typescript
type NodeType = 'action' | 'tool' | 'timer' | 'ignition'

interface ProtocolNode {
  id: string
  type: NodeType
  label: string
  position: [number, number, number]
  data: {
    toolId?: 'atomizer' | 'emergency'   // for type: 'tool'
    duration?: number                    // for type: 'timer' (minutes, default 25)
  }
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
- Morning Ritual (action)
- Deep Work Session (tool, toolId: atomizer)
- Recovery Walk (action)

Subsequent visits do NOT re-seed — preserves user modifications.

---

## Node Type Behavior

| Type | Architect Config | Pilot Display |
|---|---|---|
| `action` | Label only | "Awaiting manual completion of physical action." |
| `tool` | Label + Tool ID selector (UI: `atomizer` only) | Launch Atomizer button, or fallback message if toolId missing |
| `timer` | Label + Duration (1-120 min, default 25) | Countdown timer with sound selector, auto-advance on completion |
| `ignition` | Label only | Auto-triggers Ignition Sequence, transitions to target node on completion |

**UI Limitations (known gaps vs. data model):**
- The type selector in ArchitectSidebar only exposes `action`, `tool`, `timer` — **`ignition` cannot be set via the sidebar type switcher**. Ignition nodes can only come from default seeds or future tooling.
- The toolId selector only shows `atomizer` — **`emergency` toolId is defined in the type but not available in the UI**.

---

## Start Fresh

- **Location:** Architect sidebar only (build mode) — not available in Pilot mode
- **Behavior:** Requires `window.confirm` before clearing; clears graph to blank canvas
- **Important:** Does NOT route to Ignition after clearing — user explicitly chose to skip

## Known Issues

| Issue | Location | Impact | Fix |
|---|---|---|---|
| "Ignite Momentum" button has no `isLocked` guard | `ArchitectSidebar.tsx:57` | Locked users can start 600s Ignition from sidebar, bypassing the page-level lock check in `protocol-builder/page.tsx:170` | Pass `isLocked` from `useSystem()` as a prop and disable the button when locked |
| `ignition` node type not selectable in sidebar | `ArchitectSidebar.tsx:170-174` | Cannot set a node to `ignition` type via the type selector | Add `<option value="ignition">Ignition</option>` to the type select |
| `emergency` toolId not available in UI | `ArchitectSidebar.tsx:198-205` | `emergency` toolId is in the data model but the Tool ID selector only shows `atomizer` | Add `<option value="emergency">Emergency Recovery</option>` to the tool select |

---

## Integration

- **Atomizer launch:** Tool nodes with `toolId: 'atomizer'` link to `/atomizer?returnTo=/protocol-builder`; on task completion, returns to Protocol Builder
- **Pre-flight nudge:** If no Ignition completed today (`duckos:ignition:done:<date>` absent), shows a soft interstitial on entry with two options: "Run Ignition (10 min)" or "Go straight to Builder". Never a hard gate — user can always skip.
- **Ignition flow:** Ignition nodes auto-trigger the Ignition Sequence; completion transitions to the next connected node.

---

## Key Files

- `src/lib/protocol-store.ts` — Graph state, localStorage persistence, NodeType definition
- `src/app/protocol-builder/page.tsx` — Main page with mode switching, timer logic, Pilot HUD
- `src/components/ProtocolBuilder/ProtocolScene.tsx` — 3D scene with node graph
- `src/components/ProtocolBuilder/ArchitectSidebar.tsx` — Config sidebar with node editing, type switching
- `src/components/ProtocolBuilder/IntroSlides.tsx` — First-visit onboarding slides
- `src/components/ProtocolBuilder/IgnitionOverlay.tsx` — Ignition phase overlay
- `src/lib/timer-audio.ts` — Web Audio API synthesis
- `src/lib/ignition-store.ts` — Zustand store for Ignition state
