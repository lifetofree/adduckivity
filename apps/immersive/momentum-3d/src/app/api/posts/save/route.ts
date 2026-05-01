export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { savePost, toSlug, getPostBySlug, postToFacebook, updatePost, importGoogleDriveImages } from '@/lib/posts'
import { getMockKV } from '@/lib/dev-kv'

/** Returns the KV namespace: mock in dev, real Cloudflare binding in production. */
function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

/** Returns the Cloudflare environment bindings (only available outside dev). */
function getEnv(): CloudflareEnv {
  return getRequestContext<CloudflareEnv>().env
}

/**
 * POST /api/posts/save
 *
 * Auto-save (upsert) endpoint used by the CMS editor. Creates a new post or
 * merges changes into an existing one, determined by `slug` (auto-derived from
 * `title` via `toSlug()` if not supplied).
 *
 * Side-effects:
 * - Google Drive image URLs in `body.content` are downloaded and re-hosted in
 *   R2 before the post is stored (no-op in local dev or if no Drive URLs found).
 * - On the first transition to `status: 'published'`, the post is shared to the
 *   Facebook Page and `facebookPosted` is stamped `true`. Subsequent saves at
 *   the same status are not re-posted.
 *
 * @param req - Edge request. Body must be `Partial<Post>` with at least `title`.
 * @returns The saved `Post` merged with an optional `facebook` result object
 *   (`{ ok: boolean; error?: string }`). Returns 400 if `title` is missing or
 *   on unexpected errors.
 */
export async function POST(req: NextRequest) {
  const kv = getKV()
  const env = process.env.NODE_ENV === 'development' ? undefined : getEnv()

  try {
    const body = await req.json() as Partial<import('@/lib/posts').Post> & { title?: string; content?: string }
    if (!body.title) return NextResponse.json({ error: 'title required' }, { status: 400 })

    const slug = body.slug || toSlug(body.title)
    const existing = await getPostBySlug(kv, slug)

    // Import Google Drive images to R2 if content is provided and has Google Drive URLs
    let processedContent = existing?.content || '' // Default to existing content
    if (body.content !== undefined) {
      // Only process if content is explicitly provided (even if empty string)
      processedContent = body.content
      if (env && body.content && body.content.trim()) {
        processedContent = await importGoogleDriveImages(env, body.content)
      }
    }

    // Trigger Facebook on transition to published if not already posted
    const shouldPostToFacebook = body.status === 'published' && !existing?.facebookPosted

    const post = await savePost(kv, { ...body, slug, title: body.title!, content: processedContent })

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
