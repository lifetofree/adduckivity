export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getMockKV } from '@/lib/dev-kv'

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

export async function GET() {
  try {
    const kv = getKV()
    
    // We list all keys with the prefix 'stats:hit:'
    // For a real production app with many hits, we'd need pagination or a better storage strategy
    const list = await kv.list({ prefix: 'stats:hit:' })
    
    const counts: Record<string, number> = {}
    
    for (const key of list.keys) {
      // Key format: stats:hit:{eventName}:{timestamp}-{random}
      const parts = key.name.split(':')
      if (parts.length >= 3) {
        const eventName = parts[2]
        counts[eventName] = (counts[eventName] || 0) + 1
      }
    }

    // Sort events logically (if possible) or just return them
    const sortedEvents = Object.keys(counts).sort()
    const result = sortedEvents.reduce((obj, key) => {
      obj[key] = counts[key]
      return obj
    }, {} as Record<string, number>)

    return NextResponse.json({
      summary: result,
      total_hits: list.keys.length,
      note: 'These are aggregate counts of all recorded events.'
    })
  } catch (err) {
    console.error('[Stats] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
