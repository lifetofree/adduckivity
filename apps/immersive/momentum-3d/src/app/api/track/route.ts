export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getMockKV } from '@/lib/dev-kv'

function getKV(): KVNamespace {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

/** Allowlist of event names to prevent KV-key injection (#35). */
const ALLOWED_EVENTS = new Set([
  'emergency_start',
  'emergency_step_1_complete',
  'emergency_step_2_complete',
  'emergency_step_3_complete',
  'emergency_step_4_complete',
  'emergency_step_5_complete',
  'emergency_subscribe',
  'emergency_facebook_click',
])

/** Validates the event name against the allowlist. */
function isValidEvent(event: string): boolean {
  return ALLOWED_EVENTS.has(event)
}

async function recordEvent(event: string) {
  const kv = getKV()
  const timestamp = Date.now()
  const randomId = crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  const key = `stats:hit:${event}:${timestamp}-${randomId}`
  await kv.put(key, timestamp.toString())
}

export async function POST(req: NextRequest) {
  try {
    const { event } = await req.json() as { event?: string }

    if (!event || !isValidEvent(event)) {
      return NextResponse.json({ error: 'Invalid event name' }, { status: 400 })
    }

    await recordEvent(event)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Track] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
