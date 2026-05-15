# System Spec: OS Launchpad

**Last updated:** 2026-05-11  
**Files:** `src/app/os/page.tsx`, `src/components/OSLaunchpadScene.tsx`, `src/components/LaunchpadOverlay.tsx`

---

## Tech Spec

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js 16.2 App Router (Edge Runtime) |
| 3D | Three.js 0.184, React Three Fiber 9.6, Drei 10.7, Postprocessing 3.0 |
| Animation | Framer Motion 12 |
| Access | Client-side hostname check (localhost/127.0.0.1 only) |
| Persistence | localStorage (via system-context) |

---

## Purpose

3D biological shield web and central command center — localhost only. Provides a visual overview of all Duck OS tools, biological state visualization, and 3D roadmap of the project.

---

## Access Control

**Client-side restriction:** Only accessible on `localhost` or `127.0.0.1`. Production builds show a message: "OS Launchpad is a localhost-only tool for your biological safety."

```typescript
const isLocalhost = typeof window !== 'undefined'
  && window.location.hostname === 'localhost'
  || window.location.hostname === '127.0.0.1'
```

---

## Key Components

### Shield Web (`src/components/ShieldWeb.tsx`)
- 3D bio-feedback visualization (water, light, noise)
- Module-singleton `_bioAudio` to prevent duplicate audio per mount
- `AnimatePresence` removed from wrapping group (was no-op)

### Tool Nodes (`src/components/ToolNode.tsx`)
- Launchable tool shortcuts with animations
- Audio cleanup function pauses and nulls audio on unmount

### Roadmap Web (`src/components/RoadmapWeb.tsx`)
- 3D roadmap visualization with task toggling
- Phase nodes as icosahedron geometry
- Rollback uses functional `setPhases(prev => ...)` to avoid stale closures

### Launchpad Overlay (`src/components/LaunchpadOverlay.tsx`)
- 2D UI overlay for navigation
- Uses Framer Motion for animations

---

## localStorage Keys

| Key | Set by | Purpose |
|---|---|---|
| `duckos:system:state` | system-context.tsx | Energy + sensory state |
| `duckos:ignition:done:<date>` | /ignition | Today's ignition completion |

---

## Routing

| Route | Access |
|---|---|
| `/os` | localhost only (client-side hostname check) |

---

## Key Files

- `src/app/os/page.tsx` — OS Launchpad page with localhost guard
- `src/components/OSLaunchpadScene.tsx` — 3D scene (shield + nodes + roadmap)
- `src/components/LaunchpadOverlay.tsx` — 2D navigation overlay
- `src/components/ShieldWeb.tsx` — Biological feedback 3D shield
- `src/components/ToolNode.tsx` — 3D tool node with animation
- `src/components/RoadmapWeb.tsx` — 3D roadmap visualization
- `src/components/RoadmapNode.tsx` — Single icosahedron node for roadmap
