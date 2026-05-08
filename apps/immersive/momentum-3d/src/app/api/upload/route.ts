export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

/** Maps allowed MIME types to file extensions. Rejects any type not in this map. */
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate size before reading entire file into memory
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024} MB)` }, { status: 400 })
    }

    // Derive extension from MIME type whitelist — never trust client filename
    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
      return NextResponse.json({ error: 'Only image files are allowed (jpeg, png, gif, webp, svg)' }, { status: 400 })
    }

    const key = `uploads/${Date.now()}-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}.${ext}`
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
