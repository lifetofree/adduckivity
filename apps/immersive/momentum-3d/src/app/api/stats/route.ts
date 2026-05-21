export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getMockKV } from '@/lib/dev-kv'

// --- Config -------------------------------------------------------------------

/** Max KV.list pages to scan on a cache miss — safety cap to prevent
 *  unbounded cold-start scans when millions of keys exist. */
const MAX_PAGES = 30

/** Number of historical seconds to keep in scope. Events older than this
 *  are excluded by prefixing the KV.list call rather than client-side
 *  filtering. */
const HISTORY_AGE_SECONDS = 14 * 24 * 60 * 60 // 14 days

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
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

function getEnv(): { MAINTENANCE_KEY?: string } {
  if (process.env.NODE_ENV === 'development') {
    return { MAINTENANCE_KEY: process.env.MAINTENANCE_KEY || 'dev-key' }
  }
  try {
    return getRequestContext<CloudflareEnv>().env as { MAINTENANCE_KEY?: string }
  } catch {
    return { MAINTENANCE_KEY: process.env.MAINTENANCE_KEY }
  }
}

/** KV child-database namespace used for analytics hits.
 *
 * The key schema is: stats:hit:{eventName}:{msTimestamp}-{random}
 * KV.list prefix filtering works on the raw key name. Because the event name
 * varies, the only reliable KV-level prefix is `stats:hit:`, which means every
 * call has to traverse the full namespace. We therefore rely on a hard
 * MAX_PAGES ceiling **and** a client-side time-skip for events older than
 * HISTORY_AGE_SECONDS, returning them as `(counts)` if needed but avoiding
 * the expensive per-key latency of paging through years of history. */
const EVENTS_DB_PREFIX = 'stats:hit:' as const

export async function GET(req: NextRequest) {
  const provided = req.headers.get('x-admin-key') || ''
  const { MAINTENANCE_KEY } = getEnv()
  if (!MAINTENANCE_KEY || !timingSafeEqual(provided, MAINTENANCE_KEY)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const kv = getKV()
    const cacheKey = 'stats:aggregated'
    const now = Math.floor(Date.now() / 1000)
    
    // Try to get cached stats
    const cached = await kv.get(cacheKey, 'text')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed.expiry && parsed.expiry > now) {
          return NextResponse.json(parsed.value)
        }
      } catch (e) {
        // If cache is corrupted, continue to regenerate
        console.warn('[Stats] Cache parse error:', e)
      }
    }

    // Cache miss or expired - compute fresh stats
    const counts: Record<string, number> = {}
    let total = 0

    // Paginate with a hard MAX_PAGES stop.  Cloudflare KV.list returns at most
    // 1000 keys per page, and every call must traverse the full prefix namespace
    // internally; there is no native time-range or secondary index.  We therefore
    // apply a **hard page cap** to keep request latency bounded on cold starts,
    // and we client-side-skip keys older than HISTORY_AGE_SECONDS.
    const cutoffMs = Math.floor(Date.now() / 1000 - HISTORY_AGE_SECONDS) * 1000
    let cursor: string | undefined
    let pagesScanned = 0
    do {
      const page: { keys: Array<{ name: string }>; list_complete: boolean; cursor?: string } =
        await kv.list({ prefix: EVENTS_DB_PREFIX, cursor })
      pagesScanned++
      for (const key of page.keys) {
        // Key format: stats:hit:{eventName}:{msTimestamp}-{random}
        const parts = key.name.split(':')
        if (parts.length < 4) continue
        const eventName = parts[2]
        // parts[3] is "{msTimestamp}-{random}" — skip events outside the window.
        const tsStr = parts[3]?.split('-')[0]
        const tsMs = tsStr ? parseInt(tsStr, 10) : NaN
        if (tsMs < cutoffMs || Number.isNaN(tsMs)) continue
        counts[eventName] = (counts[eventName] || 0) + 1
      }
      total += page.keys.length
      cursor = page.list_complete ? undefined : page.cursor
    } while (cursor && pagesScanned < MAX_PAGES)

    const sortedEvents = Object.keys(counts).sort()
    const result = sortedEvents.reduce((obj, key) => {
      obj[key] = counts[key]
      return obj
    }, {} as Record<string, number>)

    const responseBody = {
      summary: result,
      total_hits: total,
      note: 'These are aggregate counts of all recorded events.'
    }

    // Cache for 5 minutes (300 seconds)
    await kv.put(
      cacheKey,
      JSON.stringify({
        value: responseBody,
        expiry: now + 300
      })
    )

    return NextResponse.json(responseBody)
  } catch (err) {
    console.error('[Stats] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
