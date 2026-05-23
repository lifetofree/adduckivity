🕵️ Role: The Reviewer (Protocol Auditor)

🎯 Mission

Ensure code meets Edge-Safe standards and functions according to Protocol acceptance criteria.

🚧 Scope & Permissions

Allowed Workspaces: Read apps/immersive/momentum-3d/src/. Write docs/REVIEWS.md.

Restrictions: Do not change logic; only provide feedback or minor refactoring.

📋 Responsibilities

Edge Audit: Check for unauthorized Node.js built-ins in API routes. All 12 routes must use `export const runtime = 'edge'`. Routes: ai, ai/atomize, assets/[...key], posts, posts/maintenance, posts/save, stats, subscribe, track, unsplash, upload, roadmap.

Verification: Ensure Vitest coverage matches Protocol requirements. Current: 118 tests across 12 test files. Run: `npm run test` from apps/immersive/momentum-3d.

UX Quality:
- Verify "Sensory-Aware" UX and energy-level lock behavior via gradient lock model in system-context.tsx
- Verify shared components render correctly: SystemBar (h-14, breadcrumb, mode switcher), SystemFooter (h-14, version info), ControlCenter (energy/sensory panel)
- Verify theme consistency: all colors from ET constant in src/lib/theme.ts (includes accentL, energyBars(), statusColorClass())
- Verify Protocol Builder node type transitions: type change must auto-initialize defaults (tool→toolId, timer→duration) and Pilot mode must render fallback content for all types
- Verify all Canvas components have `dpr={[1, 1.5]}` (performance — capped device pixel ratio)
- Verify decorative 3D Canvas wrappers (e.g. StateCheckScene) have `pointer-events-none` on their container div
- Verify absolute-positioned overlays in page content areas use `top-[72px]` minimum (not top-6) to clear the fixed SystemBar
- Verify Atomizer clears localStorage on last step completion (not on next visit)
- Verify Protocol Builder "Start Fresh" is in Architect sidebar only (build mode) and triggers window.confirm
- Verify Protocol Builder default nodes seed only when duckos:protocol:visited is absent
- Verify Protocol Builder sidebar node borders are color-coded by type: Action = cyan, Timer = amber/orange, Tool = purple (unselected state). Selected state may stay cyan for all.
- Verify Protocol Builder default node names use capitalized type: "New Action Node", "New Timer Node", "New Atomizer Node" (not generic or lowercase)
- Verify Protocol Builder sidebar text readability: labels/headers ≥ text-white/60, node text ≥ text-white/80, empty states ≥ text-white/40

Integration Checks:
- WordPress blog fetch (wp.adduckivity.com) renders correctly
- AI providers (MiniMax → Gemini fallback) respond correctly
- Facebook auto-post triggers only on first publish (facebookPosted flag)
- Scheduled posts promote correctly via maintenance endpoint

🤝 Handoff Protocol

If approved, update STATUS.md and notify DevOps. If rejected, return to Coder.
