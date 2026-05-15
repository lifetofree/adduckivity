# System Spec: Posts / CMS

**Last updated:** 2026-05-11  
**Files:** `src/lib/posts.ts`, `src/app/api/posts/route.ts`, `src/app/api/posts/save/route.ts`, `src/app/api/posts/maintenance/route.ts`

---

## Tech Spec

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js 16.2 App Router (Edge Runtime) |
| Storage | Cloudflare KV (`POSTS_KV` binding) |
| R2 | Cloudflare R2 (`ASSETS_BUCKET` binding) |
| Mock | `src/lib/dev-kv.ts` (in-memory, `NODE_ENV=development`) |
| HTTP | Facebook Graph API, native `fetch` |

---

## Purpose

Full CRUD for Duck OS content — posts stored in Cloudflare KV, with scheduled publishing, Facebook auto-post, and R2 image management.

---

## Post Schema

```typescript
interface Post {
  slug: string
  title: string
  date: string               // YYYY-MM-DD
  publishedAt?: string       // ISO datetime — set on first publish
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

## KV Operations

| Function | Description |
|---|---|
| `getAllPosts(kv)` | All posts sorted by `publishedAt DESC` |
| `getPublishedPosts(kv)` | Live posts + promoted overdue scheduled |
| `getPostBySlug(kv, slug)` | Single post |
| `savePost(kv, post)` | Create or update with auto-calculated `readingTime` |
| `updatePost(kv, slug, patch)` | Partial update; handles slug rename |
| `deletePost(kv, slug)` | Delete post + associated R2 images |
| `slugExists(kv, slug)` | Check slug availability |
| `promoteScheduledPosts(kv, posts, env)` | Promote overdue `scheduled` → `published` |

---

## API Routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/posts` | GET | — | List all or fetch by `?slug=` |
| `/api/posts` | PUT | `x-admin-key` | Update post + Facebook auto-post on first publish |
| `/api/posts` | DELETE | `x-admin-key` | Delete post + R2 images; 403 if published |
| `/api/posts/save` | POST | `x-admin-key` | Upsert (auto-save, preserves status) |
| `/api/posts/maintenance` | GET | `?key=` | Promote overdue scheduled posts (cron target) |

---

## Facebook Auto-Post

- Triggers when a post transitions to `published` for the first time
- `facebookPosted` flag + KV-based lock prevents duplicate posts
- Uses `FACEBOOK_PAGE_ACCESS_TOKEN` and `FACEBOOK_PAGE_ID`
- On CF Pages: `CF_PAGES=1` env var detected; Facebook posting skipped locally

---

## Image Deletion

On post delete, scans `content` and `featuredImage` for `/api/assets/` URLs, extracts keys, and issues `DELETE` requests to R2.

---

## Scheduled Publishing

Posts with `status: 'scheduled'` and `scheduledAt` are auto-promoted to `published` when fetched via `getPublishedPosts()` or via `/api/posts/maintenance` (hit by external cron every hour).
