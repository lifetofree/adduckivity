import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (slug) {
    const post = getPostBySlug(slug)
    return post
      ? NextResponse.json(post)
      : NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ posts: getAllPosts() })
}
