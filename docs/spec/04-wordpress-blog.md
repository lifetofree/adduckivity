# System Spec: WordPress Blog Integration

**Last updated:** 2026-05-11  
**Files:** `src/lib/wordpress.ts`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`

---

## Purpose

Blog section (`/blog`) fetches published posts from a WordPress site (`wp.adduckivity.com`) via the WordPress REST API v2. WordPress is the content source; Duck OS renders them.

---

## Data Flow

```
WordPress REST API → getWordPressPosts() → formatWordPressPost() → Blog page render
```

---

## Key Functions

| Function | Description |
|---|---|
| `getWordPressPosts({ perPage })` | Fetch posts from `wp.adduckivity.com/wp-json/wp/v2/posts` |
| `formatWordPressPost(wpPost)` | Convert WP post to Duck OS blog format |
| `getCategoryName(wpPost)` | Extract first category from `_embedded.wp:term` |
| `getPostTags(wpPost)` | Extract tags array |
| `getFeaturedImageUrl(wpPost)` | Get best available image URL |
| `getFeaturedImageAlt(wpPost)` | Get image alt text |
| `stripHtml(html)` | Strip HTML tags |
| `calculateReadingTime(html)` | Estimate reading time |
| `isEnglishPost(wpPost)` | Filter out Thai-language content |

---

## SEO Integration

Pulls from Yoast `yoast_head_json` and Jetpack `meta` fields embedded in the WordPress response:
- `seoTitle` → `yoast_head_json.title`
- `seoDesc` → `yoast_head_json.description`

No per-post HTML fetch for SEO (removed to fix N+1 issue). SEO data comes from the embedded response.

---

## SSRF Protection

`getPostSeoFromHtml()` fetches og:title/og:description from post HTML using a host allowlist. Returns empty if the URL host is not in the allowlist.

---

## Caching

Next.js `revalidate: 300` (5 minutes) on blog pages.

---

## Routing

| Route | Runtime | Notes |
|---|---|---|
| `/blog` | `edge` + `force-dynamic` | Fetches WP posts, no local KV |
| `/blog/[slug]` | `edge` + `force-dynamic` | Fetches from KV for related posts |

Note: `/blog` and `/blog/[slug]` use edge runtime but are marked `force-dynamic` to prevent static generation, since blog content changes on WordPress side between revalidations.
