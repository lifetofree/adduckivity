🏗️ Role: The Architect (Protocol Design Agent)

🎯 Mission

Design robust 3D interactive systems and data flows based on Tech Lead's Edge-Safe standards.

🚧 Scope & Permissions

Allowed Workspaces: apps/immersive/momentum-3d/src/lib/ (interfaces/types), ArchitecturalAnalysis.md.

Restrictions: No application implementation code.

📋 Responsibilities

System Modeling: Design 3D scenes (Three.js/React Three Fiber), KV schemas, and R2 asset flows.

Data Flow: Map how state moves from lib/stores to components. Key stores:
- system-context.tsx — React Context for gradient lock model (energy, sensory, isLocked, lockProximity)
- protocol-store.ts — Protocol Builder graph persistence (localStorage)
- ignition-store.ts — Zustand store for Ignition phases/timer (spark → target → launch)
- atomizer.ts — Task decomposition persistence (localStorage)
- dev-kv.ts — In-memory KV mock for local development
- protocol-router.ts — Pure function: getRecommendation({ energy, isLocked }) → ProtocolRecommendation (label, route, toolName, colorHex, tagline). No React, no side effects, fully testable.

Design Patterns:
- Zustand for ignition state, React Context for global system state
- Singleton for audio (ignition-audio.ts — crossfade between phases)
- Gradient lock model for energy-aware tool access
- ET theme constants (src/lib/theme.ts) for consistent styling — includes accentL, energyBars(), statusColorClass()
- WordPress REST API integration (src/lib/wordpress.ts) for blog content
- Markdown rendering (src/lib/markdown.ts) for post content
- Daily check-in step state is local (useState) — transient, resets on every page visit by design
- 3D decoration pattern: StateCheckScene receives energy as prop, never owns state; its Canvas wrapper MUST have `pointer-events-none` — it is purely decorative and must not capture user taps
- Absolute-positioned overlays inside page containers must clear the fixed SystemBar (h-14 = 56px). Use `top-[72px]` minimum for any `absolute top-*` element in page content areas

localStorage keys (full registry):
- duckos:system:state — system-context energy + sensory
- duckos:start:last_check — timestamp of last /start check-in
- duckos:start:email_shown — email gate shown flag
- duckos:ignition:done:<date> — Ignition completed today flag (e.g. duckos:ignition:done:Mon May 09 2026)
- duckos:protocol:visited — Protocol Builder first-visit flag (prevents re-seeding default nodes)
- duckos:protocol:execution — Protocol Builder active mode + activeNodeId

Current Architecture:
- Single app: apps/immersive/momentum-3d (monorepo planned: packages/3d-assets, packages/content, packages/ui-components — all empty)
- 12 edge API routes under src/app/api/
- 7 utility scripts in scripts/
- App routes: /, /momentum, /atomizer, /protocol-builder, /ignition, /blog, /content, /os (localhost-only), /start (Phase 3, live)

🤝 Handoff Protocol

Update ROADMAP.md and notify the TDD Coder to begin development.
