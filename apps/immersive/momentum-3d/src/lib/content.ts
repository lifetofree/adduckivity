import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

export interface Post {
  slug: string
  title: string
  date: string
  category: string
  scene: string
  mood: string
  excerpt: string
  tags: string[]
  featuredImage?: string
  author: string
  readingTime: string
  status: 'draft' | 'published'
  content: string
}

const contentDirectory = path.join(process.cwd(), 'public/content')

export function readingTime(content: string): string {
  const words = content.replace(/[#*`[\]]/g, '').split(/\s+/).filter(Boolean).length
  const mins = Math.ceil(words / 200)
  return mins < 1 ? '< 1 min read' : `${mins} min read`
}

export function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60)
}

// ── Build-time content loading (server-side only) ──────────────────────────────

export function getAllPosts(): Post[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(contentDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(contentDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || '',
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'uncategorized',
        scene: data.scene || 'default',
        mood: data.mood || 'neutral',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        featuredImage: data.featuredImage || '',
        author: data.author || 'Adduckivity',
        readingTime: data.readingTime || readingTime(content),
        status: (data.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
        content,
      }
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || '',
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || 'uncategorized',
      scene: data.scene || 'default',
      mood: data.mood || 'neutral',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      featuredImage: data.featuredImage || '',
      author: data.author || 'Adduckivity',
      readingTime: data.readingTime || readingTime(content),
      status: (data.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
      content,
    }
  } catch {
    return null
  }
}

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter(p => p.status === 'published')
}
