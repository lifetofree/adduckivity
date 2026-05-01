# 🦆 Duck OS - Adduckivity Monorepo

**Life Architecture for Neurodivergent Creators**

Built with systems thinking, not willpower.

## 🏗️ Architecture

This is a **monorepo** containing all Adduckivity applications and shared packages.

```
adduckivity/
├── apps/
│   └── immersive/
│       └── momentum-3d/    # → immersive.adduckivity.com (3D content studio)
├── docs/                   # Project documentation and specs
├── skills/                 # AI agent skills and workflows
├── AGENTS.md               # Project specifications and tech stack
├── UDO-SYSTEM.md           # AI co-founder system instruction
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Run immersive app locally
cd apps/immersive/momentum-3d
npm run dev                # http://localhost:3000
```

### Build & Deploy
```bash
# Run test suite (42 tests)
npm run test

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

## 🌐 Deployment

**Production:** https://immersive.adduckivity.com  
**Platform:** Cloudflare Pages with Edge Functions  
**Branch:** `main` → auto-deploys on commit

### Cloudflare Pages Setup
1. Connect GitHub repository
2. Build directory: `apps/immersive/momentum-3d`
3. Build command: `npm run build`
4. Output directory: `.vercel/output/static` (next-on-pages)
5. Environment variables: See `DEPLOYMENT.md`

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **UI** | React 19, TypeScript 5 |
| **3D** | Three.js 0.184, React Three Fiber 9, Drei 10 |
| **Styling** | Tailwind CSS 4, Framer Motion 12 |
| **Testing** | Vitest 4 + jsdom (42 tests passing) |
| **Content** | Markdown + gray-matter, KV-based CMS |
| **AI** | MiniMax abab6.5s-chat (primary) + Gemini 1.5 Flash (fallback) |
| **Storage** | Cloudflare KV + R2 |
| **Deployment** | Cloudflare Pages (edge runtime) |

## 🧠 Philosophy

**Duck OS Core Principles:**
- **System > Emotion** — Build systems that run regardless of how you feel
- **Action Precedes Motivation** — Start, then momentum follows
- **Protect the System** — Don't push past limit; if the system breaks, everything breaks

**Interactive Protocols:**
- **Momentum (ACT-04)**: Visualized 3D flywheel syncing action with scroll
- **Emergency Recovery (FAIL-SAFE)**: 5-step interactive reset for burnout spirals
- **The Atomizer (EXEC-01)**: AI-powered task decomposition into atomic steps
- **Protocol Builder (SYS-02)**: 3D momentum constellation tool

## 📝 Content System

Posts are managed via a built-in CMS and stored in Cloudflare KV. The homepage grid is dynamically generated from these posts.

### Public Routes
| Route | Purpose |
|---|---|
| `/` | Homepage — hero, protocol grid, email CTA |
| `/blog` | Published posts grid |
| `/blog/[slug]` | Article reading view (drafts → 404) |
| `/momentum` | Momentum Protocol + Emergency Recovery |
| `/atomizer` | The Atomizer — AI task decomposition |
| `/protocol-builder` | Protocol Builder — 3D momentum constellation |

### Admin Routes (Owner Only)
| Route | Purpose |
|---|---|
| `/content` | CMS dashboard — delete buttons, status badges |
| `/content/new` | New post — auto-save, AI assist, Unsplash/R2 |
| `/content/edit?slug=` | Edit post — auto-save (4s), Publish/Unpublish modals |

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

## 🔧 Environment Variables

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

## 🧪 Testing

```bash
cd apps/immersive/momentum-3d
npm run test               # Run 42 tests
```

**Test Coverage:**
- Post CRUD operations (KV)
- Scheduled post promotion
- Reading time calculation
- Slug generation
- Atomizer task persistence
- Facebook posting integration

## 🦆 UDO - AI Co-Founder

This project uses UDO (Unbreakable Duck Operator) as an AI partner system.
See `UDO-SYSTEM.md` for the complete system instruction.

## 📄 License

MIT

---

**Built by one person with AI systems, not hustle.**
