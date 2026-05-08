# Design Spec: 3D Interactive Roadmap (The Blueprint)

**Date:** 2026-05-07
**Status:** Draft
**Route:** `/os` (Integration)
**Vision:** An "Unfolding Blueprint" node in the 3D Launchpad that visualizes the project's ROADMAP.md and implementation plans. It provides a tactile, immersive way to track progress, allowing the user to "click to close" tasks in 3D, which then synchronizes back to the project's Markdown files.

---

## 1. Objective
Bridge the gap between "Project Management" and "Project Execution" by making the roadmap part of the immersive OS. Provide a "Live Sync" mechanism between 3D interactions and local `.md` files.

## 2. Core Metaphor: The Unfolding Blueprint
The roadmap is represented as a complex geometric node that lives alongside the tools in the `/os` Launchpad.

- **The Node:** A high-complexity **Dodecahedron** or **Icosahedron** node with a "Blueprint" wireframe texture.
- **The Expansion:** Clicking the node triggers an "Explosion" animation where it expands into a tiered 3D web.
    - **Tier 1 (Phases):** Nodes representing major project phases (Foundation, Optimization, Biological, Revenue).
    - **Tier 2 (Tasks):** Smaller child nodes representing individual tasks parsed from Markdown lists (`[ ]`, `[x]`).
- **The State:** 
    - **Red/Dim:** Task is pending (`[ ]`).
    - **Cyan/Glow:** Task is completed (`[x]`).

---

## 3. Interaction Design

### 3.1. Parsing & Visualization
1. The `/os` page calls a new API route `/api/roadmap` to fetch the parsed contents of `ROADMAP.md` and files in `docs/superpowers/plans/`.
2. The 3D scene generates a node hierarchy based on this data.

### 3.2. "Click to Close" (The Sync)
1. User clicks a "Pending" task node in the 3D sub-web.
2. The node turns Cyan immediately (optimistic UI).
3. A `POST` request is sent to `/api/roadmap/update` with the file path and task line number/text.
4. The server-side API finds the line in the `.md` file and replaces `[ ]` with `[x]`.
5. A "System Log" notification appears in the 3D HUD: `TASK STABILIZED: [Task Name]`.

---

## 4. Technical Architecture

### 4.1. Components
- **`RoadmapNode.tsx`:** The main interactive node in the `/os` constellation.
- **`RoadmapWeb.tsx`:** The expanded 3D sub-graph of phases and tasks.
- **`RoadmapAPI`:** Server-side logic to parse and manipulate Markdown files using regex.

### 4.2. State Integration
- Data is fetched via React Query or a simple `useEffect` in the launchpad.
- Sync logic uses a dedicated API route that has write-access to the local filesystem (enabled in dev mode).

---

## 5. Success Criteria
- [ ] Roadmap Node correctly visualizes Phases from `ROADMAP.md`.
- [ ] Clicking a task node in 3D updates the corresponding line in the local `.md` file.
- [ ] 3D state remains in sync with the file system on page refresh.
- [ ] Expanding/collapsing the roadmap feels fluid and immersive.

---

## 6. Risks & Mitigations
- **Markdown Parsing Complexity:** Use a simple but robust regex-based parser for bulleted lists.
- **Write Access:** Ensure the API only allows modifications to a strict allowlist of `.md` files to prevent security risks.
