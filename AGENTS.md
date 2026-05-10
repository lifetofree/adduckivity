# Duck OS Project Agents & Specifications

## Project Overview

**Vision:** One-person business powered by systems, not hustle.

**Mission:** Build passive income through content, digital products, and tools that help neurodivergent creators design their lives with systems.

**Target Audience:** Burned-out creators, ADHD/MDD folks, systems thinkers, people who need more than motivation.

---

## Current Projects

### 1. Immersive 3D Content Studio (`apps/immersive/momentum-3d`)
**Status:** PRODUCTION LIVE — All Features Operational  
**URL:** https://immersive.adduckivity.com  
**Tech:** Next.js 16.2 + React Three Fiber 9 + Cloudflare Pages + KV

---

## Featured Protocols & Tools

### Momentum Protocol (ACT-04)
Visualized 3D flywheel syncing action with scroll. Interactive Emergency Recovery — 5-step fail-safe for burnout spirals.  
**URL:** `/momentum`

---

### The Atomizer (EXEC-01)
PRODUCTION LIVE — AI-powered task decomposition. Completed: 2026-04-30  
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

---

### Protocol Builder (SYS-02)
PRODUCTION LIVE — 3D momentum constellation tool. Completed: 2026-05-01  
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
- **IntroSlides:** Onboarding slides for first-time users

---

### Ignition Sequence
PRODUCTION LIVE — 600-second power-up ritual  
**URL:** `/ignition`

**Features:**
- **Three Phases:** Spark → Target → Launch — phase transitions with audio crossfade
- **Audio Manager:** `ignition-audio.ts` — handles background music with smooth transitions
- **State Management:** Zustand store (`ignition-store.ts`) — phase, timer, target node
- **Guide Page:** `/ignition/guide` — full documentation of the ignition ritual

---

### OS Launchpad
LOCALHOST ONLY — 3D biological shield web and central command center  
**URL:** `/os` (restricted to localhost/127.0.0.1 via client-side check)

**Features:**
- **Shield Web:** 3D sensory check visualization (water, light, noise)
- **Tool Nodes:** Launchable tool shortcuts with animations
- **Roadmap Web:** 3D roadmap visualization with task toggling
- **Launchpad Overlay:** 2D UI overlay for navigation

---

### Guide Pages
Each tool has a companion guide page with full documentation:
- `/momentum/guide` — Emergency Recovery guide
- `/atomizer/guide` — Atomizer guide
- `/protocol-builder/guide` — Protocol Builder guide
- `/ignition/guide` — Ignition ritual guide

---

## Shared UI Components

### `src/components/shared/` (global components)

#### `SystemBar.tsx`
Fixed top navigation bar used across all Duck OS tools. Rendered in root `layout.tsx`.
- `h-14`, `border-b border-white/5`, `bg-black/20 backdrop-blur-md`
- Left: Duck OS logo + breadcrumb (`System › [Tool Name]`)
- Center: Optional mode switcher pill (Architect / Pilot)
- Right: Energy level bars + sync status dot

#### `SystemFooter.tsx`
Compact bottom bar — mirrors SystemBar exactly. Rendered in root `layout.tsx`.
- `h-14`, `border-t border-white/5`, `bg-black/20 backdrop-blur-md`
- Left: `Duck OS // v1.0.4-STABLE`
- Center: Logo + `Adduckivity › Momentum Protocol` link
- Right: `© 2026 Adduckivity`

#### `ControlCenter.tsx`
Energy/sensory control panel — adjusts energy level and toggles sensory checks.

#### `SceneLoader.tsx`
Thin cyan progress bar for 3D scene loading states.

---

### `src/components/ProtocolBuilder/`

#### `IntroSlides.tsx`
Onboarding slides for Protocol Builder — introduces Architect/Pilot modes.

#### `IgnitionOverlay.tsx`
Overlay for Ignition phase transitions and controls.

#### `useIgnitionScene.ts`
React hook for ignition scene effects and animations.

---

### `src/components/` (tool-specific)

| Component | Purpose |
|---|---|
| `AtomizerList.tsx` | Step list with focus window (3 visible) |
| `AtomizerScene.tsx` | Particle orb 3D background |
| `EmergencyProtocol.tsx` | 5-step fail-safe UI |
| `FlywheelScene.tsx` | 3D momentum flywheel |
| `LaunchpadOverlay.tsx` | 2D overlay for `/os` launchpad |
| `OSLaunchpadScene.tsx` | 3D scene for `/os` — tool nodes + shield + roadmap |
| `RoadmapWeb.tsx` | 3D roadmap visualization with task toggling |
| `RoadmapNode.tsx` | Single 3D icosahedron node for roadmap |
| `ShieldWeb.tsx` | 3D bio-feedback shield (sensory checks) |
| `ToolNode.tsx` | 3D tool node with launch animation |
| `SystemGate.tsx` | Energy/sensory gate for tool access |
| `EmailCTA.tsx` | Email capture component |
| `EnergyCheck.tsx` | Energy level check component |
| `SiteFooter.tsx` | Homepage footer component |

---

## System Lock: Gradient Model (`src/lib/system-context.tsx`)

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
- `isLoaded` — True after initial state hydration from localStorage
- `isSyncing` — Sync status indicator
- `isFooterVisible` — Footer visibility toggle
- `systemBarNode` / `footerNode` — Slot nodes for per-page customization

**Default State:** First-time visitors default to sensory all-on (unlocked) so they are not blocked from tools.

**Fail-Safe:** Critical energy (≤2) triggers biological crash recovery — resets all sensory checks and hard locks.

**Storage:** `duckos:system:state` in localStorage (migrates from legacy `st8` key).

---

## Root Layout (`src/app/layout.tsx`)

All pages are wrapped by `SystemProvider` → `SystemBar` → `<main>` → `SystemFooter`. This provides:
- Global navigation with breadcrumb
- Energy level indicator always visible
- System lock enforcement across all tools

---

## Theme System (`src/lib/theme.ts`)

Centralized color palette — single source of truth for theming:

```
ET = {
  bg: '#0A0F1E',      // page background
  surface: '#0F1829',  // cards, sidebars, nav
  muted: '#1A2840',    // subtle fills
  border: '#1E3A5F',   // borders, dividers
  ink: '#E8F4F8',      // primary text
  mid: '#A8C8D8',      // secondary text
  sub: '#6B9BB8',      // muted text, meta
  accent: '#00E5FF',   // cyan neon — primary brand color
}
```

Also provides `inputCss(ET)` for consistent form element styling.

---

## Homepage (`/`)

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

## Blog System

**Blog (`/blog`)** fetches posts from `wp.adduckivity.com` via WordPress REST API (`src/lib/wordpress.ts`).

- **Featured post:** Full-width hero card with cover image, SEO title, tags, reading time
- **Post grid:** 3-column responsive grid for remaining posts
- **External links:** All posts link to the WordPress site (`post.link`)
- **SEO:** Pulls Yoast/Jetpack SEO titles and descriptions from embedded post data
- **Categories & Tags:** Extracted from `_embedded.wp:term`
- **Reading Time:** Calculated from actual post content
- **Revalidation:** 5-minute cache via Next.js `revalidate: 300`

**Blog Post (`/blog/[slug]`)** renders individual posts from WordPress.

---

## Routes

### Public Routes
| Route | Purpose |
|---|---|
| `/` | Homepage — hero, protocol grid, principles, email CTA |
| `/blog` | WordPress-powered published posts grid |
| `/blog/[slug]` | Post reading view — renders WordPress content |
| `/momentum` | Momentum Protocol + Emergency Recovery |
| `/momentum/guide` | Emergency Recovery guide documentation |
| `/atomizer` | The Atomizer — AI task decomposition |
| `/atomizer/guide` | Atomizer guide documentation |
| `/protocol-builder` | Protocol Builder — 3D momentum constellation |
| `/protocol-builder/guide` | Protocol Builder guide documentation |
| `/ignition` | Ignition Sequence — 600s power-up ritual |
| `/ignition/guide` | Ignition guide documentation |
| `/os` | OS Launchpad — **localhost only** (shows message on production) |

### Admin Routes (owner only)
| Route | Purpose |
|---|---|
| `/content` | CMS dashboard — delete buttons for drafts/scheduled posts, published posts protected |
| `/content/new` | New post — auto-save, slug, Unsplash, AI assistant |
| `/content/edit?slug=` | Edit post — auto-save (4s), Publish/Unpublish modals |

### API Routes (`src/app/api/`)
All routes use `export const runtime = 'edge'` — required by Cloudflare Pages.

| Route | Method | Purpose |
|---|---|---|
| `/api/posts` | GET | List all posts or fetch by `?slug=` — sorts by publishedAt DESC, then date DESC |
| `/api/posts` | PUT | Update post — triggers Facebook auto-post on first publish |
| `/api/posts` | DELETE | Delete post + associated R2 images — published posts protected (403) |
| `/api/posts/save` | POST | Upsert (auto-save, preserves status) |
| `/api/posts/maintenance` | GET | Promote overdue scheduled posts (protected by key) |
| `/api/ai` | POST | Multi-provider AI — titles, excerpt, outline, seo, tags |
| `/api/ai/atomize` | POST | MiniMax/Gemini — break task into 12-15 atomic steps (≤2 min each) |
| `/api/unsplash` | GET | Unsplash search proxy |
| `/api/upload` | POST | Upload image to Cloudflare R2 |
| `/api/assets/[...key]` | GET | Serve R2 asset by key |
| `/api/subscribe` | POST | SendFox email subscribe |
| `/api/stats` | GET | Aggregated analytics event counts from KV |
| `/api/track` | GET/POST | Record analytics events |

---

## Integrations

### WordPress Blog (`wp.adduckivity.com`)
- Blog page fetches from `wp.adduckivity.com/wp-json/wp/v2/posts`
- Embedded data: featured media, categories, tags
- SEO: Yoast `yoast_head_json` + Jetpack `meta` fields
- Thai content filtering via `isEnglishPost()`
- **URL:** `https://wp.adduckivity.com`

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

**Framework:** Vitest v4.1 + jsdom + Testing Library  
**Run:** `npm run test` from `apps/immersive/momentum-3d`

| File | Coverage |
|---|---|
| `src/lib/posts.test.ts` | toSlug, readingTime (legacy) |
| `src/__tests__/posts.pure.test.ts` | readingTime (5), toSlug (7) |
| `src/__tests__/posts.kv.test.ts` | savePost, getPostBySlug, getAllPosts, getPublishedPosts, updatePost, deletePost, slugExists |
| `src/__tests__/posts.schedule.test.ts` | hides future, promotes past, facebookPosted flag, race condition lock |
| `src/__tests__/posts.utils.test.ts` | Post utility functions |
| `src/lib/atomizer.test.ts` | AtomizerTask, AtomicStep, saveAtomizerTask, loadAtomizerTask |
| `src/lib/markdown.test.ts` | renderMarkdown, extractHeadings, formatting, code blocks |
| `src/__tests__/system.test.tsx` | SystemProvider, gradient lock, sensory requirements |
| `src/__tests__/protocol.test.ts` | Protocol store and state management |
| `src/__tests__/ignition.test.ts` | Ignition phases, timer, state transitions |
| `src/__tests__/analytics.test.ts` | Analytics event tracking |

**Total:** 94 tests passing across 11 test files

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

### `src/lib/wordpress.ts`
**WordPress REST API Integration**
- `getWordPressPosts()` — Fetches posts from `wp.adduckivity.com` with embedded media/terms
- `formatWordPressPost()` — Converts WordPress post to blog page format
- `getPostSeoFromHtml()` — Extracts og:title/og:description from post HTML (SSRF-protected)
- `getCategoryName()` — Extracts category from embedded terms
- `getPostTags()` — Extracts tags from embedded terms
- `getFeaturedImageUrl()` / `getFeaturedImageAlt()` — Featured image helpers
- `stripHtml()` — Strips HTML tags from rendered content
- `calculateReadingTime()` / `getReadingTimeFromPost()` — Reading time from content
- `isEnglishPost()` — Filters out Thai-language content

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

### `src/lib/protocol-store.ts`
**Protocol Builder State Management**
- Protocol graph persistence to localStorage
- Node and edge management
- Architect/Pilot mode switching
- Flight path serialization

### `src/lib/ignition-store.ts`
**Ignition Sequence State Management (Zustand)**
- `IgnitionPhase` — `'spark' | 'target' | 'launch' | 'idle'`
- Phase transitions and timer management
- Target node selection for launch phase

### `src/lib/ignition-audio.ts`
**Audio Manager for Ignition**
- Background music with crossfade between phases
- Audio element lifecycle management

### `src/lib/system-context.tsx`
**Global System State (React Context)**
- Gradient lock model — energy-aware sensory requirements
- localStorage persistence with legacy migration
- Biological crash recovery on critical energy
- Provides: energy, sensory, isLocked, isProtected, sensoryRequired, lockProximity

### `src/lib/theme.ts`
**Centralized Color Palette**
- `ET` constant — single source of truth for all colors
- `inputCss(ET)` — consistent form element styling utility

### `src/lib/dev-kv.ts`
**Local Development KV Mock**
- In-memory implementation of Cloudflare KV API
- Used when `NODE_ENV === 'development'`
- Supports get/put/delete/list interface

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.4 (App Router, Turbopack) |
| 3D | Three.js 0.184, React Three Fiber 9.6, Drei 10.7, Postprocessing 3.0 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Icons | Lucide React 1.8 |
| Language | TypeScript 5 |
| State | Zustand 5 (via transitive dep) + React Context |
| Storage | Cloudflare KV + Cloudflare R2 |
| Deployment | Cloudflare Pages (edge runtime) |
| Testing | Vitest 4.1 + jsdom 29 + Testing Library (DOM 10.4, React 16.3) |
| AI | MiniMax abab6.5s-chat (primary) + Google Gemini 1.5 Flash (fallback) |
| Blog | WordPress REST API (wp.adduckivity.com) |

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
npm run test      # run 94 tests
npm run deploy    # typecheck + build (next-on-pages) + deploy to Cloudflare Pages
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
- **Unified SystemBar:** All pages use the global SystemBar from `layout.tsx`
- **Sticky Header:** Fixed positioning with backdrop blur and border
- **Responsive:** Desktop navigation links
- **Consistent Links:** Blog, 3D Experience, Tools across all pages

---

## Cloudflare Pages Constraints

All API routes and server-rendered pages MUST use `export const runtime = 'edge'`. Routes using `runtime = 'nodejs'` or depending on `fs`/`path`/`crypto` will fail deployment.

The free tier has a 3 MiB worker bundle limit. Adding middleware may push the total over this limit — prefer client-side checks when possible (e.g., `/os` localhost restriction via hostname check).

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

*Last updated: 2026-05-08 — Full documentation audit: WordPress blog, Ignition sequence, OS Launchpad, gradient lock model, shared components, 94 tests, guide pages*
