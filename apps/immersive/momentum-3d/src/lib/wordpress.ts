/**
 * WordPress API Integration
 * Fetches posts from wp.adduckivity.com WordPress site
 */

export interface WordPressPost {
  id: number
  slug: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    raw?: string
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  date: string
  link: string
  categories: number[]
  tags: number[]
  featured_media: number
  // Yoast SEO fields
  yoast_head_json?: {
    title?: string
    description?: string
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
      media_details: {
        width: number
        height: number
      }
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
      taxonomy: string
    }>>
  }
}

export interface WordPressCategory {
  id: number
  name: string
  slug: string
  count: number
}

const WP_API_BASE = 'https://wp.adduckivity.com/wp-json/wp/v2'

/** Hostnames the server is allowed to fetch from. SSRF protection for getPostSeoFromHtml. */
const ALLOWED_FETCH_HOSTS = new Set(['wp.adduckivity.com'])

/**
 * Fetch published posts from WordPress with embedded media and terms
 */
export async function getWordPressPosts(options: {
  perPage?: number
  page?: number
  categories?: number[]
  tags?: number[]
  lang?: string
}): Promise<WordPressPost[]> {
  const params = new URLSearchParams()
  params.append('_embed', 'wp:featuredmedia,wp:term')
  params.append('content', 'true')
  params.append('per_page', String(options.perPage || 20))
  params.append('page', String(options.page || 1))
  params.append('status', 'publish')
  params.append('orderby', 'date')
  params.append('order', 'desc')
  if (options.lang) params.append('lang', options.lang)

  if (options.categories?.length) {
    options.categories.forEach(cat => params.append('categories[]', String(cat)))
  }
  if (options.tags?.length) {
    options.tags.forEach(tag => params.append('tags[]', String(tag)))
  }

  const response = await fetch(`${WP_API_BASE}/posts?${params.toString()}`, {
    next: { revalidate: 300 } // Cache for 5 minutes
  })

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Decode HTML entities in a string
 */
function decodeHtmlEntities(str: string | null): string | null {
  if (!str) return null
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()
}

/**
 * Fetch SEO title and description from a WordPress post's HTML page
 * Falls back to WP title/excerpt if meta tags not found
 */
export async function getPostSeoFromHtml(link: string): Promise<{ seoTitle: string | null; seoDesc: string | null }> {
  try {
    // SSRF guard: only fetch from allowlisted hosts.
    let parsed: URL
    try { parsed = new URL(link) } catch { return { seoTitle: null, seoDesc: null } }
    if (!ALLOWED_FETCH_HOSTS.has(parsed.host)) return { seoTitle: null, seoDesc: null }

    const response = await fetch(link, {
      next: { revalidate: 300 }
    })
    if (!response.ok) return { seoTitle: null, seoDesc: null }

    const html = await response.text()

    // Extract og:title
    const titleMatch = html.match(/<meta[^>]*og:title[^>]*>/i)
    const rawTitle = titleMatch 
      ? titleMatch[0].match(/content=["]([^"]+)["]/)?.[1] || null
      : null

    // Extract og:description
    const descMatch = html.match(/<meta[^>]*og:description[^>]*>/i)
    const rawDesc = descMatch 
      ? descMatch[0].match(/content=["]([^"]+)["]/)?.[1] || null
      : null

    return { 
      seoTitle: decodeHtmlEntities(rawTitle), 
      seoDesc: decodeHtmlEntities(rawDesc) 
    }
  } catch {
    return { seoTitle: null, seoDesc: null }
  }
}

/**
 * Get category name from post
 */
export function getCategoryName(post: WordPressPost): string {
  if (!post._embedded?.['wp:term']) return 'Uncategorized'

  const categories = post._embedded['wp:term'].find(
    terms => terms.some(t => t.taxonomy === 'category')
  ) || []

  if (categories.length === 0) return 'Uncategorized'

  // Get the first non-"Archive" category
  const category = categories.find(t => t.slug !== 'archive') || categories[0]
  return category.name
}

/**
 * Get tags from post
 */
export function getPostTags(post: WordPressPost): string[] {
  if (!post._embedded?.['wp:term']) return []

  const tags = post._embedded['wp:term'].find(
    terms => terms.some(t => t.taxonomy === 'post_tag')
  ) || []

  return tags.map(t => t.name)
}

/**
 * Get featured image URL from post
 */
export function getFeaturedImageUrl(post: WordPressPost): string | null {
  if (!post._embedded?.['wp:featuredmedia']?.[0]) return null

  const media = post._embedded['wp:featuredmedia'][0]
  return media.source_url || null
}

/**
 * Get featured image alt text
 */
export function getFeaturedImageAlt(post: WordPressPost): string {
  if (!post._embedded?.['wp:featuredmedia']?.[0]) return ''

  const media = post._embedded['wp:featuredmedia'][0]
  return media.alt_text || ''
}

/**
 * Strip HTML tags from excerpt
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

/**
 * Get reading time from WordPress post content (most accurate)
 */
export function getReadingTimeFromPost(post: WordPressPost): string {
  // Use actual post content if available (more accurate)
  const content = stripHtml(post.content?.rendered || '')
  return calculateReadingTime(content)
}

/**
 * Detect if text contains Thai characters
 */
export function containsThaiText(text: string): boolean {
  return /[\u0E00-\u0E7F]/.test(text)
}

/**
 * Filter out posts with Thai content
 */
export function isEnglishPost(post: WordPressPost): boolean {
  const title = post.title.rendered
  const excerpt = post.excerpt.rendered

  // Check if title or excerpt contains Thai characters
  if (containsThaiText(title) || containsThaiText(excerpt)) {
    return false
  }

  return true
}

/**
 * Convert WordPress post to a format compatible with the blog page
 */
export function formatWordPressPost(post: WordPressPost) {
  const seoTitle = post.yoast_head_json?.title?.trim()
  const seoDescription = post.yoast_head_json?.description?.trim()
  const plainExcerpt = stripHtml(post.excerpt.rendered)
  const featuredImage = getFeaturedImageUrl(post)
  const category = getCategoryName(post)
  const tags = getPostTags(post)

  return {
    slug: post.slug,
    title: seoTitle || post.title.rendered,
    excerpt: seoDescription || plainExcerpt,
    seoTitle: seoTitle || null,
    seoDesc: seoDescription || null,
    date: new Date(post.date).toISOString().split('T')[0],
    featuredImage,
    imageAlt: getFeaturedImageAlt(post),
    category: category.toLowerCase(),
    tags,
    readingTime: getReadingTimeFromPost(post),
    link: post.link
  }
}
