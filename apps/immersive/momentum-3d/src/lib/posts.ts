export interface Post {
  slug: string
  title: string
  date: string
  category: string
  scene: string
  mood: string
  excerpt: string
  tags: string[]
  featuredImage: string
  imageAlt?: string
  author: string
  readingTime: string
  status: 'draft' | 'published' | 'scheduled'
  scheduledAt?: string  // ISO datetime — only used when status is 'scheduled'
  facebookPosted?: boolean
  content: string
}

export function isPostLive(post: Post): boolean {
  if (post.status === 'published') return true
  if (post.status === 'scheduled' && post.scheduledAt) {
    return new Date(post.scheduledAt) <= new Date()
  }
  return false
}
/**
 * Calculates the estimated reading time for a given content string.
 * @param content - The raw markdown or text content.
 * @returns A formatted string (e.g., "5 min read").
 */
export function readingTime(content: string): string {
  const words = content.replace(/[#*`[\]]/g, '').split(/\s+/).filter(Boolean).length
  if (words < 200) return '< 1 min read'
  return `${Math.ceil(words / 200)} min read`
}

/**
 * Converts a string into a URL-friendly slug.
 * @param title - The title to convert.
 * @returns A lowercase string with special characters removed and spaces replaced by dashes.
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
 * Posts to Facebook page using the Graph API.
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
  if (post.featuredImage?.startsWith('http')) params.set('picture', post.featuredImage)
  
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
 * Retrieves all posts from the Cloudflare KV store.
 * @param kv - The Cloudflare KV namespace binding.
 * @returns A promise resolving to an array of Post objects, sorted by date.
 */
export async function getAllPosts(kv: KVNamespace): Promise<Post[]> {
  const list = await kv.list({ prefix: 'post:' })
  const posts = await Promise.all(
    list.keys.map(({ name }) => kv.get(name, 'json') as Promise<Post | null>)
  )
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}


export async function promoteScheduledPosts(kv: KVNamespace, posts: Post[], env?: CloudflareEnv): Promise<Post[]> {
  const now = new Date()
  return Promise.all(posts.map(async post => {
    if (post.status !== 'scheduled' || !post.scheduledAt) return post
    const t = new Date(post.scheduledAt)
    if (isNaN(t.getTime()) || t > now) return post
    
    // Use the scheduled time as the new publish date (YYYY-MM-DD)
    const promotedDate = t.toISOString().split('T')[0]
    
    let facebookPosted = post.facebookPosted
    console.log(`[CMS] Promoting scheduled post: ${post.slug} (scheduled for ${post.scheduledAt})`)

    // Attempt to post to Facebook if not already done
    if (env && !facebookPosted) {
      const lockKey = `lock:fb:${post.slug}`
      const locked = await kv.get(lockKey)
      if (!locked) {
        // Simple lock for 10 minutes to reduce race conditions
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
      facebookPosted 
    }
    
    try { 
      await kv.put(`post:${post.slug}`, JSON.stringify(promoted)) 
    } catch (err) {
      console.error(`[CMS] Failed to save promoted post ${post.slug}:`, err)
    }
    return promoted
  }))
}

export async function getPublishedPosts(kv: KVNamespace, env?: CloudflareEnv): Promise<Post[]> {
  const all = await promoteScheduledPosts(kv, await getAllPosts(kv), env)
  return all.filter(p => p.status === 'published').sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(kv: KVNamespace, slug: string): Promise<Post | null> {
  return kv.get(`post:${slug}`, 'json') as Promise<Post | null>
}

export async function savePost(
  kv: KVNamespace,
  input: Partial<Post> & { slug: string; title: string; content: string }
): Promise<Post> {
  const existing = await getPostBySlug(kv, input.slug)
  const now = new Date().toISOString().split('T')[0]
  const merged = { ...existing, ...input }
  const post: Post = {
    slug:         merged.slug,
    title:        merged.title,
    date:         (merged.status === 'published' && existing?.status !== 'published') ? now : (merged.date || now),
    category:     merged.category     || 'uncategorized',
    scene:        merged.scene        || 'default',
    mood:         merged.mood         || 'neutral',
    excerpt:      merged.excerpt      || '',
    tags:         merged.tags         || [],
    featuredImage: merged.featuredImage || '',
    imageAlt:     merged.imageAlt,
    author:       merged.author       || 'Adduckivity',
    readingTime:  readingTime(merged.content),
    status:       merged.status       || 'draft',
    scheduledAt:  merged.scheduledAt,
    facebookPosted: merged.facebookPosted,
    content:      merged.content,
  }
  await kv.put(`post:${post.slug}`, JSON.stringify(post))
  return post
}

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

export async function deletePost(kv: KVNamespace, slug: string): Promise<boolean> {
  const existing = await getPostBySlug(kv, slug)
  if (!existing) return false
  await kv.delete(`post:${slug}`)
  return true
}

export async function slugExists(kv: KVNamespace, slug: string): Promise<boolean> {
  const post = await getPostBySlug(kv, slug)
  return post !== null
}
