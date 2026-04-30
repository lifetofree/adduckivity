# Design Spec: The Atomizer (Task-Breaking Utility)

**Date:** 2026-04-30  
**Status:** Approved  
**Route:** `/atomizer`  
**Vision:** A Duck OS utility that lowers activation energy for "scary" tasks using AI-driven atomic decomposition and immersive 3D feedback.

---

## 1. Core Logic (The 3 Laws)
- **Law 1 (System > Emotion):** Clinical, systematic breakdown of tasks to bypass anxiety. Minimalist UI to lower cognitive load.
- **Law 2 (Action Precedes Motivation):** AI focuses on "Deep Slicing"—generating the first actions so small they require zero motivation.
- **Law 3 (Protect the System):** Uses a "Focus Window" (3 steps visible) and mandatory "Energy Checks" every 6 steps.

---

## 2. Technical Architecture

### 2.1 AI Integration (`/api/ai/atomize`)
- **Model:** Gemini 2.0 Flash.
- **Input:** `task: string`, `energyLevel: number (1-10)`.
- **System Prompt:** 
    - Act as a "Task Atomizer." 
    - Break the input into 12-15 steps.
    - **Rule:** Every step MUST be executable in under 2 minutes.
    - **Strategy:** "Deep Slice"—don't worry about finishing the whole project; focus on the immediate physical actions required to break inertia.
- **Output:** JSON array of strings.

### 2.2 Frontend Components
- **`AtomizerPage` (`/atomizer`):** Main entry point.
- **`AtomicList`:** Handles the "Focus Window" logic.
    - Only Step 1 is active.
    - Steps 2-3 are visible but dim.
    - Steps 4+ are blurred/hidden.
- **`AtomizerScene` (3D):** 
    - A "Task Orb" (torus or sphere with wireframe) that shatters into particles when the task is atomized.
    - Individual particles "implode" when a step is completed.

### 2.3 Data & Persistence
- **Storage:** `localStorage` (key: `duckos:atomizer:active_task`).
- **Schema:**
  ```typescript
  {
    originalTask: string;
    steps: { text: string; completed: boolean }[];
    energyCheckCount: number;
    createdAt: string;
  }
  ```

---

## 3. User Experience Flow

1. **Input:** User types "Scary Task" into a centered, minimalist input.
2. **Atomization:** Pressing Enter triggers the AI. The 3D "Task Orb" shatters.
3. **Focus:** The "Focus Window" appears. 
4. **Action:** User performs Step 1. They click the step to complete it.
5. **Reward:** Step 1 shatters in 3D. Step 2 slides into the "Active" slot. Step 4 unblurs into the "Horizon" slot.
6. **Maintenance:** After 6 steps, the UI blocks with an "Energy Check" overlay (Law 3).

---

## 4. Error Handling
- **AI Failure:** Fallback to a set of "Universal Inertia Breakers" (e.g., "Drink water," "Stand up," "Open a blank document").
- **Task Too Vague:** AI identifies the vagueness and makes the first step "Spend 1 minute defining what 'X' actually means."

---

## 5. Success Criteria
- [ ] User can input a task and get a list of <2min steps.
- [ ] Only 3 steps are visible at any time.
- [ ] 3D particles react to step completion.
- [ ] Progress is saved across browser refreshes.
