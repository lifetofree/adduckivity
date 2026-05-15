# System Spec: Gradient Lock Model

**Last updated:** 2026-05-11  
**File:** `src/lib/system-context.tsx`

---

## Purpose

Energy-aware tool access control. Duck OS adjusts how many sensory checks (water, light, noise) are required based on the user's current energy level. Lower energy = stricter lock requirements, protecting users from burnout spirals.

---

## Energy Levels

| Level | Label | Sensory Required | Lock Condition |
|---|---|---|---|
| 7–10 | High | Any 1 of 3 | Never locked by sensory alone |
| 4–6 | Medium | Any 2 of 3 | Locked if < 2 sensory |
| 1–3 | Low | All 3 required | Locked if < 3 sensory |
| 0–2 | Critical | — | Hard lock regardless |

---

## Context Values

| Key | Type | Description |
|---|---|---|
| `energy` | `number` (0–10) | Current energy level |
| `sensory` | `{ water: boolean, light: boolean, noise: boolean }` | Toggle states |
| `sensoryRequired` | `number` | 1, 2, or 3 based on energy |
| `lockProximity` | `number` (0–1) | 1 = safe, 0 = about to lock |
| `isLocked` | `boolean` | True if locked out of tools |
| `isProtected` | `boolean` | True when energy ≤ 3 |
| `isLoaded` | `boolean` | True after initial localStorage hydration |
| `isSyncing` | `boolean` | Sync status indicator |
| `isFooterVisible` | `boolean` | Footer visibility toggle |
| `systemBarNode` | `React.ReactNode` | Slot for per-page SystemBar customization |
| `footerNode` | `React.ReactNode` | Slot for per-page footer customization |

---

## Fail-Safe Design

**Critical energy (≤2):** Triggers biological crash recovery — resets all sensory checks to `true` and applies hard lock regardless of sensory state. This prevents users from being locked out when they need tools most.

**Warning glow:** `lockProximity` value drives UI warning (glow intensity) as user approaches lock threshold.

---

## Storage

- **Key:** `duckos:system:state` in localStorage
- **Migration:** Auto-migrates from legacy `st8` key on first load
- **Default:** First-time visitors default to all sensory `true` (unlocked) — no blocking on first visit

---

## Usage Example

```tsx
import { useSystem } from '@/lib/system-context'

function MyComponent() {
  const { energy, sensory, isLocked, isProtected } = useSystem()
  // ...
}
```

**Note:** `SystemProvider` wraps the root layout. All pages have access via `useSystem()`.
