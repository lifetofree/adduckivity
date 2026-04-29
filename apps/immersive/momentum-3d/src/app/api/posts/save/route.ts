export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { savePost, toSlug, getPostBySlug, postToFacebook, updatePost } from '@/lib/posts'
import { getMockKV } from '@/lib/dev-kv'

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

function getEnv(): CloudflareEnv {
  return getRequestContext<CloudflareEnv>().env
}

export async function POST(req: NextRequest) {
  const kv = getKV()
  try {
    const body = await req.json() as Partial<import('@/lib/posts').Post> & { title?: string; content?: string }
    if (!body.title) return NextResponse.json({ error: 'title required' }, { status: 400 })

    const slug = body.slug || toSlug(body.title)
    const existing = await getPostBySlug(kv, slug)
    
    // Trigger Facebook on transition to published if not already posted
    const shouldPostToFacebook = body.status === 'published' && !existing?.facebookPosted

    const post = await savePost(kv, { ...body, slug, title: body.title!, content: body.content || '' })

    let facebook: { ok: boolean; error?: string } | undefined
    if (shouldPostToFacebook) {
      const env = process.env.NODE_ENV === 'development' ? undefined : getEnv()
      if (env) {
        facebook = await postToFacebook(env, post)
        if (facebook.ok) {
          // Update the post with the flag
          await updatePost(kv, post.slug, { facebookPosted: true })
          post.facebookPosted = true
        }
      } else {
        facebook = { ok: false, error: 'Env not available' }
      }
    }

    return NextResponse.json({ ...post, facebook })
  } catch (err) {
    console.error('[API/Save] Error:', err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
