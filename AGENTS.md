# Duck OS Project Agents & Specifications

## Project Overview

**Vision:** One-person business powered by systems, not hustle.

**Mission:** Build passive income through content, digital products, and tools that help neurodivergent creators design their lives with systems.

**Target Audience:** Burned-out creators, ADHD/MDD folks, systems thinkers, people who need more than motivation.

---

## Current Projects

### 1. Immersive 3D Content Studio (`apps/immersive/momentum-3d`)
**Status:** ✅ **PRODUCTION LIVE** — All Features Operational  
**URL:** https://immersive.adduckivity.com  
**Tech:** Next.js 16 + React Three Fiber + Cloudflare Pages + KV

---

### Featured Protocols & Tools

#### Momentum Protocol (ACT-04)
✅ Visualized 3D flywheel syncing action with scroll. Interactive Emergency Recovery — 5-step fail-safe for burnout spirals.  
**URL:** `/momentum`

---

#### The Atomizer (EXEC-01)
✅ **PRODUCTION LIVE** — AI-powered task decomposition. Completed: 2026-04-30  
**URL:** `/atomizer`

**Features:**
- **UI:** "What's the scary task?" hero headline with cyan accent, underline-only full-width input, "Atomize" button
- **3D Background:** Particle orb (Three.js PointMaterial) — visible only on first step (before task is loaded), unmounts after atomization to keep focus
- **Particle Orb:** 3,000 particles concentrated on sphere surface (r≈2.2), pulsing rotation, additive blending, opacity ~0.20 for text legibility
- **Shatter Effect:** Particle cloud expands on atomize and step completion
- **Multi-provider AI:** MiniMax primary → Gemini 1.5 Flash fallback
- **Focus Window (Law 3):** Only 3 steps visible to prevent overwhelm
- **Energy Check Safety:** Mandatory interrupt every 6 completed steps
- **Auto-return:** After all steps completed, redirects back to Protocol Builder if launched from there (`?returnTo=` param)
- **localStorage Persistence:** Cross-session task recovery
- **SystemBar:** Fixed top nav — "System › Atomizer" breadcrumb, energy level indicator, sync status
- **SystemFooter:** Compact `h-14` bar — mirrors SystemBar style (border-white/5, backdrop-blur-md)
- **42 Tests Passing**

---

#### Protocol Builder (SYS-02)
✅ **PRODUCTION LIVE** — 3D momentum constellation tool. Completed: 2026-05-01  
**URL:** `/protocol-builder`

**Features:**
- **Two Modes:** Architect (build) ↔ Pilot (flow) — toggleable via SystemBar mode switcher
- **Architect Mode:** Physics-engine node canvas, sidebar with node config, drag-to-connect edges, node deletion
- **Pilot Mode:** Camera flight system, auto-advance timer, branching path selection at forks
- **3D Nodes:** Immersive labels, color-coded by type, selection synced to sidebar
- **Protocol Timer:** Per-node duration, auto-advance logic with configurable delay
- **Flow Persistence:** Protocol graph saved to localStorage
- **Graph Engine:** Respects directed connections, supports looping and branching
- **Integration:** Atomizer launched from action nodes via `?returnTo=/protocol-builder`; auto-returns on task completion
- **SystemBar:** Mode switcher pill (Architect/Pilot), sync status indicator
- **SystemFooter:** Compact `h-14` bar — same style as Atomizer

---

### Shared UI Components (`src/components/ProtocolBuilder/`)

#### `SystemBar.tsx`
Fixed top navigation bar used across all Duck OS tools.
- `h-14`, `border-b border-white/5`, `bg-black/20 backdrop-blur-md`
- Left: Duck OS logo + breadcrumb (`System › [Tool Name]`)
- Center: Optional mode switcher pill (Architect / Pilot)
- Right: Energy level bars + sync status dot

#### `SystemFooter.tsx`
Compact bottom bar — mirrors SystemBar exactly.
- `h-14`, `border-t border-white/5`, `bg-black/20 backdrop-blur-md`
- Left: `Duck OS // v1.0.4-STABLE`
- Center: Logo + `Adduckivity › Momentum Protocol` link
- Right: `© 2026 Adduckivity`

---

### System Lock: Gradient Model (`src/lib/system-context.tsx`)

Duck OS uses a **gradient lock model** that adjusts sensory requirements based on energy level:

| Energy Level | Sensory Required | Lock Condition |
|--------------|------------------|-----------------|
| 7-10 (High) | Any 1 of 3 | Never locked by sensory alone |
| 4-6 (Medium) | Any 2 of 3 | Locked if < 2 sensory |
| 1-3 (Low) | All 3 required | Locked if < 3 sensory |
| 0-2 (Critical) | — | Hard lock regardless |

**Context Values:**
- `sensoryRequired` — Number of sensory checks needed (1, 2, or 3)
- `lockProximity` — 0-1 value showing how close to lock (1 = safe, 0 = about to lock)
- `isLocked` — Boolean, true if locked out of tools
- `isProtected` — True when energy ≤ 3

**Fail-Safe:** Critical energy (≤2) always triggers hard lock regardless of sensory checks.

---

### Homepage (`/`)

**Pinned feature cards** (in order):
| Card | Image | Badge | Route |
|---|---|---|---|
| Emergency Recovery | `/uploads/emergency-recovery-cover.svg` | Fail-Safe | `/momentum` |
| Protocol Builder | `/uploads/protocol-builder-cover.svg` | System Architect | `/protocol-builder` |
| The Atomizer | `/uploads/atomizer-cover.svg` | Executive Tool | `/atomizer` |

**SVG Cover Images** (`public/uploads/`) — all hand-crafted, Duck OS dark aesthetic:
- `emergency-recovery-cover.svg` — shield + reset icon, red glow, scan line
- `atomizer-cover.svg` — atom nucleus (58px), 3 orbital rings with animated electrons (`animateMotion`), 12 floating particles, 4 step-node labels
- `protocol-builder-cover.svg` — constellation network, central pulsing hub, 6 primary nodes (cyan), leaf nodes (red), pulse ring animation

**Footer** (redesigned 2026-05-01):
- Row 1 (`h-16`): logo+name left, nav links center (Blog/Archive/Tools), © right — muted, brightens on hover
- Row 2: hairline divider + "Duck OS · Life Architecture for Neurodivergent Creators" centered in micro uppercase tracking

---

## Routes

### Public Routes
| Route | Purpose |
|---|---|
| `/` | Homepage — hero, protocol grid, principles, email CTA |
| `/blog` | Published posts grid |
| `/blog/[slug]` | Post reading view — drafts return 404 |
| `/momentum` | Momentum Protocol + Emergency Recovery |
| `/atomizer` | The Atomizer — AI task decomposition |
| `/protocol-builder` | Protocol Builder — 3D momentum constellation |

### Admin Routes (owner only)
| Route | Purpose |
|---|---|
| `/content` | CMS dashboard — delete buttons for drafts/scheduled posts, published posts protected |
| `/content/new` | New post — auto-save, slug, Unsplash, AI assistant |
| `/content/edit?slug=` | Edit post — auto-save (4s), Publish/Unpublish modals |

### API Routes (`src/app/api/`)
| Route | Method | Purpose |
|---|---|---|
| `/api/posts` | GET | List all posts or fetch by `?slug=` — sorts by publishedAt DESC, then date DESC |
| `/api/posts` | PUT | Update post — triggers Facebook auto-post on first publish |
| `/api/posts` | DELETE | Delete post + associated R2 images — published posts protected (403) |
| `/api/posts/save` | POST | Upsert (auto-save, preserves status) |
| `/api/posts/maintenance` | GET | Promote overdue scheduled posts (protected by key) |
| `/api/ai` | POST | Multi-provider AI — titles, excerpt, outline, seo, tags |
| `/api/ai/atomize` | POST | MiniMax/Gemini — break task into 12-15 atomic steps (≤2 min each) |
| `/api/ai/debug` | POST | Debug endpoint for AI provider testing |
| `/api/unsplash` | GET | Unsplash search proxy |
| `/api/upload` | POST | Upload image to Cloudflare R2 |
| `/api/assets/[...key]` | GET | Serve R2 asset by key |
| `/api/subscribe` | POST | SendFox email subscribe |
| `/api/stats` | GET | Aggregated analytics event counts from KV |
| `/api/track` | GET/POST | Record analytics events |

---

## Integrations

### Facebook Auto-Post
- Triggers on transition to `published` (manual or scheduled)
- `facebookPosted` flag + KV-based lock prevents duplicates
- **Env vars:** `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`, `SITE_URL`

### SendFox Newsletter
- `/api/subscribe` accepts `{ email }` → adds to SendFox list
- 422 (already subscribed) treated as success
- **Env vars:** `SENDFOX_API_TOKEN`, `SENDFOX_LIST_ID`

### Google Gemini AI
- Model: `gemini-1.5-flash`
- CMS AI assistant + Atomizer fallback provider
- **Env var:** `GEMINI_API_KEY`

### MiniMax AI
- Model: `abab6.5s-chat`
- Primary provider for Atomizer + CMS AI assistant; auto-falls back to Gemini
- **Env var:** `MINIMAX_API_KEY`

### Unsplash
- Server-side proxy for cover image search
- **Env var:** `UNSPLASH_ACCESS_KEY`

### Google Drive Image Import
- Post saves auto-download Drive image URLs to Cloudflare R2 and replace URLs in content
- Handles `/file/d/`, `/uc?export=view&id=`, `/open?id=` formats

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
MAINTENANCE_KEY
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
  publishedAt?: string       // ISO datetime — set on first publish for precise sorting
  category: string           // protocol | tutorial | case-study | system
  scene: string              // default | momentum-flywheel
  mood: string               // neutral | energetic | calm | focused
  excerpt: string
  tags: string[]
  featuredImage: string
  imageAlt?: string
  author: string
  readingTime: string        // auto-calculated
  status: 'draft' | 'published' | 'scheduled'
  scheduledAt?: string       // ISO datetime — only for scheduled posts
  facebookPosted?: boolean   // tracks Facebook sharing status
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
| `src/__tests__/posts.schedule.test.ts` | hides future, promotes past, facebookPosted flag, race condition lock |
| `src/lib/atomizer.test.ts` | AtomizerTask, AtomicStep, saveAtomizerTask, loadAtomizerTask |

**Total:** 94 tests passing

---

## Core Libraries

### `src/lib/posts.ts`
**Post CRUD and Content Management**
- `getAllPosts()` — Retrieves all posts from KV, sorted by publishedAt DESC
- `getPublishedPosts()` — Returns only published posts with scheduled promotion
- `getPostBySlug()` — Fetches single post by slug
- `savePost()` — Creates or updates post with auto-calculated readingTime
- `updatePost()` — Partial update with slug rename support
- `deletePost()` — Deletes post by slug
- `slugExists()` — Checks slug availability
- `promoteScheduledPosts()` — Promotes overdue scheduled posts to published
- `importGoogleDriveImages()` — Downloads Drive images to R2
- `postToFacebook()` — Shares published posts to Facebook Page
- `readingTime()` — Calculates reading time from word count
- `toSlug()` — Converts titles to URL-safe slugs
- `isPostLive()` — Checks if post is visible to public

### `src/lib/atomizer.ts`
**Task Decomposition Persistence**
- `AtomizerTask` interface — Original task + atomic steps + metadata
- `AtomicStep` interface — Individual step with completion status
- `saveAtomizerTask()` — Persists task to localStorage
- `loadAtomizerTask()` — Loads active task from localStorage
- `STORAGE_KEY` — localStorage key for task persistence

### `src/lib/markdown.ts`
**Markdown Processing and Rendering**
- `renderMarkdown()` — Converts markdown to HTML with syntax support
- `extractHeadings()` — Parses h1-h3 headings for TOC generation
- Google Drive URL conversion — Transform sharing links to direct embeds
- Inline formatting — Bold, italic, code, links
- Block elements — Headers, lists, blockquotes, tables, code blocks
- Image handling — Responsive img tags with lazy loading

### `src/lib/content.ts`
**Build-time Content Loading**
- `getAllPosts()` — Loads all markdown files from public/content
- `getPostBySlug()` — Loads specific post by slug
- `getPublishedPosts()` — Filters published posts only
- Integrates with gray-matter for frontmatter parsing
- Used for static build operations

### `src/lib/protocol-store.ts`
**Protocol Builder State Management**
- Protocol graph persistence to localStorage
- Node and edge management
- Architect/Pilot mode switching
- Flight path serialization

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
| AI | MiniMax abab6.5s-chat (primary) + Google Gemini 1.5 Flash (fallback) |

---

## Analytics

### Events
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
localhost:3000  →  main branch  →  Cloudflare Pages
  (dev)            (commit)        immersive.adduckivity.com
```

### Commands
```bash
cd apps/immersive/momentum-3d
npm run dev       # localhost:3000
npm run test      # run 42 tests
npm run deploy    # build (next-on-pages) + deploy to Cloudflare Pages
```

---

## Scheduled Publishing

Posts support `status: 'scheduled'` with `scheduledAt` ISO datetime.

- **Promotion:** Overdue posts promoted to `published` during list fetches or via `/api/posts/maintenance`
- **Social:** Triggers Facebook post on first publish; `facebookPosted` flag prevents duplicates
- **Automation:** `/api/posts/maintenance` (protected by `MAINTENANCE_KEY`) — hit via external cron
- **Timestamp Sorting:** Enhanced sorting with `publishedAt` field for precise chronological ordering

---

## Content Management Features

### Delete Functionality
- **Smart Protection:** Published posts cannot be deleted (403 error) — must unpublish first
- **Cascade Deletion:** Deletes both post content AND associated R2 images
- **Image Detection:** Automatically finds and removes `/api/assets/` URLs from content and featured images
- **User Confirmation:** Two-step confirmation UI prevents accidental deletions
- **Status Indicators:** Disabled delete button for published posts with clear visual feedback

### Navigation Consistency
- **Unified Header:** All pages (`/`, `/blog`, `/momentum`) use identical navigation styling
- **Sticky Header:** Fixed positioning with backdrop blur and border
- **Responsive:** Mobile menu button, desktop navigation links
- **Consistent Links:** Blog, 3D Experience, Archive, Tools across all pages

---

## Revenue Funnel

```
Hero Reset Trigger → Interactive Protocol → Email Capture (Free Kit) → Early Bird Pre-Order
```

| Product | Price | Status |
|---|---|---|
| Duck OS Emergency Protocol | Free | Live — Interactive Tool + Email Capture |
| Duck OS Recovery Protocol | 299 THB | Live — Early Bird Pre-Order |

---

## Core Philosophy — Duck OS

- **System > Emotion** — Build systems that run regardless of how you feel
- **Action Precedes Motivation** — Start, then momentum follows
- **Protect the System** — Don't push past limit; if the system breaks, everything breaks

**Adduckivity = Addict + Duck + Productivity**

---

*Last updated: 2026-05-01 — Enhanced with content management, navigation consistency, and timestamp sorting*
