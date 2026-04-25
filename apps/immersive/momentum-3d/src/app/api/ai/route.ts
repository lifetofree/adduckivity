export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { GoogleGenerativeAI } from '@google/generative-ai'

async function ask(apiKey: string, prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

function parseJSON(raw: string): unknown {
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  try { return JSON.parse(cleaned) } catch { /* fall through */ }
  const arrMatch = cleaned.match(/\[[\s\S]*\]/)
  if (arrMatch) { try { return JSON.parse(arrMatch[0]) } catch { /* fall through */ } }
  const objMatch = cleaned.match(/\{[\s\S]*\}/)
  if (objMatch) { try { return JSON.parse(objMatch[0]) } catch { /* fall through */ } }
  const lines = cleaned.split('\n').map(l => l.replace(/^[-*\d.)\s"']+/, '').replace(/["',]+$/, '').trim()).filter(Boolean)
  if (lines.length) return lines
  throw new Error('Could not parse AI response as JSON')
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('429')) {
    const wait = msg.match(/retryDelay['":\s]+(\d+)s/)?.[1]
    return wait ? `Rate limited — try again in ${wait}s` : 'Rate limited — try again shortly'
  }
  if (msg.includes('API_KEY') || msg.includes('API key')) return 'Gemini API key not configured'
  return msg.length < 120 ? msg : 'AI request failed'
}

export async function POST(req: NextRequest) {
  try {
    const { env } = getRequestContext<CloudflareEnv>()
    const apiKey = env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 })

    const body = await req.json() as {
      action: string
      title?: string
      content?: string
      excerpt?: string
      tags?: string[]
    }
    const { action } = body
    let result: unknown

    switch (action) {
      case 'titles': {
        const raw = await ask(apiKey, `Suggest 5 compelling blog post titles.\nTopic/current title: "${body.title || 'unknown'}"\nContent snippet:\n${(body.content || '').slice(0, 800)}\n\nRespond with ONLY a JSON array of 5 title strings. No explanation.`)
        result = parseJSON(raw)
        break
      }
      case 'excerpt': {
        const raw = await ask(apiKey, `Write a 1–2 sentence excerpt (max 160 characters) for this post titled "${body.title}":\n${(body.content || '').slice(0, 1500)}\n\nRespond with ONLY the excerpt text. No quotes, no explanation.`)
        result = raw.replace(/^["']|["']$/g, '').slice(0, 160)
        break
      }
      case 'outline': {
        const raw = await ask(apiKey, `Generate a structured outline for a blog post titled "${body.title}".\nContent so far:\n${(body.content || '').slice(0, 800)}\n\nRespond with ONLY a JSON array of heading strings (use ## or ### prefixes). No explanation.`)
        result = parseJSON(raw)
        break
      }
      case 'seo': {
        const raw = await ask(apiKey, `Give 5 actionable, specific SEO tips for this blog post.\nTitle: ${body.title}\nExcerpt: ${body.excerpt || '(none)'}\nTags: ${(body.tags || []).join(', ') || '(none)'}\n\nRespond with ONLY a JSON array of 5 tip strings. No explanation.`)
        result = parseJSON(raw)
        break
      }
      case 'tags': {
        const raw = await ask(apiKey, `Suggest 6 relevant tags for a blog post titled "${body.title}".\nContent:\n${(body.content || '').slice(0, 600)}\n\nRespond with ONLY a JSON array of lowercase tag strings (no # prefix). No explanation.`)
        result = parseJSON(raw)
        break
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    return NextResponse.json({ result })
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
