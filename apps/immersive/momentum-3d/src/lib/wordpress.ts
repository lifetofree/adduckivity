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
  excerpt: {
    rendered: string
    protected: boolean
  }
  date: string
  link: string
  categories: number[]
  tags: number[]
  featured_media: number
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

/**
 * Fetch published posts from WordPress with embedded media and terms
 */
export async function getWordPressPosts(options: {
  perPage?: number
  page?: number
  categories?: number[]
  tags?: number[]
}): Promise<WordPressPost[]> {
  const params = new URLSearchParams()
  params.append('_embed', 'wp:featuredmedia,wp:term')
  params.append('per_page', String(options.perPage || 20))
  params.append('page', String(options.page || 1))
  params.append('status', 'publish')
  params.append('orderby', 'date')
  params.append('order', 'desc')

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
 * Fetch categories from WordPress
 */
export async function getWordPressCategories(): Promise<WordPressCategory[]> {
  const response = await fetch(`${WP_API_BASE}/categories?per_page=50&hide_empty=true`, {
    next: { revalidate: 600 } // Cache for 10 minutes
  })

  if (!response.ok) {
    throw new Error(`WordPress categories API error: ${response.status}`)
  }

  return response.json()
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
 * Convert WordPress post to a format compatible with the blog page
 */
export function formatWordPressPost(post: WordPressPost) {
  const plainExcerpt = stripHtml(post.excerpt.rendered)
  const featuredImage = getFeaturedImageUrl(post)
  const category = getCategoryName(post)
  const tags = getPostTags(post)

  return {
    slug: post.slug,
    title: post.title.rendered,
    excerpt: plainExcerpt,
    date: new Date(post.date).toISOString().split('T')[0],
    featuredImage,
    imageAlt: getFeaturedImageAlt(post),
    category: category.toLowerCase(),
    tags,
    readingTime: calculateReadingTime(plainExcerpt),
    link: post.link
  }
}
