# Duck OS - Adduckivity Monorepo

**Life Architecture for Neurodivergent Creators**

Built with systems thinking, not willpower.

## Architecture

This is a **monorepo** containing all Adduckivity applications and shared packages.

```
adduckivity/
├── apps/
│   └── immersive/
│       └── momentum-3d/    # → immersive.adduckivity.com (3D content studio)
├── docs/                   # Project documentation and specs
├── AGENTS.md               # Project specifications and tech stack
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

## Quick Start

### Development
```bash
npm install
cd apps/immersive/momentum-3d
npm run dev                # http://localhost:3000
```

### Build & Deploy
```bash
npm run test               # 94 tests across 11 files
npm run build
npm run deploy             # typecheck + build + deploy to Cloudflare Pages
```

## Deployment

**Production:** https://immersive.adduckivity.com  
**Platform:** Cloudflare Pages with Edge Functions  
**Branch:** `main` → auto-deploys on commit

### Cloudflare Pages Setup
1. Connect GitHub repository
2. Build directory: `apps/immersive/momentum-3d`
3. Build command: `npm run build`
4. Output directory: `.vercel/output/static` (next-on-pages)
5. Environment variables: See `DEPLOYMENT.md`

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.4 (App Router, Turbopack) |
| **UI** | React 19, TypeScript 5 |
| **3D** | Three.js 0.184, React Three Fiber 9.6, Drei 10.7, Postprocessing 3.0 |
| **Styling** | Tailwind CSS 4, Framer Motion 12 |
| **Testing** | Vitest 4.1 + jsdom 29 + Testing Library (94 tests, 11 files) |
| **Blog** | WordPress REST API (wp.adduckivity.com) |
| **AI** | MiniMax abab6.5s-chat (primary) + Gemini 1.5 Flash (fallback) |
| **Storage** | Cloudflare KV + R2 |
| **Deployment** | Cloudflare Pages (edge runtime) |

## Philosophy

**Duck OS Core Principles:**
- **System > Emotion** — Build systems that run regardless of how you feel
- **Action Precedes Motivation** — Start, then momentum follows
- **Protect the System** — Don't push past limit; if the system breaks, everything breaks

**Interactive Protocols:**
- **Momentum (ACT-04)**: Visualized 3D flywheel syncing action with scroll
- **Emergency Recovery (FAIL-SAFE)**: 5-step interactive reset for burnout spirals
- **The Atomizer (EXEC-01)**: AI-powered task decomposition into atomic steps
- **Protocol Builder (SYS-02)**: 3D momentum constellation tool with Architect/Pilot modes
- **Ignition Sequence**: 600-second power-up ritual with audio crossfade
- **OS Launchpad**: 3D biological shield web (localhost only)

## Content System

Blog posts are fetched from `wp.adduckivity.com` via WordPress REST API. The CMS dashboard at `/content` manages posts stored in Cloudflare KV.

### Public Routes
| Route | Purpose |
|---|---|
| `/` | Homepage — hero, protocol grid, email CTA |
| `/blog` | WordPress-powered published posts grid |
| `/blog/[slug]` | Post reading view |
| `/momentum` | Momentum Protocol + Emergency Recovery |
| `/momentum/guide` | Emergency Recovery guide |
| `/atomizer` | The Atomizer — AI task decomposition |
| `/atomizer/guide` | Atomizer guide |
| `/protocol-builder` | Protocol Builder — 3D momentum constellation |
| `/protocol-builder/guide` | Protocol Builder guide |
| `/ignition` | Ignition Sequence — 600s power-up ritual |
| `/ignition/guide` | Ignition guide |
| `/os` | OS Launchpad (localhost only) |

### Admin Routes (Owner Only)
| Route | Purpose |
|---|---|
| `/content` | CMS dashboard |
| `/content/new` | New post — auto-save, AI assist, Unsplash/R2 |
| `/content/edit?slug=` | Edit post — auto-save, Publish/Unpublish |

### API Routes
| Route | Method | Purpose |
|---|---|---|
| `/api/posts` | GET/PUT/DELETE | Post CRUD operations |
| `/api/posts/save` | POST | Auto-save upsert |
| `/api/posts/maintenance` | GET | Promote scheduled posts |
| `/api/ai` | POST | Multi-provider AI assistant |
| `/api/ai/atomize` | POST | Task decomposition |
| `/api/unsplash` | GET | Unsplash search proxy |
| `/api/upload` | POST | Upload to R2 |
| `/api/assets/[...key]` | GET | Serve R2 assets |
| `/api/subscribe` | POST | SendFox newsletter |
| `/api/stats` | GET | Analytics from KV |
| `/api/track` | GET/POST | Event tracking |

## Environment Variables

Required in Cloudflare Dashboard (see `DEPLOYMENT.md`):
```
GEMINI_API_KEY              # Google Gemini AI
MINIMAX_API_KEY             # MiniMax AI (primary)
UNSPLASH_ACCESS_KEY         # Unsplash image search
FACEBOOK_PAGE_ACCESS_TOKEN  # Facebook auto-post
FACEBOOK_PAGE_ID            # Facebook Page ID
SITE_URL                    # Production URL
SENDFOX_API_TOKEN           # Newsletter subscribe
SENDFOX_LIST_ID             # SendFox list ID
MAINTENANCE_KEY             # Scheduled post promotion
```

## Testing

```bash
cd apps/immersive/momentum-3d
npm run test               # 94 tests across 11 files
```

**Test Coverage:**
- Post CRUD operations (KV) — 18 tests
- Scheduled post promotion — 4 tests
- Reading time calculation — 17 tests
- Slug generation — 7 tests
- Atomizer task persistence — 4 tests
- Markdown rendering — 10 tests
- System provider / gradient lock — 8 tests
- Protocol store — 4 tests
- Ignition state — 6 tests
- Analytics tracking — 4 tests
- Post utilities — 18 tests

## License

MIT

---

**Built by one person with AI systems, not hustle.**
