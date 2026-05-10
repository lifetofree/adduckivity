# Dynamic 3D Engine Optimization Implementation Plan [COMPLETED]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve initial page load performance by lazy-loading heavy 3D components and showing a minimal progress bar during initialization.

**Architecture:** Use `next/dynamic` with `ssr: false` for all 3D scenes. Implement a shared `SceneLoader` with a CSS-based progress bar.

**Tech Stack:** Next.js 16, Tailwind CSS 4, Three.js

---

### Task 1: Initialize Global Loading Animations

**Files:**
- Modify: `apps/immersive/momentum-3d/src/app/globals.css`

- [ ] **Step 1: Add progress bar animation to CSS**

Add this to the end of `apps/immersive/momentum-3d/src/app/globals.css`:
```css
@keyframes progress-indefinite {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}

.animate-progress-indefinite {
  animation: progress-indefinite 2s infinite ease-in-out;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/immersive/momentum-3d/src/app/globals.css
git commit -m "style: add global progress-indefinite animation"
```

---

### Task 2: Create Shared SceneLoader Component

**Files:**
- Create: `apps/immersive/momentum-3d/src/components/shared/SceneLoader.tsx`

- [ ] **Step 1: Write the SceneLoader component**

```tsx
'use client'

export function SceneLoader() {
  return (
    <div className="absolute top-0 left-0 w-full h-1 z-50 overflow-hidden bg-black/20">
      <div className="h-full bg-[#00E5FF] animate-progress-indefinite shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/immersive/momentum-3d/src/components/shared/SceneLoader.tsx
git commit -m "feat: add SceneLoader component with progress bar"
```

---

### Task 3: Optimize Momentum Page

**Files:**
- Modify: `apps/immersive/momentum-3d/src/app/momentum/page.tsx`

- [ ] **Step 1: Update FlywheelScene import to use dynamic**

```tsx
import dynamic from 'next/dynamic'
import { SceneLoader } from '@/components/shared/SceneLoader'

const FlywheelScene = dynamic(() => import('@/components/FlywheelScene'), {
  ssr: false,
  loading: () => <SceneLoader />
})
```

- [ ] **Step 2: Verify build**

Run: `npm run typecheck` in `apps/immersive/momentum-3d/`

- [ ] **Step 3: Commit**

```bash
git add apps/immersive/momentum-3d/src/app/momentum/page.tsx
git commit -m "perf: use dynamic import for FlywheelScene"
```

---

### Task 4: Optimize Atomizer Page

**Files:**
- Modify: `apps/immersive/momentum-3d/src/app/atomizer/page.tsx`

- [ ] **Step 1: Update AtomizerScene import to use dynamic**

```tsx
import dynamic from 'next/dynamic';
import { SceneLoader } from '@/components/shared/SceneLoader';

const AtomizerScene = dynamic(() => import('@/components/AtomizerScene'), {
  ssr: false,
  loading: () => <SceneLoader />
});
```

- [ ] **Step 2: Verify build**

Run: `npm run typecheck` in `apps/immersive/momentum-3d/`

- [ ] **Step 3: Commit**

```bash
git add apps/immersive/momentum-3d/src/app/atomizer/page.tsx
git commit -m "perf: use dynamic import for AtomizerScene"
```

---

### Task 5: Optimize Protocol Builder Page

**Files:**
- Modify: `apps/immersive/momentum-3d/src/app/protocol-builder/page.tsx`

- [ ] **Step 1: Update ProtocolScene import to use dynamic**

```tsx
import dynamic from 'next/dynamic'
import { SceneLoader } from '@/components/shared/SceneLoader'

const ProtocolScene = dynamic(() => import('@/components/ProtocolBuilder/ProtocolScene'), {
  ssr: false,
  loading: () => <SceneLoader />
})
```

- [ ] **Step 2: Verify build and tests**

Run: `npm run typecheck && npm run test` in `apps/immersive/momentum-3d/`

- [ ] **Step 3: Commit**

```bash
git add apps/immersive/momentum-3d/src/app/protocol-builder/page.tsx
git commit -m "perf: use dynamic import for ProtocolScene"
```
