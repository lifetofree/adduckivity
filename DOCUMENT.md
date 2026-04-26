# Project Documentation: Adduckivity (Immersive Momentum)

## 1. Project Overview
Adduckivity is a high-performance content platform designed for immersive storytelling. It combines the speed of edge computing with interactive 3D visualizations to create a unique "Momentum" protocol for content consumption.

### Key Features
- **Edge-First Architecture**: Built on Cloudflare Pages and KV for sub-100ms response times globally.
- **AI-Powered Editor**: Real-time content assistance (SEO, tagging, excerpts) powered by Google Gemini.
- **Immersive 3D Flywheel**: A scroll-synced 3D environment that visualizes the concept of "Momentum".
- **Minimalist CMS**: Simple, JSON-based storage using Cloudflare KV.

---

## 2. Technical Architecture
The system is designed for maximum efficiency and scalability.

- **Frontend**: Next.js (App Router) with React Three Fiber (R3F) for 3D rendering.
- **Logic**: Edge Functions (`next-on-pages`) running on Cloudflare's global network.
- **Storage**: Cloudflare KV for metadata and post content.
- **Integrations**: 
  - Google Gemini API (`gemini-1.5-flash` and `gemini-2.0-flash-exp`) for intelligence.
  - Unsplash API for high-quality visual assets.

---

## 3. Module Documentation

### `src/lib/posts.ts`
Core logic for post management and persistence.
- `toSlug(title: string)`: URL-safe slug generation (with whitespace/dash trimming).
- `getAllPosts(kv)`: High-performance retrieval from Cloudflare KV.
- `savePost(kv, input)`: Atomically updates post content and metadata.

### `src/lib/gemini.ts`
AI orchestration layer.
- `suggestTitles(content)`: SEO-driven title generation.
- `autoExcerpt(title, content)`: Automated meta-description creation.
- `suggestTags(title, content)`: Semantic tag extraction.

### `src/components/FlywheelScene.tsx`
The primary visual engine.
- Renders a 3D torus-based flywheel.
- Syncs rotation and particle density with `scrollProgress`.

---

## 4. Developer Guide

### Installation
```bash
npm install
# Note: Use --legacy-peer-deps if Next.js version conflicts occur with Cloudflare types
```

### Running Tests
This project uses **Vitest** for unit testing.
```bash
npm run test          # Run in watch mode
npm run test -- --run # Run once
```

### Deployment
Deployment is automated via Cloudflare Pages.
```bash
npm run deploy
```

---

## 5. Code Review & Recommendations

### Security Flaws
- **Critical**: `lib/gemini.ts` uses `NEXT_PUBLIC_GEMINI_API_KEY`. This exposes your Google AI key to the client-side. **Fix**: Move all Gemini calls to the server-side API routes (which already use secure environment variables).

### Performance Bottlenecks
- **3D Rendering**: `FlywheelScene` currently updates via `useEffect`. For smoother 60FPS performance, consider refactoring to use the `useFrame` hook from `@react-three/fiber` to offload rotation logic to the render loop.

### Future Roadmap
- **R2 Integration**: Shift image uploads from local/external to Cloudflare R2 for better control.
- **D1 Database**: If relational queries are needed, migrate KV metadata to Cloudflare D1.
