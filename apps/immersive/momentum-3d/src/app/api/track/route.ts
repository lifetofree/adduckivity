export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getMockKV } from '@/lib/dev-kv'

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

export async function POST(req: NextRequest) {
  try {
    const { event } = await req.json() as { event?: string }
    
    if (!event) {
      return NextResponse.json({ error: 'Event name required' }, { status: 400 })
    }

    const kv = getKV()
    
    // Privacy-focused tracking: No PII, just log the event hit
    // Pattern: stats:hit:{eventName}:{timestamp}-{random}
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const key = `stats:hit:${event}:${timestamp}-${randomId}`
    
    // We store the timestamp as the value for convenience
    await kv.put(key, timestamp.toString())

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Track] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
