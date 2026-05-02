export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAllPosts, getPostBySlug, savePost, updatePost, deletePost, promoteScheduledPosts, postToFacebook, importGoogleDriveImages } from '@/lib/posts'
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
 * GET /api/posts
 * GET /api/posts?slug=<slug>
 *
 * Without `slug`: returns `{ posts: Post[] }` — all posts sorted newest-first,
 * with any overdue scheduled posts promoted to `published` before responding.
 *
 * With `slug`: returns the single matching `Post` object, promoting it if
 * its `scheduledAt` has elapsed, or `{ error: 'Not found' }` (404) if missing.
 *
 * Scheduled-post promotion is skipped in local development (no Cloudflare env).
 */
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

/**
 * PUT /api/posts?slug=<slug>
 *
 * Creates or fully replaces a post identified by `slug`.
 * If a post with that slug already exists, it is updated; otherwise a new post
 * is created with sensible defaults.
 *
 * Side-effects:
 * - Google Drive image URLs in `body.content` are downloaded and re-hosted in R2.
 * - On the first transition to `status: 'published'` (and only that once),
 *   the post is shared to the Facebook Page and `facebookPosted` is stamped `true`.
 *
 * @returns The saved `Post` merged with an optional `facebook` result object
 *   (`{ ok: boolean; error?: string }`). Returns 400 on malformed body,
 *   500 if the underlying save fails.
 */
export async function PUT(req: NextRequest) {
  const kv = getKV()
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  try {
    const existing = await getPostBySlug(kv, slug)
    const body = await req.json() as Partial<import('@/lib/posts').Post>

    console.log('[API/PUT] Processing post:', slug, 'existing:', !!existing, 'body status:', body.status, 'existing facebookPosted:', existing?.facebookPosted)

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

    console.log('[API/PUT] shouldPostToFacebook:', shouldPostToFacebook, 'body.status:', body.status, '!existing?.facebookPosted:', !existing?.facebookPosted)

    const post = existing
      ? await updatePost(kv, slug, { ...body, content: processedContent !== undefined ? processedContent : existing.content })
      : await savePost(kv, { ...body, slug, title: body.title || slug, content: processedContent !== undefined ? processedContent : '' })

    if (!post) return NextResponse.json({ error: 'Save failed' }, { status: 500 })

    let facebook: { ok: boolean; error?: string } | undefined
    if (shouldPostToFacebook) {
      console.log('[API/PUT] Attempting Facebook post for:', slug)
      const env = process.env.NODE_ENV === 'development' ? undefined : getEnv()
      if (env) {
        facebook = await postToFacebook(env, post)
        console.log('[API/PUT] Facebook result:', facebook)
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

/**
 * DELETE /api/posts?slug=<slug>
 *
 * Deletes a draft or scheduled post from KV, including all R2 assets
 * (images embedded in content or set as `featuredImage`) referenced by the post.
 *
 * Guards:
 * - Returns 400 if `slug` query param is missing.
 * - Returns 404 if no post with that slug exists.
 * - Returns 403 if the post is `published` — unpublish first to prevent
 *   accidental removal of live content.
 *
 * Asset cleanup is best-effort: individual R2 delete failures are logged but
 * do not block the KV delete.
 *
 * @returns `{ success: true }` on success, or an error object with the
 *   appropriate HTTP status code.
 */
export async function DELETE(req: NextRequest) {
  const kv = getKV()
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const existing = await getPostBySlug(kv, slug)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Prevent deletion of published posts
  if (existing.status === 'published') {
    return NextResponse.json(
      { error: 'Published posts cannot be deleted. Please unpublish the post first.' },
      { status: 403 }
    )
  }

  // Extract and delete associated images from R2
  const env = process.env.NODE_ENV === 'development' ? undefined : getEnv()
  if (env?.ASSETS_BUCKET) {
    try {
      const assetKeys: string[] = []

      // Find all R2 asset URLs in the content
      const assetUrlRegex = /https?:\/\/[^\/]+\/api\/assets\/([^\s\)]+)/g
      const contentMatches = [...existing.content.matchAll(assetUrlRegex)]
      contentMatches.forEach(match => {
        if (match[1]) assetKeys.push(match[1])
      })

      // Also check featured image
      if (existing.featuredImage && existing.featuredImage.includes('/api/assets/')) {
        const featuredMatch = existing.featuredImage.match(/\/api\/assets\/(.+)/)
        if (featuredMatch && featuredMatch[1]) {
          assetKeys.push(featuredMatch[1])
        }
      }

      // Delete each asset from R2
      for (const assetKey of assetKeys) {
        try {
          await env.ASSETS_BUCKET.delete(assetKey)
          console.log(`[Delete] Removed asset: ${assetKey}`)
        } catch (err) {
          console.error(`[Delete] Failed to remove asset ${assetKey}:`, err)
        }
      }

      console.log(`[Delete] Removed ${assetKeys.length} assets for post: ${slug}`)
    } catch (err) {
      console.error('[Delete] Error removing assets:', err)
    }
  }

  const ok = await deletePost(kv, slug)
  return ok
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: 'Delete failed' }, { status: 500 })
}
