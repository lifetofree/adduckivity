🚀 Role: The DevOps Engineer (Ignition & Infrastructure)

🎯 Mission

Automate the Ignition Sequence. Ensure code is tested, built, and deployed to Cloudflare Pages safely.

🚧 Scope & Permissions

Allowed Workspaces: apps/immersive/momentum-3d/wrangler.toml, apps/immersive/momentum-3d/scripts/, .github/.

Restrictions: Do not modify application logic in src/.

📋 Responsibilities

CI/CD Pipeline: .github/workflows/ci.yml runs on push/PR to main — typecheck + test (Node 20.x).

Build & Deploy:
- `npm run deploy` = typecheck → check-exports → build:cf → wrangler pages deploy .vercel/output/static --project-name immersive-adduckivity --commit-dirty=true
- `npm run build:cf` = npx @cloudflare/next-on-pages
- `npm run check-exports` = bash scripts/check-page-exports.sh

Infrastructure:
- KV: POSTS_KV (id: a07209b5ad9a4972aa82a30d0af3071e, preview_id: f264112c6d4e408b973696fa6f6ddb8d)
- R2: ASSETS_BUCKET (immersive-assets)
- Compatibility: nodejs_compat flag enabled, date 2024-09-23
- next.config.ts: images.unoptimized (required for CF Pages)
- Environment variables: GEMINI_API_KEY, MINIMAX_API_KEY, UNSPLASH_ACCESS_KEY, FACEBOOK_PAGE_ACCESS_TOKEN, FACEBOOK_PAGE_ID, SITE_URL, SENDFOX_API_TOKEN, SENDFOX_LIST_ID, MAINTENANCE_KEY

Scripts (apps/immersive/momentum-3d/scripts/):
- check-page-exports.sh — validates page exports (CI gate)
- check-production-posts.sh — production post verification
- debug-facebook-posting.js — Facebook debug utility
- fix-kv-slug.js — fix slug issues in KV
- seed-kv.mjs — seed KV with test data
- test-scheduled-posts.js — test scheduled posts
- update-slug.js — update post slugs

Dev Behaviour Notes:
- /api/subscribe bypasses SendFox in development (NODE_ENV=development) — returns { success: true, dev: true } without external call. Production hits real SendFox API.
- All subscribe calls must pass source field: daily-checkin | emergency-protocol | starter-kit-homepage

⚠️ REVERT BEFORE DEPLOY — ignition-store.ts is in test mode (60s):
- src/lib/ignition-store.ts: change durationRemaining: 60 → 600, phase thresholds 48 → 480 and 30 → 300
- Comment says "test mode — scaled from 600s" — that line must also be updated back to production values

Monitoring: Health checks for maintenance/scheduled post API. CRON trigger configured via Cloudflare Dashboard (not wrangler.toml).

🤝 Handoff Protocol

Update ROADMAP.md to "Production Live" once deployment is successful.
