# Design Spec: Momentum Ignition (The 600s Quick Launch)

**Date:** 2026-05-02  
**Status:** 🏗️ **DESIGN PHASE**  
**Route:** `/protocol-builder` (Integration)  
**Vision:** A high-impact "Power Up" for the 3D Protocol Builder that automates the transition from stagnation to execution. Based on the "Morning Kickstart" protocol, it guides the user through 600 seconds of momentum-building activities using immersive 3D visuals and audio cues.

---

## 1. Core Concept: Momentum Ignition
The "Momentum Ignition" is a specialized protocol sequence designed to "jumpstart" the user's system. It acts as the "ignition key" for the broader Protocol Constellation.

- **Objective:** Break inertia and establish a "Flow" state in exactly 10 minutes.
- **Atmosphere:** High-energy, cybernetic, focusing on "system activation."
- **Trigger:** Dual-entry system:
    1. **Ignition Node:** A physical node placed within the 3D Constellation to architect momentum starts.
    2. **Quick Ignition Sidebar:** A global action in the `ArchitectSidebar` for immediate activation regardless of current node focus.

---

## 2. The 600-Second Sequence

### 2.1 Phase 1: Physical Activation (120s) - "The Spark"
- **Purpose:** Ignite the nervous system through movement.
- **3D Visuals:** 
    - The scene pulses with high-frequency "Energy Waves" emanating from the center.
    - Particle density increases.
    - Camera shakes slightly in sync with the "pulses."
- **UI Overlay:** Large, bold countdown timer. Prompts like "MOVE NOW," "JUMPING JACKS," or "STRETCH."
- **Audio:** High-tempo, rhythmic electronic beats.

### 2.2 Phase 2: Mental Alignment (180s) - "The Target"
- **Purpose:** Align focus with the day's primary objectives.
- **3D Visuals:**
    - The camera begins a slow, sweeping orbit around the user's "Core" goal nodes.
    - Lighting shifts from high-energy red/orange to a calm, focused blue/cyan.
    - Background grid stabilizes and dims.
- **UI Overlay:** Displays the labels of the high-impact goals defined in the constellation.
- **Audio:** Atmospheric, deep synth pads.

### 2.3 Phase 3: Deep Work Ignition (300s) - "The Launch"
- **Purpose:** Final bridge to the first task.
- **3D Visuals:**
    - The camera locks into a "Pilot" (First-Person) view, aimed directly at the first task node.
    - A "Tunnel Effect" (starfield lines) begins to form, creating a sense of forward motion.
    - The target node starts to glow intensely.
- **UI Overlay:** Task-specific instructions. Final 10-second "Launch" countdown.
- **Audio:** Accelerating pulse, building tension that releases at the end.

---

## 3. Technical Architecture

### 3.1 Components
- **`MomentumIgnition.tsx`:** The main controller component that manages the 10-minute state machine.
- **`IgnitionOverlay.tsx`:** Handles the phase-specific text prompts and timers.
- **`IgnitionSceneManager.ts`:** A hook or utility to update `ProtocolScene` uniforms (lighting, particles, camera) based on the ignition state.

### 3.2 State Management
```typescript
type IgnitionPhase = 'spark' | 'target' | 'launch' | 'idle';

interface IgnitionState {
  currentPhase: IgnitionPhase;
  startTime: number;
  durationRemaining: number;
  targetNodeId: string; // The first node to "fly" to after ignition
}
```

---

## 4. User Experience Flow
1. **Initiate:** User clicks "Ignite Momentum" on the sidebar or selects an Ignition Node.
2. **Transition:** The standard "Architect" UI fades out; the "Ignition Overlay" takes over.
3. **Execute:** The 10-minute guided session runs.
4. **Handoff:** Upon completion (T-0), the camera performs a high-speed "Flight" transition directly into the first action node of the active protocol.
5. **Flow:** User is now in "Flow Mode" (Pilot view) on their first real task.

---

## 5. Success Criteria
- [ ] Implement a state machine that transitions through the 3 phases.
- [ ] Integration with `ProtocolScene` to change colors/ambient lighting per phase.
- [ ] Large, legible countdown timer overlay.
- [ ] Successful "Flight" transition at the end of the 600 seconds.
- [ ] Mobile-responsive UI for the timer/prompts.

---

**Proposed Implementation Strategy:**
1.  **Phase 1:** Build the `MomentumIgnition` state machine and timer overlay.
2.  **Phase 2:** Connect phase states to `ProtocolScene` visual parameters.
3.  **Phase 3:** Implement audio triggers (using Web Audio API or simple HTML5 audio).
4.  **Phase 4:** Create the final "Launch" handoff to the first task node.
