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
  author: string
  readingTime: string
  status: 'draft' | 'published'
  content: string
}

export function readingTime(content: string): string {
  const words = content.replace(/[#*`[\]]/g, '').split(/\s+/).filter(Boolean).length
  const mins = Math.ceil(words / 200)
  return mins < 1 ? '< 1 min read' : `${mins} min read`
}

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export async function getAllPosts(kv: KVNamespace): Promise<Post[]> {
  const list = await kv.list({ prefix: 'post:' })
  const posts = await Promise.all(
    list.keys.map(({ name }) => kv.get(name, 'json') as Promise<Post | null>)
  )
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPublishedPosts(kv: KVNamespace): Promise<Post[]> {
  const all = await getAllPosts(kv)
  return all.filter(p => p.status === 'published')
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
    date:         merged.date         || now,
    category:     merged.category     || 'uncategorized',
    scene:        merged.scene        || 'default',
    mood:         merged.mood         || 'neutral',
    excerpt:      merged.excerpt      || '',
    tags:         merged.tags         || [],
    featuredImage: merged.featuredImage || '',
    author:       merged.author       || 'Adduckivity',
    readingTime:  readingTime(merged.content),
    status:       merged.status       || 'draft',
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
