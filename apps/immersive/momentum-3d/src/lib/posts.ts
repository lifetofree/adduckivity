import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const dir = path.join(process.cwd(), 'public/content')

function ensure() {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function readingTime(content: string): string {
  const words = content.replace(/[#*`[\]]/g, '').split(/\s+/).filter(Boolean).length
  const mins = Math.ceil(words / 200)
  return mins < 1 ? '< 1 min read' : `${mins} min read`
}

export function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60)
}

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

export function getAllPosts(): Post[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => getPostBySlug(f.replace(/\.md$/, '')))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const { data, content } = matter(fs.readFileSync(path.join(dir, `${slug}.md`), 'utf8'))
    return {
      slug,
      title:       data.title       || '',
      date:        data.date        || new Date().toISOString().split('T')[0],
      category:    data.category    || 'uncategorized',
      scene:       data.scene       || 'default',
      mood:        data.mood        || 'neutral',
      excerpt:     data.excerpt     || '',
      tags:        data.tags        || [],
      featuredImage: data.featuredImage || '',
      author:      data.author      || 'Adduckivity',
      readingTime: data.readingTime || readingTime(content),
      status:      data.status === 'published' ? 'published' : 'draft',
      content,
    }
  } catch {
    return null
  }
}

export function savePost(input: Partial<Post> & { slug: string; title: string; content: string }): Post {
  ensure()
  const existing = getPostBySlug(input.slug)
  const now = new Date().toISOString().split('T')[0]
  const merged = { ...existing, ...input }
  const rt = readingTime(merged.content)
  const fm = {
    title:        merged.title,
    slug:         merged.slug,
    date:         merged.date || now,
    category:     merged.category    || 'uncategorized',
    scene:        merged.scene       || 'default',
    mood:         merged.mood        || 'neutral',
    excerpt:      merged.excerpt     || '',
    tags:         merged.tags        || [],
    featuredImage: merged.featuredImage || '',
    author:       merged.author      || 'Adduckivity',
    readingTime:  rt,
    status:       merged.status      || 'draft',
  }
  fs.writeFileSync(path.join(dir, `${fm.slug}.md`), matter.stringify(merged.content, fm))
  return { ...fm, content: merged.content }
}

export function createPost(input: Omit<Post, 'date' | 'readingTime' | 'slug'> & { slug?: string }): Post {
  ensure()
  const slug = input.slug || toSlug(input.title)
  return savePost({ ...input, slug })
}

export function updatePost(slug: string, input: Partial<Post>): Post | null {
  const existing = getPostBySlug(slug)
  if (!existing) return null
  // If slug changed, delete old file
  const newSlug = input.slug && input.slug !== slug ? input.slug : slug
  if (newSlug !== slug) fs.unlinkSync(path.join(dir, `${slug}.md`))
  return savePost({ ...existing, ...input, slug: newSlug })
}

export function deletePost(slug: string): boolean {
  const p = path.join(dir, `${slug}.md`)
  if (fs.existsSync(p)) { fs.unlinkSync(p); return true }
  return false
}

export function slugExists(slug: string): boolean {
  return fs.existsSync(path.join(dir, `${slug}.md`))
}
