export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  try {
    const { key } = await params
    const objectKey = key.join('/')
    const env = getRequestContext<CloudflareEnv>().env
    const object = await env.ASSETS_BUCKET.get(objectKey)

    if (!object) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const headers = new Headers()
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new NextResponse(object.body as ReadableStream, { headers })
  } catch (err) {
    console.error('Asset serve error:', err)
    return NextResponse.json({ error: 'Failed to serve asset' }, { status: 500 })
  }
}
