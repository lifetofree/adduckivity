export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getMockKV } from '@/lib/dev-kv'

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

async function recordEvent(event: string) {
  const kv = getKV()
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  const key = `stats:hit:${event}:${timestamp}-${randomId}`
  await kv.put(key, timestamp.toString())
  console.log(`[Track] Recorded: ${event}`)
}

export async function GET(req: NextRequest) {
  // Allow simple browser testing via /api/track?event=ping
  const event = req.nextUrl.searchParams.get('event') || 'manual_ping'
  await recordEvent(event)
  return NextResponse.json({ success: true, recorded: event, note: 'Event recorded via GET (Test Mode)' })
}

export async function POST(req: NextRequest) {
  try {
    const { event } = await req.json() as { event?: string }
    
    if (!event) {
      return NextResponse.json({ error: 'Event name required' }, { status: 400 })
    }

    await recordEvent(event)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Track] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
