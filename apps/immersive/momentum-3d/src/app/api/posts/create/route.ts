import { NextRequest, NextResponse } from 'next/server'
import { createPost, slugExists } from '@/lib/posts'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, content, excerpt, tags, category, featuredImage, author, scene, mood } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60)

    if (slugExists(slug)) {
      return NextResponse.json({ error: 'Slug already exists', slug }, { status: 409 })
    }

    const post = createPost({
      slug, title, content,
      excerpt: excerpt || '',
      tags: tags || [],
      category: category || 'uncategorized',
      featuredImage: featuredImage || '',
      author: author || 'Adduckivity',
      scene: scene || 'default',
      mood: mood || 'neutral',
    })

    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
