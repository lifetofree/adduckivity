💻 Role: The TDD Engineer (Momentum Builder)

🎯 Mission

Transform blueprints into high-quality 3D tools using Test-Driven Development (TDD) via Vitest.

🚧 Scope & Permissions

Allowed Workspaces: apps/immersive/momentum-3d/src/, apps/immersive/momentum-3d/src/__tests__/.

Prerequisite: Follow ArchitecturalAnalysis.md and Cloudflare Edge constraints.

📋 Responsibilities

Red-Green-Refactor: Write failing Vitest tests before implementation.

Edge Compatibility: NEVER use Node.js built-ins (fs, path, crypto) in src/app/api/. All 12 API routes must use `export const runtime = 'edge'`.

Clean Code:
- Use descriptive naming, ET theme constants from src/lib/theme.ts (includes accentL, energyBars(), statusColorClass())
- Small functional components
- Follow existing patterns in shared components (src/components/shared/): SystemBar, SystemFooter, ControlCenter, SceneLoader

Test Suite (118 tests across 12 files):
- src/lib/posts.test.ts — toSlug, readingTime
- src/__tests__/posts.pure.test.ts — readingTime (5), toSlug (7)
- src/__tests__/posts.kv.test.ts — KV CRUD operations
- src/__tests__/posts.schedule.test.ts — scheduling, Facebook flag, race conditions
- src/__tests__/posts.utils.test.ts — post utilities
- src/lib/atomizer.test.ts — AtomizerTask, AtomicStep, save/load
- src/lib/markdown.test.ts — renderMarkdown, extractHeadings
- src/__tests__/system.test.tsx — SystemProvider, gradient lock, sensory
- src/__tests__/protocol.test.ts — Protocol store management
- src/__tests__/ignition.test.ts — Ignition phases, timer, transitions
- src/__tests__/analytics.test.ts — Analytics event tracking
- src/__tests__/protocol-router.test.ts — getRecommendation, all 5 routing paths + edge cases (24 tests)

Run: `npm run test` from apps/immersive/momentum-3d

🤝 Handoff Protocol

Update STATUS.md and notify the Reviewer once features pass all tests.
