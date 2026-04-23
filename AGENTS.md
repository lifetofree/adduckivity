# 🦆 Duck OS Project Agents & Specifications

## Project Overview

**Vision:** One-person business powered by systems, not hustle.

**Mission:** Build passive income through content, digital products, and tools that help neurodivergent creators design their lives with systems.

**Target Audience:** Burned-out creators, ADHD/MDD folks, systems thinkers, people who need more than motivation.

---

## Current Projects

### 1. Immersive 3D Content Studio (`apps/immersive`)
**Status:** 🚧 Active Development  
**URL:** immersive.adduckivity.com  
**Tech:** Next.js 16 + React Three Fiber + Cloudflare Pages

**Content:**
- Momentum Protocol (ACT-04) — First 3D article ✅
- Flow State Architecture — Coming soon
- Digital Declutter (SURV-01) — Coming soon
- System Awareness — Coming soon

**Monetization:** Email capture → Duck OS Starter Kit → Paid products

#### Content Management System (built-in)

A full headless CMS lives inside the app itself. Posts are markdown files in `public/content/` with gray-matter frontmatter.

**Routes — public (visitors):**
| Route | Audience | Purpose |
|---|---|---|
| `/blog` | Everyone | Published posts only — card grid, no admin UI |
| `/blog/[slug]` | Everyone | Reading view — prose, related posts, tags. Drafts return 404. |

**Routes — owner/admin:**
| Route | Audience | Purpose |
|---|---|---|
| `/content` | Owner | CMS dashboard — all posts (draft + published), stats row, status badges, "Edit →" |
| `/content/new` | Owner | New post editor — auto-save, slug field, Unsplash cover picker, AI assistant |
| `/content/[slug]` | Owner | Edit page — auto-save (4s), Save Draft, Publish/Unpublish with modals, status badge |

> **Auth note:** `/content` routes are not publicly linked — no hard auth yet. Add Next.js middleware on `/content/*` for password protection when needed.

**API routes** (`src/app/api/`):
| Route | Method | Purpose |
|---|---|---|
| `/api/posts` | GET | List all posts or fetch by `?slug=` |
| `/api/posts/[slug]` | PUT, DELETE | Update or delete a post |
| `/api/posts/save` | POST | Upsert (auto-save, preserves status) |
| `/api/ai` | POST | Gemini 1.5 Flash proxy — titles, excerpt, outline, seo, tags |
| `/api/unsplash` | GET | Unsplash search proxy |

**Shared editor components** (`src/components/editor/`):
- `theme.ts` — single ET palette source of truth
- `EditorShared.tsx` — SideSection, Field, AISection, ProgressBar, ToolBtn, Divider, CoverImagePicker, ConfirmModal

**Post frontmatter schema:**
```yaml
title, slug, date, category, scene, mood,
excerpt, tags[], featuredImage, author,
readingTime, status (draft | published)
```

**Required env vars:**
```
GEMINI_API_KEY=       # Google Gemini 1.5 Flash
UNSPLASH_ACCESS_KEY=  # Unsplash API
```

---

### 2. DuckShort.cc (URL Shortener)
**Status:** ✅ Live  
**URL:** duckshort.cc  
**Tech:** Cloudflare Workers + D1  
**Purpose:** Proof of concept, personal tool, content case study

---

## Tech Stack Specifications

### Frontend
- **Framework:** Next.js 16.2 (App Router, Turbopack)
- **3D:** Three.js 0.184, React Three Fiber 9, Drei 10
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion 12
- **Language:** TypeScript 5

### Content System
- **Storage:** Markdown files in `public/content/` (gray-matter frontmatter)
- **AI:** Google Gemini 1.5 Flash via `@google/generative-ai`
- **Images:** Unsplash API (server-side proxy)
- **Status flow:** draft → published → draft (with confirmation modals)

### Backend  
- **API:** Next.js API routes (server-side, no client-side secrets)
- **Deployment:** Cloudflare Pages

### 3D Component Library (40+ components, phased)
**Phase 1 (15 components):**
- UDO duck character (3 poses)
- Gear/flywheel systems (animated)
- Minimal environments
- Particle effects (3 types)
- Text animations

---

## Content Strategy

### Funnel Structure
1. **Top:** 3D immersive articles (free value, SEO)
2. **Middle:** Email capture (Duck OS Starter Kit)
3. **Bottom:** Digital products + community (revenue)

### Content Types
- **Immersive storytelling** - 3D experiences that teach protocols
- **Practical tutorials** - Step-by-step systems
- **Case studies** - Real applications of Duck OS
- **System in Action** - Behind-the-scenes of building tools

---

## Monetization Strategy

### Phase 1: Digital Products (Passive)
- **Free:** Duck OS Starter Kit (PDF + Notion template)
- **$29:** Duck OS System Blueprint (Complete guide)
- **$49:** Notion System Templates (Asset library)
- **$99:** Video Course: Design Your Life OS

### Phase 2: Community (Recurring)
- **$29/mo:** System Architects membership
- Weekly protocols, community challenges, Q&A

### Phase 3: Tools (SaaS)
- PeakFlowStat (monitoring)
- Duck OS app (habit tracker, system builder)
- Other utilities

---

## Development Workflow

### AI-Assisted Development (Vibe Coding)
1. **Ideation:** UDO (AI co-founder) challenges concepts
2. **Implementation:** AI generates code, human refines
3. **Testing:** Local development, performance optimization
4. **Deployment:** Cloudflare Pages automatic deployment
5. **Iteration:** Based on real usage data

### Project Management
- **Energy-based sprints:** Work according to energy levels (1-10)
- **MVP-first thinking:** Ship minimal version, iterate later
- **Asset protection:** Time, energy, attention are precious
- **Systems over willpower:** Processes beat motivation

---

## AI Systems

### UDO - AI Co-Founder
**File:** UDO-SYSTEM.md  
**Role:** Stoic architect, energy-aware guardian, full creative partner

UDO embodies:
- Stoic philosophy + systems thinking + neuroscience
- ADHD/MDD awareness and accommodation
- Energy-based work planning
- MVP-first architecture
- Asset protection focus

---

## Performance Targets

- **Load time:** <3 seconds
- **Frame rate:** 60 FPS for 3D scenes
- **Mobile:** Fully responsive, touch-friendly
- **SEO:** Server-side rendering, fast first paint

---

## Repository Structure

```
adduckivity/
├── apps/
│   ├── immersive/         # 3D content studio
│   ├── landing/           # Main landing page
│   └── tools/             # Future tools and apps
├── packages/
│   ├── ui-components/     # Shared React components
│   ├── 3d-assets/         # Shared Three.js components
│   └── content/           # Shared content and protocols
├── skills/                # AI agent skills
├── AGENTS.md              # This file
├── UDO-SYSTEM.md          # AI co-founder system
└── README.md              # Project overview
```

---

## Core Philosophy

**Duck OS = Life Design System**

- **Systems over willpower** - Processes beat motivation
- **Asset-building** - Create reusable value
- **Momentum over motivation** - Action creates inspiration
- **Awareness over automation** - Understand before you optimize
- **Rest is productive** - Recovery is a system component

---

**Built by one person with AI systems, not hustle.**

*Last updated: 2026-04-23 — added public/owner route split*
