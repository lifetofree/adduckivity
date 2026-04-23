# 🦆 Duck OS - Adduckivity Monorepo

**Life Architecture for Neurodivergent Creators**

Built with systems thinking, not willpower.

## 🏗️ Architecture

This is a **monorepo** containing all Adduckivity applications and shared packages.

```
adduckivity/
├── apps/
│   ├── immersive/          # → immersive.adduckivity.com (3D content)
│   ├── landing/            # → adduckivity.com (main landing - coming soon)
│   └── tools/              # → tools.adduckivity.com (future)
├── packages/
│   ├── ui-components/      # Shared React components
│   ├── 3d-assets/          # Shared Three.js components (UDO, flywheel, etc.)
│   └── content/            # Shared articles, protocols, Duck OS philosophy
├── skills/                 # AI agent skills
├── AGENTS.md               # Project specifications
├── UDO-SYSTEM.md           # AI co-founder system instruction
└── README.md               # This file
```

## 🚀 Quick Start

### Development
```bash
# Install dependencies (all workspaces)
npm install

# Run immersive app locally
npm run dev:immersive

# Run landing app locally (when it exists)
npm run dev:landing
```

### Build
```bash
# Build immersive app
npm run build
```

## 🌐 Deployment

Each `apps/*` folder deploys to a different subdomain:

- **apps/immersive** → [immersive.adduckivity.com](https://immersive.adduckivity.com)
- **apps/landing** → [adduckivity.com](https://adduckivity.com) (coming soon)
- **apps/tools** → [tools.adduckivity.com](https://tools.adduckivity.com) (coming soon)

### Cloudflare Pages Setup

Each app has its own Cloudflare Pages project:
1. Connect GitHub repo
2. Set build directory: `apps/immersive` (or `apps/landing`)
3. Build command: `npm run build`
4. Output directory: `apps/immersive/.next`

## 🧠 Philosophy

**Duck OS Core Principles:**
- Systems over willpower
- Asset-building over busywork  
- Momentum over motivation
- Awareness over automation
- Rest is a system component

## 🛠️ Tech Stack

- **Frontend:** Next.js 16.2 (App Router, Turbopack), React 19, TypeScript 5
- **3D:** Three.js 0.184, React Three Fiber 9, Drei 10
- **Styling:** Tailwind CSS 4, Framer Motion 12
- **Content:** Markdown + gray-matter, built-in CMS with AI assist
- **AI:** Google Gemini 1.5 Flash (server-side, `/api/ai`)
- **Images:** Unsplash API (server-side proxy, `/api/unsplash`)
- **Deployment:** Cloudflare Pages
- **AI Partner:** UDO (see UDO-SYSTEM.md)

## 📝 Content Strategy

1. **Immersive 3D articles** — Each protocol gets an interactive 3D experience
2. **Digital products** — Duck OS Starter Kit (free), Complete System (paid)
3. **Community** — System Architects membership (future)
4. **Tools** — Duck OS apps and utilities (future)

## ✍️ Content System

Posts live as markdown in `apps/immersive/momentum-3d/public/content/`.

### Public routes (visitors)
| URL | What it does |
|---|---|
| `/blog` | Published posts — card grid, reading experience |
| `/blog/[slug]` | Article reading view — prose, related posts. Drafts → 404. |

### Owner routes (admin only)
| URL | What it does |
|---|---|
| `/content` | CMS dashboard — all posts, stats (Total/Published/Drafts), edit links |
| `/content/new` | New post editor — auto-save, slug, Unsplash/URL cover, AI assist |
| `/content/[slug]` | Edit post — Publish / Unpublish / Save Draft, auto-save (4s) |

**Env vars needed** (in `apps/immersive/momentum-3d/.env.local`):
```
GEMINI_API_KEY=...        # Google Gemini 1.5 Flash (AI assistant)
UNSPLASH_ACCESS_KEY=...   # Unsplash image search
```

## 🦆 UDO - AI Co-Founder

This project uses UDO (Unbreakable Duck Operator) as an AI partner system.
See `UDO-SYSTEM.md` for the complete system instruction.

## 📄 License

MIT

---

**Built by one person with AI systems, not hustle.**
