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

- [x] **Step 1: Define types and initial state**
- [x] **Step 2: Create a simple state hook (or use existing store pattern)**
- [x] **Step 3: Write test for state transitions**
- [x] **Step 4: Run tests**
- [x] **Step 5: Commit**

---

### Task 2: Visual Integration - `useIgnitionScene` Hook

**Files:**
- Create: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/useIgnitionScene.ts`
- Modify: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ProtocolScene.tsx`

- [x] **Step 1: Create hook to map state to scene uniforms**
- [x] **Step 2: Integrate hook into ProtocolScene**
- [x] **Step 3: Commit**

---

### Task 3: UI Overlay - `IgnitionOverlay.tsx`

**Files:**
- Create: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/IgnitionOverlay.tsx`
- Modify: `apps/immersive/momentum-3d/src/app/protocol-builder/page.tsx`

- [x] **Step 1: Implement the overlay with countdown and prompts**
- [x] **Step 2: Add to Page**
- [x] **Step 3: Commit**

---

### Task 4: Dual-Entry Triggers (Sidebar + Node)

**Files:**
- Modify: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ArchitectSidebar.tsx`
- Modify: `apps/immersive/momentum-3d/src/components/ProtocolBuilder/ProtocolScene.tsx` (Node click handler)

- [x] **Step 1: Add "Quick Ignition" to Sidebar**
- [x] **Step 2: Handle Ignition Node type in Scene**
- [x] **Step 3: Commit**

---

### Task 5: Final Handoff - Camera Flight

- [x] **Step 1: Implement handoff logic in `useIgnitionStore`**
- [x] **Step 2: Commit**

---

### Task 6: Post-Implementation Refinements (Bug Fixes & UI)

- [x] **Step 1: Fix Navigation Bounce**
    - Ensure `stopIgnitionState()` is called immediately after handoff in `page.tsx`.
    - Add cleanup for `advanceTimeout` in the timer's `useEffect` to prevent ghost navigation.
- [x] **Step 2: Refine Timer UI**
    - Disable countdown button immediately when `timeLeft === 0`.
    - Change label to "Resume Timer" when paused mid-session.
- [x] **Step 3: Final Node Logic**
    - Disable "Next Step" button on the final node to ensure the protocol ends correctly.
    - Implement automatic transition to the "Protocol Complete" overlay when the final task finishes.
