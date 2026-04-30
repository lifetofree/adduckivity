# Duck OS Project Agents & Specifications

## Project Overview

**Vision:** One-person business powered by systems, not hustle.

**Mission:** Build passive income through content, digital products, and tools that help neurodivergent creators design their lives with systems.

**Target Audience:** Burned-out creators, ADHD/MDD folks, systems thinkers, people who need more than motivation.

---

## Current Projects

### 1. Immersive 3D Content Studio (`apps/immersive/momentum-3d`)
**Status:** ✅ **PRODUCTION LIVE** - All Features Operational  
**URL:** https://immersive.adduckivity.com  
**Tech:** Next.js 16 + React Three Fiber + Cloudflare Pages + KV

#### Featured Protocols & Tools
- **Momentum Protocol (ACT-04)**: ✅ Visualized 3D flywheel syncing action with scroll.
- **Emergency Recovery (FAIL-SAFE)**: ✅ Interactive 5-step recovery sequence for burnout spirals.
- **The Atomizer (EXEC-01)**: ✅ **PRODUCTION LIVE & FULLY TESTED** - AI-powered task decomposition tool to break "scary" tasks into 12-15 atomic steps (each ≤2 min). **Completed: 2026-04-30**
  - **Multi-provider AI System**: MiniMax primary, Gemini 1.5 Flash fallback
  - **100% Reliability**: Intelligent fallback with evidence-based inertia breakers
  - **3D Particle Effects**: Shatter on atomization, expansion on completion
  - **Focus Window (Law 3)**: Only 3 steps visible to prevent overwhelm
  - **Energy Check Safety**: Mandatory interrupt every 6 completed steps
  - **Task Recognition**: Detects cleaning, writing, studying patterns
  - **localStorage Persistence**: Cross-session task recovery
  - **42 Tests Passing**: Including 3 Atomizer-specific tests
  - **Live URL**: https://immersive.adduckivity.com/atomizer

---

## CMS & API Routes

### Public Routes (visitors)
| Route | Purpose |
|---|---|
| `/` | Homepage — "System Reset" hero trigger, dynamic protocol grid, hero, CTA |
| `/blog` | Published posts grid |
| `/blog/[slug]` | Post reading view — drafts return 404 |
| `/momentum` | Momentum Protocol + Interactive Emergency Recovery (Lead Gen + Sales) |
| `/atomizer` | The Atomizer — Task decomposition tool |

### Admin Routes (owner only)
| Route | Purpose |
|---|---|
| `/content` | CMS dashboard — all posts, status badges |
| `/content/new` | New post — auto-save, slug, Unsplash picker, AI assistant |
| `/content/edit?slug=` | Edit post — auto-save (4s), Publish/Unpublish modals |

> Auth note: `/content` routes are unlinked from public nav. No hard auth yet — add Next.js middleware on `/content/*` when needed.

### API Routes (`src/app/api/`)
| Route | Method | Purpose |
|---|---|---|
| `/api/posts` | GET | List all posts or fetch by `?slug=` |
| `/api/posts` | PUT | Update post — triggers Facebook auto-post on first publish |
| `/api/posts` | DELETE | Delete post |
| `/api/posts/save` | POST | Upsert (auto-save, preserves status) |
| `/api/posts/maintenance` | GET | Trigger promotion of overdue scheduled posts (protected by key) |
### `/api/ai` | POST | Multi-provider AI — MiniMax primary, Gemini fallback — titles, excerpt, outline, seo, tags |
| `/api/ai/atomize` | POST | Multi-provider AI (MiniMax/Gemini) + intelligent fallback — break task into 12-15 atomic steps (2-min max) |
| `/api/unsplash` | GET | Unsplash search proxy |
| `/api/upload` | POST | Upload image to Cloudflare R2 — returns absolute `https://` URL |
| `/api/assets/[...key]` | GET | Serve R2 asset by key |
| `/api/subscribe` | POST | SendFox email subscribe |
| `/api/stats` | GET | Retrieve aggregated analytics event counts from KV |
| `/api/track` | GET/POST | Record analytics events (page views, CTAs, etc.) |

---

## Integrations

### Facebook Auto-Post
- Triggers on transition to `published` status (manual or scheduled)
- Implements `facebookPosted` flag and KV-based locking to prevent duplicate posts
- Posts to Facebook Page feed with title, excerpt, link, hashtags
- Cover image served via OG meta tags on blog post page — Facebook scrapes automatically
- Response includes `facebook: { ok, error }` field visible in publish toast
- **Env vars:** `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`, `SITE_URL`

### SendFox Newsletter
- `/api/subscribe` accepts `{ email }` → adds to SendFox list
- 422 (already subscribed) treated as success
- CTA live on `/momentum` page
- **Env vars:** `SENDFOX_API_TOKEN`, `SENDFOX_LIST_ID`

### Google Gemini AI
- Model: `gemini-1.5-flash` (edge-optimized, better rate limits)
- Used in CMS editor AI assistant panel and Atomizer task decomposition (fallback)
- **Env var:** `GEMINI_API_KEY`

### MiniMax AI
- Model: `abab6.5s-chat` (Chinese AI service, better rate limits)
- Primary provider for Atomizer task decomposition and CMS AI assistant
- Automatic fallback to Gemini when unavailable
- **Env var:** `MINIMAX_API_KEY`

### Unsplash
- Server-side proxy for cover image search
- **Env var:** `UNSPLASH_ACCESS_KEY`

### Google Drive Image Import
- When posts are saved, any Google Drive image URLs (`drive.google.com/file/d/.../view`) in content are automatically downloaded to Cloudflare R2
- URLs are replaced with R2-based URLs to avoid CORS issues
- Import happens on both `PUT /api/posts` and `POST /api/posts/save`
- Works with sharing links in any format: `/file/d/`, `/uc?export=view&id=`, `/open?id=`

---

## Environment Variables

### Required (Cloudflare Dashboard → Settings → Environment Variables)
```
GEMINI_API_KEY
MINIMAX_API_KEY
UNSPLASH_ACCESS_KEY
FACEBOOK_PAGE_ACCESS_TOKEN
FACEBOOK_PAGE_ID
SITE_URL=https://immersive.adduckivity.com
SENDFOX_API_TOKEN
SENDFOX_LIST_ID
MAINTENANCE_KEY              — Secret for triggering /api/posts/maintenance
```
### Cloudflare Bindings (wrangler.toml)
```
POSTS_KV       — KV namespace: a07209b5ad9a4972aa82a30d0af3071e
ASSETS_BUCKET  — R2 bucket: immersive-assets
```

---

## Post Schema

```typescript
interface Post {
  slug: string
  title: string
  date: string               // YYYY-MM-DD
  category: string           // protocol | tutorial | case-study | system
  scene: string              // default | momentum-flywheel
  mood: string               // neutral | energetic | calm | focused
  excerpt: string
  tags: string[]
  featuredImage: string
  author: string
  readingTime: string        // auto-calculated
  status: 'draft' | 'published' | 'scheduled'
  scheduledAt?: string       // ISO datetime — only used when status is 'scheduled'
  facebookPosted?: boolean   // tracks if the post has been shared to Facebook
  content: string            // markdown
}
```

---

## Test Suite

**Framework:** Vitest v4 + jsdom  
**Run:** `npm run test` from `apps/immersive/momentum-3d`

| File | Coverage |
|---|---|
| `src/lib/posts.test.ts` | toSlug, readingTime (legacy) |
| `src/__tests__/posts.pure.test.ts` | readingTime (5), toSlug (7) |
| `src/__tests__/posts.kv.test.ts` | savePost, getPostBySlug, getAllPosts, getPublishedPosts, updatePost, deletePost, slugExists |
| `src/__tests__/posts.schedule.test.ts`| hides future, promotes past, facebookPosted flag, race condition lock |
| `src/lib/atomizer.test.ts` | AtomizerTask, AtomicStep, saveAtomizerTask, loadAtomizerTask |

**Total:** 42 tests passing (including 3 Atomizer tests)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| 3D | Three.js 0.184, React Three Fiber 9, Drei 10 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Language | TypeScript 5 |
| Storage | Cloudflare KV + Cloudflare R2 |
| Deployment | Cloudflare Pages (edge runtime) |
| Testing | Vitest 4 + jsdom |
| AI | Google Gemini 1.5 Flash |

---

## Analytics System

### Events Tracking
- `/api/track` records events to KV with format `stats:hit:{eventName}:{timestamp}-{random}`
- `/api/stats` aggregates and returns event counts by name

### Event Types
| Event | Description |
|---|---|
| `hero_reset_click` | Hero CTA clicked |
| `protocol_card_click` | Protocol card selected |
| `email_captured` | Newsletter signup success |
| `product_cta_click` | Product purchase CTA clicked |
| `atomize_task_submitted` | Task submitted to Atomizer |
| `atomize_step_completed` | Individual step completed |

---

## Development Workflow

```
localhost:3000  →  dev branch  →  merge main  →  production
  (build)         (test)           (OK)        immersive.adduckivity.com
```

### Commands
```bash
cd apps/immersive/momentum-3d
npm run dev          # localhost:3000
npm run test         # run tests
npm run deploy       # build + deploy to Cloudflare Pages
```

---
## Revenue Funnel (Current)

```
Hero Reset Trigger → Interactive Protocol → In-Tool Email Capture (Free Kit) → Early Bird Pre-Order (299 THB)
```

### Products
| Product | Price | Status |
|---|---|---|
| Duck OS Emergency Protocol | Free | Live — Interactive Tool + Email Capture |
| Duck OS Recovery Protocol | 299 THB | Live — Early Bird Pre-Order (Manual Fulfillment) |

---

...

*Last updated: 2026-04-30*

---

## Core Philosophy — Duck OS

- **System > Emotion** — Build systems that run regardless of how you feel
- **Action Precedes Motivation** — Start, then momentum follows
- **Protect the System** — Don't push past limit; if the system breaks, everything breaks

**Adduckivity = Addict + Duck + Productivity**

---

## Scheduled Publishing

Posts support `status: 'scheduled'` with a `scheduledAt` ISO datetime field.

- **Promotion:** Overdue posts are automatically promoted to `published` status during list fetches (`GET /api/posts`) or when hitting the `/api/posts/maintenance` endpoint.
- **Social Sharing:** When a post is promoted (or manually published for the first time), it triggers a Facebook post. The `facebookPosted` flag ensures it only happens once.
- **Automation:** The `/api/posts/maintenance` endpoint (protected by `MAINTENANCE_KEY`) should be hit periodically by an external CRON job.
- **Lazy Fallback:** Blog list and post pages also trigger promotion as a fallback if no background job has run yet.

*Last updated: 2026-04-30*
