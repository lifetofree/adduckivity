# Momentum Ignition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a 10-minute guided momentum-building sequence (600s) within the 3D Protocol Builder that transitions users from stagnation to deep focus.

**Architecture:** A centralized `MomentumIgnition` controller manages a phase-based state machine. It coordinates visual updates in the `ProtocolScene` via a `useIgnitionScene` hook and renders a phase-specific `IgnitionOverlay` for user guidance.

**Tech Stack:** React, Three.js (React Three Fiber), TypeScript, Tailwind CSS.

---

### Task 1: Foundation - Types and State Management

**Files:**
- Create: `apps/immersive/momentum-3d/src/lib/ignition-store.ts`
- Test: `apps/immersive/momentum-3d/src/__tests__/ignition.test.ts`

- [ ] **Step 1: Define types and initial state**

```typescript
export type IgnitionPhase = 'spark' | 'target' | 'launch' | 'idle';

export interface IgnitionState {
  currentPhase: IgnitionPhase;
  startTime: number | null;
  durationRemaining: number;
  isActive: boolean;
}

export const INITIAL_IGNITION_STATE: IgnitionState = {
  currentPhase: 'idle',
  startTime: null,
  durationRemaining: 0,
  isActive: false,
};
```

- [ ] **Step 2: Create a simple state hook (or use existing store pattern)**

```typescript
import { create } from 'zustand';

interface IgnitionStore extends IgnitionState {
  start: () => void;
  stop: () => void;
  tick: () => void;
  setPhase: (phase: IgnitionPhase) => void;
}

export const useIgnitionStore = create<IgnitionStore>((set, get) => ({
  ...INITIAL_IGNITION_STATE,
  start: () => set({ isActive: true, currentPhase: 'spark', durationRemaining: 600, startTime: Date.now() }),
  stop: () => set(INITIAL_IGNITION_STATE),
  setPhase: (phase) => set({ currentPhase: phase }),
  tick: () => {
    const { durationRemaining, currentPhase } = get();
    if (durationRemaining <= 0) {
      set(INITIAL_IGNITION_STATE);
      return;
    }
    const nextRemaining = durationRemaining - 1;
    let nextPhase = currentPhase;
    
    if (nextRemaining <= 300) nextPhase = 'launch';
    else if (nextRemaining <= 480) nextPhase = 'target';
    
    set({ durationRemaining: nextRemaining, currentPhase: nextPhase });
  }
}));
```

- [ ] **Step 3: Write test for state transitions**

```typescript
import { useIgnitionStore } from '../lib/ignition-store';

describe('IgnitionStore', () => {
  it('starts in idle', () => {
    expect(useIgnitionStore.getState().currentPhase).toBe('idle');
  });

  it('transitions through phases correctly', () => {
    const store = useIgnitionStore.getState();
    store.start();
    expect(useIgnitionStore.getState().currentPhase).toBe('spark');
    
    // Mock 121 ticks
    for(let i=0; i<121; i++) useIgnitionStore.getState().tick();
    expect(useIgnitionStore.getState().currentPhase).toBe('target');
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm test src/__tests__/ignition.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/immersive/momentum-3d/src/lib/ignition-store.ts apps/immersive/momentum-3d/src/__tests__/ignition.test.ts
git commit -m "feat: ignition state management"
```

---

### Task 2: Visual Integration - `useIgnitionScene` Hook

**Files:**
- Create: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/useIgnitionScene.ts`
- Modify: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ProtocolScene.tsx`

- [ ] **Step 1: Create hook to map state to scene uniforms**

```typescript
import { useFrame } from '@react-three/fiber';
import { useIgnitionStore } from '../../lib/ignition-store';

export const useIgnitionScene = () => {
  const { currentPhase, isActive } = useIgnitionStore();
  
  useFrame((state) => {
    if (!isActive) return;
    
    // Example: Pulse intensity based on phase
    const intensity = currentPhase === 'spark' ? Math.sin(state.clock.elapsedTime * 10) * 0.5 + 0.5 : 0.2;
    // We will apply this to a global uniform or state ref
  });
};
```

- [ ] **Step 2: Integrate hook into ProtocolScene**

Add `useIgnitionScene()` at the top of the component.

- [ ] **Step 3: Commit**

```bash
git add apps/immersive/momentum-3d/src/components/ProtocolBuilder/useIgnitionScene.ts apps/immersive/momentum-3d/src/components/ProtocolBuilder/ProtocolScene.tsx
git commit -m "feat: connect ignition to 3d scene"
```

---

### Task 3: UI Overlay - `IgnitionOverlay.tsx`

**Files:**
- Create: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/IgnitionOverlay.tsx`
- Modify: `apps/immersive/momentum-3d/src/app/protocol-builder/page.tsx`

- [ ] **Step 1: Implement the overlay with countdown and prompts**

```tsx
import { useIgnitionStore } from '../../lib/ignition-store';

export const IgnitionOverlay = () => {
  const { currentPhase, durationRemaining, isActive, stop } = useIgnitionStore();
  if (!isActive) return null;

  const prompts = {
    spark: "IGNITE YOUR NERVOUS SYSTEM - MOVE NOW",
    target: "ALIGN WITH YOUR PRIMARY GOALS",
    launch: "PREPARE FOR DEEP WORK FOCUS"
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-cyan-400 font-mono">
      <h1 className="text-6xl font-bold mb-4">{durationRemaining}s</h1>
      <p className="text-xl tracking-widest">{prompts[currentPhase as keyof typeof prompts]}</p>
      <button onClick={stop} className="mt-8 border border-cyan-400/50 px-4 py-2 hover:bg-cyan-400/10">ABORT MISSION</button>
    </div>
  );
};
```

- [ ] **Step 2: Add to Page**

Render `<IgnitionOverlay />` at the bottom of the page container.

- [ ] **Step 3: Commit**

```bash
git add apps/immersive/momentum-3d/src/components/ProtocolBuilder/IgnitionOverlay.tsx apps/immersive/momentum-3d/src/app/protocol-builder/page.tsx
git commit -m "feat: ignition overlay ui"
```

---

### Task 4: Dual-Entry Triggers (Sidebar + Node)

**Files:**
- Modify: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ArchitectSidebar.tsx`
- Modify: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ProtocolScene.tsx` (Node click handler)

- [ ] **Step 1: Add "Quick Ignition" to Sidebar**

Add a button that calls `useIgnitionStore.getState().start()`.

- [ ] **Step 2: Handle Ignition Node type in Scene**

Modify the node rendering logic to support a new `ignition` node type and trigger the store on click.

- [ ] **Step 3: Commit**

```bash
git commit -am "feat: ignition entry points"
```

---

### Task 5: Final Handoff - Camera Flight

- [ ] **Step 1: Implement handoff logic in `useIgnitionStore`**

When `durationRemaining` reaches 0, trigger the existing camera flight system to the `targetNodeId`.

- [ ] **Step 2: Commit**

```bash
git commit -am "feat: ignition to flow handoff"
```
