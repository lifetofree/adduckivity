export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getPublishedPosts } from '@/lib/posts'
import { getMockKV } from '@/lib/dev-kv'

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

function getEnv(): CloudflareEnv {
  return getRequestContext<CloudflareEnv>().env
}

/** Constant-time string comparison to prevent timing attacks on secret keys. */
function timingSafeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return diff === 0
}

/**
 * Maintenance endpoint to trigger scheduled post promotion.
 * Should be called by a CRON job (e.g. Cloudflare Workers Cron).
 */
export async function GET(req: NextRequest) {
  const provided = req.headers.get('x-maintenance-key') || ''
  let expected: string | undefined

  if (process.env.NODE_ENV === 'development') {
    expected = process.env.MAINTENANCE_KEY || 'dev-key'
  } else {
    expected = getEnv().MAINTENANCE_KEY
  }

  if (!expected || !timingSafeEqual(provided, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const kv = getKV()
    const env = process.env.NODE_ENV === 'development' ? undefined : getEnv()
    // getPublishedPosts calls promoteScheduledPosts internally
    const posts = await getPublishedPosts(kv, env)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      publishedCount: posts.length
    })
  } catch (err) {
    console.error('[Maintenance] Failed:', err)
    return NextResponse.json({ error: 'Maintenance failed' }, { status: 500 })
  }
}
