# System Spec: Emergency Recovery (/momentum)

**Last updated:** 2026-05-11  
**Files:** `src/app/momentum/page.tsx`, `src/components/FlywheelScene.tsx`, `src/components/EmergencyProtocol.tsx`

---

## Tech Spec

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js 16.2 App Router (Edge Runtime) |
| 3D | Three.js 0.184, React Three Fiber 9.6, Drei 10.7, Postprocessing 3.0 |
| Animation | Framer Motion 12 |
| Analytics | Duck OS KV analytics via `/api/track` |

---

## Purpose

Interactive 5-step fail-safe for burnout spirals. A 3D momentum flywheel visual syncs action with scroll, guiding users through an emergency recovery protocol.

---

## 5-Step Protocol

1. **Breathe** — Box breathing exercise
2. **Hydrate** — Water check
3. **Ground** — Sensory grounding
4. **Reset** — Clear the slate
5. **Start** — Begin with one small action

---

## 3D Flywheel

`FlywheelScene.tsx` renders a momentum flywheel using React Three Fiber. The flywheel rotation syncs with user scroll, creating a visceral "momentum building" feeling.

Features:
- Point material for visual depth
- Postprocessing effects (bloom on accent color)
- Responsive to energy level via context

---

## Key Components

| Component | Purpose |
|---|---|
| `FlywheelScene.tsx` | 3D momentum flywheel (R3F) |
| `EmergencyProtocol.tsx` | 5-step fail-safe UI |
| `EnergyCheck.tsx` | Energy level check component |
| `SystemGate.tsx` | Energy/sensory gate for tool access |

---

## Tracking

| Event | Trigger |
|---|---|
| `hero_reset_click` | Hero CTA clicked |
| `atomize_task_submitted` | Task submitted to Atomizer |
| `atomize_step_completed` | Individual step completed |

---

## Key Files

- `src/app/momentum/page.tsx` — Momentum page
- `src/components/FlywheelScene.tsx` — 3D flywheel scene
- `src/components/EmergencyProtocol.tsx` — 5-step recovery UI
- `src/components/SystemGate.tsx` — Energy/sensory gate
