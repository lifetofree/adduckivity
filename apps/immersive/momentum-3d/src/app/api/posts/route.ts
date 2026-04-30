export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAllPosts, getPostBySlug, savePost, updatePost, deletePost, promoteScheduledPosts, postToFacebook, importGoogleDriveImages } from '@/lib/posts'
import { getMockKV } from '@/lib/dev-kv'

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

function getEnv(): CloudflareEnv {
  return getRequestContext<CloudflareEnv>().env
}

export async function GET(req: NextRequest) {
  const kv = getKV()
  const slug = req.nextUrl.searchParams.get('slug')
  
  if (slug) {
    const raw = await getPostBySlug(kv, slug)
    if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    // Promote if live
    const env = process.env.NODE_ENV === 'development' ? undefined : getEnv()
    const [post] = await promoteScheduledPosts(kv, [raw], env)
    return NextResponse.json(post)
  }

  // Promote overdue scheduled posts when listing
  const env = process.env.NODE_ENV === 'development' ? undefined : getEnv()
  const posts = await promoteScheduledPosts(kv, await getAllPosts(kv), env)
  return NextResponse.json({ posts })
}

export async function PUT(req: NextRequest) {
  const kv = getKV()
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  
  try {
    const existing = await getPostBySlug(kv, slug)
    const body = await req.json() as Partial<import('@/lib/posts').Post>
    
    // Import Google Drive images to R2 if content is provided
    let processedContent = body.content
    if (processedContent !== undefined && processedContent !== null) {
      const env = process.env.NODE_ENV === 'development' ? undefined : getEnv()
      if (env && processedContent.trim()) {
        processedContent = await importGoogleDriveImages(env, processedContent)
      }
    }
    
    // We only trigger Facebook on the VERY FIRST transition to 'published' 
    // OR if it's already published but was never posted.
    const shouldPostToFacebook = body.status === 'published' && !existing?.facebookPosted
    
    const post = existing
      ? await updatePost(kv, slug, { ...body, content: processedContent !== undefined ? processedContent : existing.content })
      : await savePost(kv, { ...body, slug, title: body.title || slug, content: processedContent !== undefined ? processedContent : '' })
    
    if (!post) return NextResponse.json({ error: 'Save failed' }, { status: 500 })

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
    console.error('[API] Save error:', err)
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
