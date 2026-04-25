export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { savePost, toSlug, getPostBySlug } from '@/lib/posts'

async function postToFacebook(post: { title: string; excerpt: string; slug: string; featuredImage?: string }) {
  const { env } = getRequestContext<CloudflareEnv>()
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

export async function POST(req: NextRequest) {
  const { env } = getRequestContext<CloudflareEnv>()
  const kv = env.POSTS_KV
  try {
    const body = await req.json() as Partial<import('@/lib/posts').Post> & { title?: string; content?: string }
    if (!body.title) return NextResponse.json({ error: 'title required' }, { status: 400 })

    const slug = body.slug || toSlug(body.title)
    const existing = await getPostBySlug(kv, slug)
    const isFirstPublish = body.status === 'published' && existing?.status !== 'published'

    const post = await savePost(kv, { ...body, slug, title: body.title!, content: body.content || '' })

    if (isFirstPublish) {
      await postToFacebook(post).catch(() => {})
    }

    return NextResponse.json(post)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
