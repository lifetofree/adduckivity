# Spec: Dynamic 3D Engine Optimization

**Date:** 2026-05-06  
**Status:** Draft  
**Target:** Phase 2.5 (Technical Performance)

## 1. Objective
Reduce the initial JS payload and improve Perceived Performance (LCP) by decoupling the Three.js engine from the critical rendering path.

## 2. Problem Statement
Currently, all pages using 3D scenes (`/momentum`, `/atomizer`, `/protocol-builder`) import the 3D components synchronously. This forces the browser to download, parse, and execute the heavy Three.js bundle (~600kb+) before the first paint of the UI content, causing a "monolithic" load delay.

## 3. Proposed Solution
Implement **Dynamic Route Splitting** using `next/dynamic`.

### 3.1. Implementation Strategy
Wrap 3D scene components in `dynamic(() => import(...), { ssr: false })`. This ensures:
- The 3D engine is only loaded on the client.
- The 3D code is split into a separate chunk, reducing the size of the main entry bundle.
- The UI (text, buttons, navigation) renders immediately without waiting for the 3D assets.

### 3.2. Targets
| Page | Component |
|---|---|
| `/momentum` | `FlywheelScene` |
| `/atomizer` | `AtomizerScene` |
| `/protocol-builder` | `ProtocolScene` |

### 3.3. Loading State: "System Progress Bar"
While the 3D component is loading, a progress bar will be displayed:
- **Style**: 2px height, Cyan (`#00E5FF`), positioned at the top of the 3D container.
- **Animation**: Subtle horizontal pulse or indefinite progress.
- **Aesthetic**: Matches the Duck OS minimal/tech style.

## 4. Technical Details

### 4.1. Loading Component
Create a reusable `SceneLoader` component in `src/components/shared/SceneLoader.tsx`:
```tsx
export function SceneLoader() {
  return (
    <div className="absolute top-0 left-0 w-full h-1 z-50 overflow-hidden bg-black/20">
      <div className="h-full bg-cyan-500 animate-progress-indefinite shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
    </div>
  );
}
```

### 4.2. Page Updates
Example update for `/momentum/page.tsx`:
```tsx
import dynamic from 'next/dynamic';
import { SceneLoader } from '@/components/shared/SceneLoader';

const FlywheelScene = dynamic(() => import('@/components/FlywheelScene'), {
  ssr: false,
  loading: () => <SceneLoader />
});
```

## 5. Success Criteria
- [ ] Initial bundle size reduced for the main entry point.
- [ ] First Contentful Paint (FCP) improved on targeted pages.
- [ ] No layout shift when 3D scene mounts.
- [ ] 3D scenes function identically after loading.

## 6. Risks & Mitigations
- **Pop-in Effect**: Mitigated by the progress bar providing visual feedback that the "System" is initializing.
- **Hydration Mismatch**: Avoided by using `{ ssr: false }`.
