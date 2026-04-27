export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })

    const env = getRequestContext<CloudflareEnv>().env
    const siteUrl = env.SITE_URL || 'https://immersive.adduckivity.com'

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const bytes = await file.arrayBuffer()
    await env.ASSETS_BUCKET.put(key, bytes, {
      httpMetadata: { contentType: file.type },
    })

    const url = `${siteUrl}/api/assets/${key}`

    return NextResponse.json({ success: true, url, filename: key, originalName: file.name, size: file.size, type: file.type })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again or use the Unsplash picker.' }, { status: 500 })
  }
}
