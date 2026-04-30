# Design Spec: 3D Protocol Builder (The Constellation)

**Date:** 2026-04-30  
**Status:** 🏗️ **DESIGN PHASE**  
**Route:** `/protocol-builder`  
**Vision:** A Duck OS "architect" utility where users visualize and build their momentum systems as 3D constellations, turning abstract planning into a physical structural experience.

---

## 1. Core Concept: The Constellation
Instead of flat checklists, protocols are represented as a **3D Galaxy** of interconnected nodes.
- **System > Emotion:** By mapping tasks in 3D space, the user sees the "structure" of their day, reducing the emotional weight of individual tasks.
- **Physical Momentum:** Navigation through the system (Build vs. Flow) mimics physical movement, creating a psychological "push" forward.

---

## 2. Technical Architecture

### 2.1 3D Environment (React Three Fiber)
- **The Void:** A dark, minimalist 3D space with subtle grid lines or "stellar dust" for orientation.
- **Node Geometry:**
    - **Cores:** Large spheres (Pulsing).
    - **Action Nodes:** Medium spheres (Static).
    - **Tool/Timer Nodes:** Octahedrons or specialized shapes.
- **Edge Geometry:** Tubes or lines connecting nodes, with "momentum pulses" (moving light particles) traveling along active paths.

### 2.2 Functional Modes
1. **Build Mode (Architect):**
    - Drag-and-drop nodes in 3D space.
    - Click to "link" nodes together.
    - **System Inspector:** A side-panel for editing node metadata (Name, duration, tool triggers).
2. **Flow Mode (Pilot):**
    - **The Camera:** Locked first-person view.
    - **Transitions:** Smooth "flight" camera interpolations between nodes upon completion.
    - **Focus Window:** Only the current node and its immediate neighbors are fully illuminated; the rest of the constellation dims.

### 2.3 Data Structure
```typescript
interface ProtocolNode {
  id: string;
  type: 'action' | 'tool' | 'timer';
  label: string;
  position: [number, number, number];
  data: {
    duration?: number;
    toolId?: 'atomizer' | 'emergency';
    content?: string;
  };
}

interface ProtocolEdge {
  id: string;
  source: string;
  target: string;
}

interface ProtocolGraph {
  nodes: ProtocolNode[];
  edges: ProtocolEdge[];
}
```

---

## 3. Tool Integration (The "Duck OS" Ecosystem)
The builder is not an island; it is the "Command Center" for existing tools.
- **Atomizer Node:** Triggers the `/api/ai/atomize` logic. When activated, the node "shatters" (using existing particle logic) into sub-nodes.
- **Emergency Node:** Triggers the `EmergencyProtocol` component as a full-screen overlay.
- **Anchor Node:** Triggers the Spotify playlist or ambient soundscapes.

---

## 4. User Experience Flow
1. **Initialize:** User starts in a blank void with a single "Seed" node.
2. **Architect:** They add branches, creating "Recovery" paths and "High-Bandwidth" paths.
3. **Stabilize:** A force-directed algorithm snaps the nodes into a balanced 3D structure.
4. **Execute:** User enters "Flow Mode." The camera zooms into Node 1. 
5. **Propagate:** As tasks are completed, the camera "flies" to the next node, building visual momentum.

---

## 5. Success Criteria
- [ ] Render a 3D canvas with at least 5 interconnected nodes.
- [ ] Smooth camera transitions between "Build" and "Flow" modes.
- [ ] Ability to save/load protocol graphs from `localStorage`.
- [ ] Functional "Tool Node" that can trigger the Atomizer.
- [ ] 100% adherence to the "Duck OS" minimalist/cybernetic aesthetic.

---

**Proposed Implementation Strategy:**
1.  **Phase 1:** Basic 3D Scene + Node Rendering.
2.  **Phase 2:** Node Connection Logic & Editor Panel.
3.  **Phase 3:** Camera "Flight" System (Flow Mode).
4.  **Phase 4:** Integration with Atomizer & Emergency Protocol.
