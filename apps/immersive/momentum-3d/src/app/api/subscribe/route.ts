export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

function getEnv() {
  if (process.env.NODE_ENV === 'development') {
    return {
      SENDFOX_API_TOKEN: process.env.SENDFOX_API_TOKEN || '',
      SENDFOX_LIST_ID:   process.env.SENDFOX_LIST_ID   || '',
    }
  }
  return getRequestContext<CloudflareEnv>().env
}

export async function POST(req: NextRequest) {
  const { email, source } = await req.json() as { email?: string; source?: string }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Skip external call in dev — avoids dependency on real SendFox credentials locally
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({ success: true, dev: true })
  }

  const env = getEnv()
  const token  = env.SENDFOX_API_TOKEN
  const listId = env.SENDFOX_LIST_ID

  if (!token || !listId) {
    return NextResponse.json({ error: 'SendFox not configured' }, { status: 500 })
  }

  const body: Record<string, unknown> = { email, lists: [Number(listId)] }
  if (source) body.tags = [source]

  const res = await fetch('https://api.sendfox.com/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json() as { id?: number; message?: string }

  if (!res.ok && res.status !== 422) {
    return NextResponse.json({ error: data.message || 'SendFox error' }, { status: 500 })
  }

  // 422 = email already subscribed
  if (res.status === 422) {
    return NextResponse.json({ success: true, alreadySubscribed: true })
  }
  return NextResponse.json({ success: true })
}
