# Project Documentation: Adduckivity

**Last updated:** 2026-04-29 (Dynamic Homepage Grid)  
**Production URL:** https://immersive.adduckivity.com

---

## 1. Architecture Overview

Edge-first content platform combining immersive 3D storytelling with a built-in CMS, AI assistant, and newsletter integration. Detailed architectural decisions are documented in `ArchitecturalAnalysis.md`.

| Layer | Tech |
|---|---|
| Frontend | Next.js 16.2 App Router + React Three Fiber |
| Runtime | Cloudflare Pages (edge, `@cloudflare/next-on-pages`) |
| Storage | Cloudflare KV (`POSTS_KV`) + Cloudflare R2 (`ASSETS_BUCKET`) |
| AI | Google Gemini 2.0 Flash |
| Newsletter | SendFox API |
| Social | Facebook Graph API v19.0 |

---

## 2. Module Documentation

### `src/lib/posts.ts`
KV-backed post CRUD. All functions accept `KVNamespace` as first arg.

| Function | Description |
|---|---|
| `readingTime(content)` | Returns `"< 1 min read"` for <200 words, else `"N min read"`. Strips markdown syntax before counting. |
| `toSlug(title)` | Lowercase, trim, strip non-alphanumeric, collapse hyphens, remove leading/trailing hyphens. Max 60 chars. |
| `isPostLive(post)` | Returns `true` if `published`, or `scheduled` with `scheduledAt <= now` |
| `getAllPosts(kv)` | All posts sorted newest-first |
| `getPublishedPosts(kv)` | Filtered to `status === 'published'` |
| `getPostBySlug(kv, slug)` | Returns `Post \| null` |
| `savePost(kv, input)` | Upsert — merges with existing, auto-fills defaults |
| `updatePost(kv, slug, input)` | Patch — handles slug rename (deletes old key) |
| `deletePost(kv, slug)` | Returns `boolean` |
| `slugExists(kv, slug)` | Returns `boolean` |

### `src/lib/content.ts`
Build-time file-system loader (reads `public/content/*.md` via gray-matter). Used for static pages only.

### `src/lib/dev-kv.ts`
In-memory `KVNamespace` mock for local development. Auto-used when `NODE_ENV === 'development'`.

### `src/lib/gemini.ts`
Gemini API wrapper. Called by `/api/ai` — never exposed to client.

### `src/app/api/upload/route.ts`
Uploads images to Cloudflare R2 (`ASSETS_BUCKET`). Returns `{ url: "https://immersive.adduckivity.com/api/assets/uploads/..." }`. Dev fallback: returns base64 data URL.

### `src/app/api/assets/[...key]/route.ts`
Serves files from R2 by key. `Cache-Control: public, max-age=31536000, immutable`.

### `src/app/page.tsx`
The dynamic homepage. An `async` Server Component (`runtime: 'edge'`) that fetches live protocols from KV, pins the "Emergency Recovery" card first, and renders the "Explore Protocols" grid.

### `src/components/FlywheelScene.tsx`
3D torus flywheel. Takes `scrollProgress: number` prop — syncs rotation and particle density to scroll position.

### `src/components/EmergencyProtocol.tsx`
Interactive recovery tool for executive dysfunction. Features a 5-step guided sequence including a 30-minute timer and physical task checklist. Uses `framer-motion` for state transitions.

### `src/components/editor/EditorShared.tsx`
Shared CMS UI primitives: `SideSection`, `Field`, `AISection`, `ProgressBar`, `ToolBtn`, `CoverImagePicker`, `ConfirmModal`.

---

## 3. API Reference

### `POST /api/subscribe`
Subscribe email to SendFox list.

**Request:** `{ email: string }`  
**Response:** `{ success: true }` or `{ error: string }`  
**Notes:** 422 from SendFox (already subscribed) returns `{ success: true }`

### `PUT /api/posts?slug=`
Upsert post (creates if not found in KV). Triggers Facebook auto-post on first publish.

**Response includes:** `{ ...post, facebook?: { ok: boolean, error?: string } }`

### `POST /api/posts/save`
Upsert for new post auto-save and publish. Also returns `facebook` field on first publish.

### `POST /api/upload`
Upload image to R2. Returns `{ url }` as absolute `https://` URL.

### `GET /api/assets/[...key]`
Serve R2 asset by key path.

### `POST /api/ai`
Gemini AI assistant proxy. Model: `gemini-2.0-flash`.

**Actions:** `titles | excerpt | outline | seo | tags`

---

## 4. Local Development

```bash
cd apps/immersive/momentum-3d
npm run dev        # http://localhost:3000
npm run test       # Vitest — 32 tests
npm run deploy     # Build + deploy to Cloudflare Pages
```

### `.env.local` required keys
```
GEMINI_API_KEY=
UNSPLASH_ACCESS_KEY=
SENDFOX_API_TOKEN=
SENDFOX_LIST_ID=614719
```

Facebook and SITE_URL only needed for testing auto-post locally.

---

## 5. Deployment

### Normal flow
```bash
# On dev branch — develop + test
npm run test

# Merge to main
git checkout main && git merge dev

# Deploy production
cd apps/immersive/momentum-3d && npm run deploy
```

### Cloudflare environment variables
All secrets must be set in **Cloudflare Dashboard → Pages → immersive-adduckivity → Settings → Environment variables**:

```
GEMINI_API_KEY
UNSPLASH_ACCESS_KEY
FACEBOOK_PAGE_ACCESS_TOKEN
FACEBOOK_PAGE_ID
SITE_URL=https://immersive.adduckivity.com
SENDFOX_API_TOKEN
SENDFOX_LIST_ID
```

> After adding new env vars, always redeploy — Cloudflare loads env at deploy time, not at runtime.

### KV Namespace (`wrangler.toml`)
```toml
[[kv_namespaces]]
binding = "POSTS_KV"
id = "a07209b5ad9a4972aa82a30d0af3071e"
```

---

## 6. Known Behaviours

- **Facebook auto-post** fires only on first publish (`draft → published`). Re-saving a published post does not re-post. Facebook image comes from OG meta tags on the blog post page — use Facebook Sharing Debugger to force re-scrape after first publish.
- **`toSlug`** strips leading/trailing hyphens AFTER `.slice(0, 60)` — prevents trailing `-` on long titles.
- **Tags** — `#` prefix is stripped on save. Blog renders tags as `#tag` so storing raw tag names (no `#`) is required.
- **Image uploads** — stored in Cloudflare R2 (`immersive-assets` bucket), served via `/api/assets/`. Dev environment falls back to base64 data URL.
- **OG meta tags** — generated dynamically in `blog/[slug]/page.tsx` via `generateMetadata`. Only `https://` image URLs are included (not data: URLs).
- **Scheduled posts** — `status: 'scheduled'` + `scheduledAt` ISO datetime. `isPostLive()` checks time at request; no cron/background job needed. Facebook auto-post does not fire at scheduled time.
- **`readingTime`** strips `# * \` [ ]` markdown chars before counting words.
- **Dev KV** is in-memory and resets on server restart.
- **`/content` routes** have no authentication — unlinked from public nav only.

---

## 7. Test Suite

```bash
npm run test        # single run
npm run test:watch  # watch mode
```

| File | Tests |
|---|---|
| `src/lib/posts.test.ts` | 6 — toSlug, readingTime (legacy) |
| `src/__tests__/posts.pure.test.ts` | 12 — readingTime, toSlug |
| `src/__tests__/posts.kv.test.ts` | 14 — full KV CRUD |

**Total: 32 passing**
