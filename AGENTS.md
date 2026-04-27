# Duck OS Project Agents & Specifications

## Project Overview

**Vision:** One-person business powered by systems, not hustle.

**Mission:** Build passive income through content, digital products, and tools that help neurodivergent creators design their lives with systems.

**Target Audience:** Burned-out creators, ADHD/MDD folks, systems thinkers, people who need more than motivation.

---

## Current Projects

### 1. Immersive 3D Content Studio (`apps/immersive/momentum-3d`)
**Status:** Active — Production Live  
**URL:** https://immersive.adduckivity.com  
**Tech:** Next.js 16 + React Three Fiber + Cloudflare Pages + KV

---

## CMS & API Routes

### Public Routes (visitors)
| Route | Purpose |
|---|---|
| `/` | Homepage — hero, featured posts, CTA |
| `/blog` | Published posts grid |
| `/blog/[slug]` | Post reading view — drafts return 404 |
| `/momentum` | Momentum Protocol 3D experience + email CTA |

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
| `/api/ai` | POST | Gemini proxy — titles, excerpt, outline, seo, tags |
| `/api/unsplash` | GET | Unsplash search proxy |
| `/api/upload` | POST | Upload image to Cloudflare R2 — returns absolute `https://` URL |
| `/api/assets/[...key]` | GET | Serve R2 asset by key |
| `/api/subscribe` | POST | SendFox email subscribe |

---

## Integrations

### Facebook Auto-Post
- Triggers on first publish of a post (`draft → published`)
- Posts to Facebook Page feed with title, excerpt, link, hashtags
- Cover image served via OG meta tags on blog post page — Facebook scrapes automatically
- Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug) to force re-scrape after first publish
- Response includes `facebook: { ok, error }` field visible in publish toast
- **Env vars:** `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`, `SITE_URL`
- Token expires periodically — refresh via Graph API Explorer with `pages_show_list`, `pages_read_engagement`, `pages_manage_posts` permissions

### SendFox Newsletter
- `/api/subscribe` accepts `{ email }` → adds to SendFox list
- 422 (already subscribed) treated as success
- CTA live on `/momentum` page
- **Env vars:** `SENDFOX_API_TOKEN`, `SENDFOX_LIST_ID`

### Google Gemini AI
- Model: `gemini-2.0-flash`
- Used in CMS editor AI assistant panel
- **Env var:** `GEMINI_API_KEY`

### Unsplash
- Server-side proxy for cover image search
- **Env var:** `UNSPLASH_ACCESS_KEY`

---

## Environment Variables

### Required (Cloudflare Dashboard → Settings → Environment Variables)
```
GEMINI_API_KEY
UNSPLASH_ACCESS_KEY
FACEBOOK_PAGE_ACCESS_TOKEN
FACEBOOK_PAGE_ID
SITE_URL=https://immersive.adduckivity.com
SENDFOX_API_TOKEN
SENDFOX_LIST_ID
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
  status: 'draft' | 'published'
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

**Total:** 32 tests passing

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
| AI | Google Gemini 2.0 Flash |

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
Facebook post → immersive site → /momentum CTA → SendFox list → future paid product
```

### Products
| Product | Price | Status |
|---|---|---|
| Duck OS Emergency Checklist | Free | Live — `/downloads/emergency-checklist.pdf` |
| Duck OS Recovery Protocol | $29 | Pending (PDF) |

---

## Repository Structure

```
adduckivity/
├── apps/
│   └── immersive/
│       └── momentum-3d/       # Main app
│           ├── src/
│           │   ├── app/       # Next.js App Router
│           │   ├── components/
│           │   └── lib/       # posts.ts, content.ts, gemini.ts, dev-kv.ts
│           ├── public/content/ # Static markdown posts (legacy/build-time)
│           └── vitest.config.ts
├── skills/                    # AI agent skill files
├── AGENTS.md                  # This file
├── DOCUMENT.md                # Technical documentation
├── DEPLOYMENT.md              # Deployment guide
├── FirstRevenueRoadmap.md     # 30-day revenue plan
└── ORIGINDUCK.md              # Origin story post (published)
```

---

## Core Philosophy — Duck OS

- **System > Emotion** — Build systems that run regardless of how you feel
- **Action Precedes Motivation** — Start, then momentum follows
- **Protect the System** — Don't push past limit; if the system breaks, everything breaks

**Adduckivity = Addict + Duck + Productivity**

*Last updated: 2026-04-27*
