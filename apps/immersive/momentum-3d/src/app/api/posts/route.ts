export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAllPosts, getPostBySlug, updatePost, deletePost } from '@/lib/posts'
import { getMockKV } from '@/lib/dev-kv'

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

function getEnv(): CloudflareEnv {
  return getRequestContext<CloudflareEnv>().env
}

async function postToFacebook(post: { title: string; excerpt: string; slug: string }) {
  if (process.env.NODE_ENV === 'development') return // Skip Facebook posting in dev

  const env = getEnv()
  const token   = env.FACEBOOK_PAGE_ACCESS_TOKEN
  const pageId  = env.FACEBOOK_PAGE_ID
  const siteUrl = env.SITE_URL || 'https://immersive-adduckivity.pages.dev'

  if (!token || !pageId) return

  const link    = `${siteUrl}/blog/${post.slug}`
  const message = `🦆 ${post.title}\n\n${post.excerpt}\n\nRead the full protocol → ${link}\n\n#DuckOS #Productivity #ADHD #Neurodivergent`

  const params = new URLSearchParams({ message, link, access_token: token })
  await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
    method: 'POST',
    body: params,
  })
}

export async function GET(req: NextRequest) {
  const kv = getKV()
  const slug = req.nextUrl.searchParams.get('slug')
  if (slug) {
    const post = await getPostBySlug(kv, slug)
    return post
      ? NextResponse.json(post)
      : NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ posts: await getAllPosts(kv) })
}

export async function PUT(req: NextRequest) {
  const kv = getKV()
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  try {
    const existing = await getPostBySlug(kv, slug)
    const body = await req.json() as Partial<import('@/lib/posts').Post>
    const isFirstPublish = body.status === 'published' && existing?.status !== 'published'
    const post = await updatePost(kv, slug, body)
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (isFirstPublish) {
      await postToFacebook(post).catch(() => {})
    }
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const kv = getKV()
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  const ok = await deletePost(kv, slug)
  return ok
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: 'Not found' }, { status: 404 })
}
