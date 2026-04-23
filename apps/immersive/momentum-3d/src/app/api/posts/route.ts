export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { updatePost, deletePost } from '@/lib/posts'

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

export async function PUT(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  try {
    const body = await req.json()
    const post = updatePost(slug, body)
    return post
      ? NextResponse.json(post)
      : NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  return deletePost(slug)
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: 'Not found' }, { status: 404 })
}
