export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAllPosts, getPostBySlug, savePost, updatePost, deletePost } from '@/lib/posts'
import { getMockKV } from '@/lib/dev-kv'

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

function getEnv(): CloudflareEnv {
  return getRequestContext<CloudflareEnv>().env
}

async function postToFacebook(post: { title: string; excerpt: string; slug: string; featuredImage?: string }): Promise<{ ok: boolean; error?: string }> {
  if (process.env.NODE_ENV === 'development') return { ok: false, error: 'skipped in dev' }

  const env = getEnv()
  const token   = env.FACEBOOK_PAGE_ACCESS_TOKEN
  const pageId  = env.FACEBOOK_PAGE_ID
  const siteUrl = env.SITE_URL || 'https://immersive-adduckivity.pages.dev'

  if (!token) return { ok: false, error: 'FACEBOOK_PAGE_ACCESS_TOKEN not set' }
  if (!pageId) return { ok: false, error: 'FACEBOOK_PAGE_ID not set' }

  const link    = `${siteUrl}/blog/${post.slug}`
  const message = `🦆 ${post.title}\n\n${post.excerpt}\n\nRead the full protocol → ${link}\n\n#DuckOS #Productivity #ADHD #Neurodivergent`

  const params = new URLSearchParams({ message, link, access_token: token })
  if (post.featuredImage?.startsWith('http')) params.set('picture', post.featuredImage)
  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
    method: 'POST',
    body: params,
  })

  const data = await res.json() as { id?: string; error?: { message: string } }
  if (!res.ok || data.error) {
    const msg = data.error?.message || `HTTP ${res.status}`
    console.error('[Facebook] Post failed:', msg)
    return { ok: false, error: msg }
  }

  console.log('[Facebook] Posted successfully:', data.id)
  return { ok: true }
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
    const post = existing
      ? await updatePost(kv, slug, body)
      : await savePost(kv, { ...body, slug, title: body.title || slug, content: body.content || '' })
    if (!post) return NextResponse.json({ error: 'Save failed' }, { status: 500 })
    let facebook: { ok: boolean; error?: string } | undefined
    if (isFirstPublish) {
      facebook = await postToFacebook(post)
    }
    return NextResponse.json({ ...post, facebook })
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
