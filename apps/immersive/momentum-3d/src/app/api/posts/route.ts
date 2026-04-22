import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const category = req.nextUrl.searchParams.get('category')
  const tag = req.nextUrl.searchParams.get('tag')

  if (slug) {
    const post = getPostBySlug(slug)
    return post ? NextResponse.json(post) : NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  let posts = getAllPosts()
  if (category) posts = posts.filter(p => p.category === category)
  if (tag) posts = posts.filter(p => p.tags.includes(tag))
  return NextResponse.json({ posts })
}
