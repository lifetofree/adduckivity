export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const bytes = await file.arrayBuffer()

    if (process.env.NODE_ENV === 'development') {
      // Dev: return base64 data URL (no R2 available locally)
      const base64 = Buffer.from(bytes).toString('base64')
      const url = `data:${file.type};base64,${base64}`
      return NextResponse.json({ success: true, url, filename: key, originalName: file.name, size: file.size, type: file.type })
    }

    const env = getRequestContext<CloudflareEnv>().env
    if (!env.ASSETS_BUCKET) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })

    await env.ASSETS_BUCKET.put(key, bytes, {
      httpMetadata: { contentType: file.type },
    })

    const siteUrl = env.SITE_URL || 'https://immersive.adduckivity.com'
    const url = `${siteUrl}/api/assets/${key}`

    return NextResponse.json({ success: true, url, filename: key, originalName: file.name, size: file.size, type: file.type })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: `Upload failed: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 })
  }
}
