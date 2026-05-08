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
    const counts: Record<string, number> = {}
    let total = 0

    // Paginate through ALL keys — Cloudflare KV.list returns max 1000 per call (#36).
    let cursor: string | undefined
    do {
      const page: { keys: Array<{ name: string }>; list_complete: boolean; cursor?: string } =
        await kv.list({ prefix: 'stats:hit:', cursor })
      for (const key of page.keys) {
        // Key format: stats:hit:{eventName}:{timestamp}-{random}
        const parts = key.name.split(':')
        if (parts.length >= 3) {
          const eventName = parts[2]
          counts[eventName] = (counts[eventName] || 0) + 1
        }
      }
      total += page.keys.length
      cursor = page.list_complete ? undefined : page.cursor
    } while (cursor)

    const sortedEvents = Object.keys(counts).sort()
    const result = sortedEvents.reduce((obj, key) => {
      obj[key] = counts[key]
      return obj
    }, {} as Record<string, number>)

    return NextResponse.json({
      summary: result,
      total_hits: total,
      note: 'These are aggregate counts of all recorded events.'
    })
  } catch (err) {
    console.error('[Stats] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
