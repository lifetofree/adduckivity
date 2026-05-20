# System Spec: The Atomizer

**Last updated:** 2026-05-15  
**Files:** `src/lib/atomizer.ts`, `src/app/atomizer/page.tsx`, `src/components/AtomizerList.tsx`, `src/components/AtomizerScene.tsx`

---

## Tech Spec

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js 16.2 App Router (Edge Runtime) |
| AI | MiniMax `abab6.5s-chat` (primary), Gemini `gemini-1.5-flash` (fallback) |
| 3D | Three.js 0.184, React Three Fiber 9.6, Drei 10.7 |
| Persistence | localStorage (`duckos:atomizer:active_task`) |
| Animation | Framer Motion 12 |

---

## Purpose

AI-powered task decomposition tool. Breaks any "scary task" into 12–15 atomic steps (≤2 min each), surfaced 3 at a time to prevent overwhelm. Built around the "Focus Window" principle.

---

## UI Flow

1. **Hero:** "What's the scary task?" with underline-only full-width input
2. **Atomize:** Submit to `/api/ai/atomize` → AI returns atomic steps
3. **Focus Window:** Only 3 steps visible at once (Law 3)
4. **Step Completion:** Tap "Done" → next step slides in; particle effect fires
5. **Energy Check:** Every 6 completed steps → mandatory interrupt
6. **Completion:** All steps done → auto-return to Protocol Builder if launched via `?returnTo=`

---

## AI Integration

- **Primary:** MiniMax `abab6.5s-chat`
- **Fallback:** Google Gemini `gemini-1.5-flash`
- **Endpoint:** `/api/ai/atomize`
- **Prompt:** "Break this task into 12-15 atomic steps, each taking ≤2 minutes"

---

## Persistence

| Key | Storage | Purpose |
|---|---|---|
| `duckos:atomizer:active_task` | localStorage | Active task + steps across sessions |

Task is **cleared from localStorage immediately on last step completion** — returning visits always show a fresh input. No reset button needed. On page load, if all steps are already completed, does not restore stale state.

---

## Features

| Feature | Implementation |
|---|---|
| 3D particle orb background | Three.js PointMaterial (3000 particles, r≈2.2, additive blending) |
| Shatter effect | Particles expand on atomize and step completion |
| Auto-clear on completion | Task cleared from localStorage after all steps done |
| Return redirect | `?returnTo=/protocol-builder` → auto-redirect on completion |

---

## AtomizerTask Interface

```typescript
interface AtomizerTask {
  id: string
  originalTask: string
  createdAt: string
  steps: AtomicStep[]
}

interface AtomicStep {
  id: string
  text: string
  completed: boolean
  completedAt?: string
}
```

---

## Key Files

- `src/lib/atomizer.ts` — Task interface, localStorage persistence
- `src/app/atomizer/page.tsx` — Main page logic
- `src/components/AtomizerList.tsx` — Step list with focus window
- `src/components/AtomizerScene.tsx` — 3D particle orb background
