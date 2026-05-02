# Implementation Plan: Biological Context Layer (System Diagnostic)

## Objective
Implement a persistent biological and energy state management system ("The Control Center") to enforce the "Protect the System" mandate. This includes sensory checks (water, light, noise) and energy scoring (1-10) that dynamically affect tool access and behavior.

---

## Key Files & Context
- `apps/immersive/momentum-3d/src/lib/system-context.tsx`: The state kernel managing biological and energy data.
- `apps/immersive/momentum-3d/src/components/ProtocolBuilder/SystemBar.tsx`: The primary UI entry point for state management.
- `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ControlCenter.tsx`: The diagnostic interface for adjusting biological state.
- `apps/immersive/momentum-3d/src/components/SystemGate.tsx`: The enforcement component for hardware locks.
- `apps/immersive/momentum-3d/src/app/page.tsx`: Homepage tool filtering and state reflection.
- `apps/immersive/momentum-3d/src/app/atomizer/page.tsx`: Implementation of energy-sensitive constraints.

---

## Implementation Steps

### Phase 1: The State Engine
1.  **Develop `SystemContext.tsx`**:
    - Manage `energy` (1-10), `sensory` (water/light/noise booleans), and `lastCheck` (timestamp).
    - Implement `localStorage` persistence under `duck_os_system_v1`.
    - Expose `isLocked` (any sensory fail) and `isProtected` (energy <= 3) states.
2.  **Integrate Provider**: Wrap the root layout in `SystemProvider` to ensure global state availability.
3.  **Unit Testing**: Create `system.test.tsx` to verify initialization, persistence, and derived logic.

### Phase 2: The Control Center UI
1.  **Develop `ControlCenter.tsx`**:
    - Build a slide-in panel using Framer Motion.
    - Implement a 1-10 energy slider with "Protected" and "Performance" zones.
    - Add toggles for Sensory Sync (Hydration, Light, Noise).
2.  **Update `SystemBar.tsx`**:
    - Replace the static energy indicator with a dynamic button that triggers the `ControlCenter`.
    - Implement live status labels ("System Stable" vs "System Locked").

### Phase 3: Enforcement & Contextual Filtering
1.  **Homepage Integration**:
    - Update `page.tsx` to use `SystemBar` and `ToolGrid`.
    - Implement logic in `ToolGrid` to filter high-complexity tools when `isProtected` is true.
    - Add visual lock indicators (🔒) to tools when `isLocked` is true.
2.  **Route Protection (`SystemGate`)**:
    - Develop `SystemGate.tsx` to wrap restricted routes.
    - Implement a full-screen "System Lock" overlay that requires sensory check completion to dismiss.
    - Wrap `/atomizer` and `/protocol-builder` routes with `SystemGate`.
3.  **Dynamic Tool Constraints**:
    - Update the Atomizer's `handleComplete` logic to check `isProtected`.
    - Reduce the energy-check threshold from 6 steps to 3 steps in Protected Mode.

---

## Verification & Testing
- [x] **Unit Tests**: Run `npm run test src/__tests__/system.test.tsx` (Passed).
- [x] **Build Verification**: Run `npm run build:cf` to ensure no environment mismatches or type errors (Passed).
- [x] **Manual Flow**: Verify state persistence across refreshes and accurate redirect behavior for locked systems.
