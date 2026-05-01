/** Shape of a CMS post stored in Cloudflare KV. */
export interface Post {
  slug: string
  title: string
  /** Publication date — YYYY-MM-DD. Stamped on first publish. */
  date: string
  /** Full publication timestamp — ISO datetime for precise sorting. */
  publishedAt?: string
  /** Content category: protocol | tutorial | case-study | system */
  category: string
  /** Three.js scene variant for the blog reading view. */
  scene: string
  /** Emotional tone used for UI theming. */
  mood: string
  excerpt: string
  tags: string[]
  featuredImage: string
  imageAlt?: string
  author: string
  /** Auto-calculated from word count, e.g. "5 min read". */
  readingTime: string
  status: 'draft' | 'published' | 'scheduled'
  /** ISO datetime — only present when status is 'scheduled'. */
  scheduledAt?: string
  /** True after the post has been successfully shared to Facebook. */
  facebookPosted?: boolean
  content: string
}

/**
 * Returns true if a post should be visible to public readers right now.
 * A scheduled post becomes live once its `scheduledAt` time has passed.
 *
 * @param post - The post to evaluate.
 */
export function isPostLive(post: Post): boolean {
  if (post.status === 'published') return true
  if (post.status === 'scheduled' && post.scheduledAt) {
    return new Date(post.scheduledAt) <= new Date()
  }
  return false
}

/**
 * Estimates reading time from raw markdown content.
 * Assumes 200 words per minute; strips common markdown syntax before counting.
 *
 * @param content - Raw markdown or text content.
 * @returns Formatted string, e.g. `"5 min read"` or `"< 1 min read"`.
 */
export function readingTime(content: string): string {
  const words = content.replace(/[#*`[\]]/g, '').split(/\s+/).filter(Boolean).length
  if (words < 200) return '< 1 min read'
  return `${Math.ceil(words / 200)} min read`
}

/**
 * Converts a post title into a URL-safe slug.
 * Lowercases, removes special characters, collapses whitespace to dashes,
 * and truncates at 60 characters.
 *
 * @param title - The post title to convert.
 * @returns A clean, URL-friendly slug string.
 */
export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/^-+|-+$/g, '')
}

/**
 * Scans markdown content for Google Drive image links, downloads each image,
 * uploads it to Cloudflare R2, and replaces the Drive URL with the R2 URL.
 * No-ops if `ASSETS_BUCKET` is not bound or no Drive URLs are found.
 *
 * @param env - Cloudflare environment bindings (needs `ASSETS_BUCKET`).
 * @param content - Raw markdown content to process.
 * @returns Updated markdown with Drive URLs replaced by R2 asset URLs.
 */
export async function importGoogleDriveImages(
  env: CloudflareEnv | undefined,
  content: string
): Promise<string> {
  if (!env?.ASSETS_BUCKET) return content

  const driveImageRegex = /!\[([^\]]*)\]\((https?:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view)\)/g
  const matches = [...content.matchAll(driveImageRegex)]

  if (matches.length === 0) return content

  const siteUrl = env.SITE_URL || 'https://immersive.adduckivity.com'
  let processedContent = content

  for (const match of matches) {
    const originalUrl = match[2]

    try {
      const fileIdMatch = originalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
      if (!fileIdMatch) continue

      const directUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`

      const response = await fetch(directUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        redirect: 'follow',
      })

      if (!response.ok) {
        console.error('[Import] Failed to fetch image:', response.status)
        continue
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg'
      const buffer = await response.arrayBuffer()

      const extMap: Record<string, string> = {
        'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
        'image/webp': 'webp', 'image/svg+xml': 'svg',
      }
      const ext = extMap[contentType] || 'jpg'
      const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      await env.ASSETS_BUCKET.put(key, buffer, { httpMetadata: { contentType } })

      processedContent = processedContent.replace(originalUrl, `${siteUrl}/api/assets/${key}`)
      console.log('[Import] Downloaded and stored image:', key)
    } catch (err) {
      console.error('[Import] Error importing image:', err)
    }
  }

  return processedContent
}

/**
 * Shares a post to the Facebook Page feed via the Graph API v19.0.
 * Skipped automatically in development. Returns `{ ok: false }` if env vars are missing.
 *
 * @param env - Cloudflare env (needs `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`, `SITE_URL`).
 * @param post - Post metadata used to compose the Facebook message.
 * @returns `{ ok: true }` on success, `{ ok: false, error }` on failure.
 */
export async function postToFacebook(
  env: CloudflareEnv,
  post: { title: string; excerpt: string; slug: string; featuredImage?: string }
): Promise<{ ok: boolean; error?: string }> {
  if (process.env.NODE_ENV === 'development') return { ok: false, error: 'skipped in dev' }

  const token   = env.FACEBOOK_PAGE_ACCESS_TOKEN
  const pageId  = env.FACEBOOK_PAGE_ID
  const siteUrl = env.SITE_URL || 'https://immersive-adduckivity.pages.dev'

  if (!token) return { ok: false, error: 'FACEBOOK_PAGE_ACCESS_TOKEN not set' }
  if (!pageId) return { ok: false, error: 'FACEBOOK_PAGE_ID not set' }

  const link    = `${siteUrl}/blog/${post.slug}`
  const message = `🦆 ${post.title}\n\n${post.excerpt}\n\nRead the full protocol → ${link}\n\n#DuckOS #Productivity #ADHD #Neurodivergent`

  const params = new URLSearchParams({ message, link, access_token: token })
  // Facebook deprecated the 'picture' param — OG tags on the linked page are auto-scraped.

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      body: params,
    })

    const data = await res.json() as { id?: string; error?: { message: string } }
    if (!res.ok || data.error) {
      const msg = data.error?.message || `HTTP ${res.status}`
      console.error('[Facebook] Post failed:', msg)
      return { ok: false, error: msg }
    }

    console.log('[Facebook] Posted successfully:', data.id)
    return { ok: true }
  } catch (err) {
    console.error('[Facebook] Fetch error:', err)
    return { ok: false, error: String(err) }
  }
}

/**
 * Retrieves all posts from KV, sorted newest-first by date and timestamp.
 *
 * @param kv - Cloudflare KV namespace binding.
 * @returns Array of all `Post` objects.
 */
export async function getAllPosts(kv: KVNamespace): Promise<Post[]> {
  const list = await kv.list({ prefix: 'post:' })
  const posts = await Promise.all(
    list.keys.map(({ name }) => kv.get(name, 'json') as Promise<Post | null>)
  )
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => {
      // First try to sort by publishedAt timestamp if both have it
      if (a.publishedAt && b.publishedAt) {
        return a.publishedAt < b.publishedAt ? 1 : -1
      }
      // Fall back to date field for backwards compatibility
      if (a.date !== b.date) {
        return a.date < b.date ? 1 : -1
      }
      // If dates are the same, maintain stable sort
      return 0
    })
}

/**
 * Checks each scheduled post in the array; any whose `scheduledAt` is now in the
 * past is promoted to `published`, persisted to KV, and optionally shared to Facebook.
 * A 10-minute KV lock prevents duplicate Facebook posts under concurrent requests.
 *
 * @param kv  - Cloudflare KV namespace.
 * @param posts - Array of posts to evaluate.
 * @param env - Optional Cloudflare env for Facebook posting.
 * @returns Updated array with promoted posts reflected.
 */
export async function promoteScheduledPosts(kv: KVNamespace, posts: Post[], env?: CloudflareEnv): Promise<Post[]> {
  const now = new Date()
  return Promise.all(posts.map(async post => {
    if (post.status !== 'scheduled' || !post.scheduledAt) return post
    const t = new Date(post.scheduledAt)
    if (isNaN(t.getTime()) || t > now) return post

    const promotedDate = t.toISOString().split('T')[0]
    let facebookPosted = post.facebookPosted
    console.log(`[CMS] Promoting scheduled post: ${post.slug} (scheduled for ${post.scheduledAt})`)

    if (env && !facebookPosted) {
      const lockKey = `lock:fb:${post.slug}`
      const locked = await kv.get(lockKey)
      if (!locked) {
        await kv.put(lockKey, '1', { expirationTtl: 600 })
        const fb = await postToFacebook(env, { ...post, slug: post.slug })
        if (fb.ok) facebookPosted = true
      }
    }

    const promoted = {
      ...post,
      status: 'published' as const,
      scheduledAt: undefined,
      date: promotedDate,
      publishedAt: post.scheduledAt, // Use the scheduled time as the published timestamp
      facebookPosted,
    }

    try {
      await kv.put(`post:${post.slug}`, JSON.stringify(promoted))
    } catch (err) {
      console.error(`[CMS] Failed to save promoted post ${post.slug}:`, err)
    }
    return promoted
  }))
}

/**
 * Returns only published posts, triggering scheduled-post promotion first.
 * Sorted newest-first by date.
 *
 * @param kv  - Cloudflare KV namespace.
 * @param env - Optional env for Facebook posting on promotion.
 */
export async function getPublishedPosts(kv: KVNamespace, env?: CloudflareEnv): Promise<Post[]> {
  const all = await promoteScheduledPosts(kv, await getAllPosts(kv), env)
  return all.filter(p => p.status === 'published').sort((a, b) => (a.date < b.date ? 1 : -1))
}

/**
 * Fetches a single post by slug from KV.
 *
 * @param kv   - Cloudflare KV namespace.
 * @param slug - The post slug to look up.
 * @returns The `Post` if found, otherwise `null`.
 */
export async function getPostBySlug(kv: KVNamespace, slug: string): Promise<Post | null> {
  return kv.get(`post:${slug}`, 'json') as Promise<Post | null>
}

/**
 * Creates or fully replaces a post in KV.
 * Merges with any existing record — `date` is stamped today only on the first
 * transition to `published`. `readingTime` is always recalculated from content.
 *
 * @param kv    - Cloudflare KV namespace.
 * @param input - Partial post data; `slug`, `title`, and `content` are required.
 * @returns The saved `Post` with all fields populated.
 */
export async function savePost(
  kv: KVNamespace,
  input: Partial<Post> & { slug: string; title: string; content: string }
): Promise<Post> {
  const existing = await getPostBySlug(kv, input.slug)
  const now = new Date().toISOString().split('T')[0]
  const nowISO = new Date().toISOString()
  const merged = { ...existing, ...input }
  
  // Set publishedAt timestamp on first publish
  const isFirstPublish = merged.status === 'published' && existing?.status !== 'published'
  
  const post: Post = {
    slug:          merged.slug,
    title:         merged.title,
    date:          isFirstPublish ? now : (merged.date || now),
    publishedAt:   isFirstPublish ? nowISO : merged.publishedAt,
    category:      merged.category      || 'uncategorized',
    scene:         merged.scene         || 'default',
    mood:          merged.mood          || 'neutral',
    excerpt:       merged.excerpt       || '',
    tags:          merged.tags          || [],
    featuredImage: merged.featuredImage || '',
    imageAlt:      merged.imageAlt,
    author:        merged.author        || 'Adduckivity',
    readingTime:   readingTime(merged.content),
    status:        merged.status        || 'draft',
    scheduledAt:   merged.scheduledAt,
    facebookPosted: merged.facebookPosted,
    content:       merged.content,
  }
  await kv.put(`post:${post.slug}`, JSON.stringify(post))
  return post
}

/**
 * Applies a partial update to an existing post.
 * Supports slug renames — the old key is deleted when the slug changes.
 *
 * @param kv    - Cloudflare KV namespace.
 * @param slug  - Current slug of the post to update.
 * @param input - Fields to overwrite.
 * @returns The updated `Post`, or `null` if the slug was not found.
 */
export async function updatePost(
  kv: KVNamespace,
  slug: string,
  input: Partial<Post>
): Promise<Post | null> {
  const existing = await getPostBySlug(kv, slug)
  if (!existing) return null
  const newSlug = input.slug && input.slug !== slug ? input.slug : slug
  if (newSlug !== slug) await kv.delete(`post:${slug}`)
  return savePost(kv, { ...existing, ...input, slug: newSlug })
}

/**
 * Deletes a post from KV by slug.
 *
 * @param kv   - Cloudflare KV namespace.
 * @param slug - Slug of the post to delete.
 * @returns `true` if deleted, `false` if the slug was not found.
 */
export async function deletePost(kv: KVNamespace, slug: string): Promise<boolean> {
  const existing = await getPostBySlug(kv, slug)
  if (!existing) return false
  await kv.delete(`post:${slug}`)
  return true
}

/**
 * Checks whether a given slug is already in use.
 *
 * @param kv   - Cloudflare KV namespace.
 * @param slug - Slug to check.
 * @returns `true` if a post with that slug exists.
 */
export async function slugExists(kv: KVNamespace, slug: string): Promise<boolean> {
  const post = await getPostBySlug(kv, slug)
  return post !== null
}
