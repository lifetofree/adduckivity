import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json({ error: 'q required' }, { status: 400 })

  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) return NextResponse.json({ error: 'Unsplash key not configured' }, { status: 500 })

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${key}` } }
  )

  if (!res.ok) return NextResponse.json({ error: 'Unsplash error' }, { status: res.status })

  const data = await res.json()
  const photos = (data.results || []).map((p: Record<string, unknown>) => {
    const urls = p.urls as Record<string, string>
    const user = p.user as Record<string, string>
    return {
      id:          p.id,
      thumb:       urls.small,
      full:        urls.regular,
      alt:         p.alt_description || p.description || '',
      credit:      user.name,
      creditLink:  user.links ? (user.links as unknown as Record<string, string>).html : '',
    }
  })

  return NextResponse.json({ photos })
}
