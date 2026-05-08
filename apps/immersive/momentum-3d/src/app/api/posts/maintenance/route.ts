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

/**
 * Maintenance endpoint to trigger scheduled post promotion.
 * Should be called by a CRON job (e.g. Cloudflare Workers Cron).
 */
export async function GET(req: NextRequest) {
  // Check for secret key
  const authHeader = req.headers.get('x-maintenance-key')
  const env = process.env.NODE_ENV === 'development' ? { MAINTENANCE_KEY: 'dev-key' } as CloudflareEnv : getEnv()
  
  if (authHeader !== env.MAINTENANCE_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const kv = getKV()
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
