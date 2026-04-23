export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { savePost, toSlug } from '@/lib/posts'

// Auto-save / upsert — preserves existing status if not provided
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.title) return NextResponse.json({ error: 'title required' }, { status: 400 })

    const slug = body.slug || toSlug(body.title)
    const post = savePost({ ...body, slug, content: body.content || '' })
    return NextResponse.json(post)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
