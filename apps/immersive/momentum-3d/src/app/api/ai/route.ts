import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

async function ask(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('429')) {
    const wait = msg.match(/retryDelay":"(\d+)s"/)?.[1]
    return wait ? `Rate limited — try again in ${wait}s` : 'Rate limited — try again shortly'
  }
  return 'AI request failed'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    let result: unknown

    switch (action) {
      case 'titles': {
        const raw = await ask(
          `Suggest 5 compelling blog post titles for content about: "${body.title || ''}".\nExisting content:\n${(body.content || '').slice(0, 1000)}\nReturn only a JSON array of strings, no explanation.`
        )
        result = JSON.parse(raw.replace(/```json|```/g, '').trim())
        break
      }
      case 'excerpt': {
        const raw = await ask(
          `Write a 1-2 sentence excerpt (max 160 chars) for this blog post titled "${body.title}":\n${(body.content || '').slice(0, 1500)}\nReturn only the excerpt text, no quotes.`
        )
        result = raw.slice(0, 160)
        break
      }
      case 'outline': {
        const raw = await ask(
          `Generate a structured outline for a blog post titled "${body.title}".\nContent so far:\n${(body.content || '').slice(0, 1000)}\nReturn as a JSON array of heading strings (include ##/### prefix).`
        )
        result = JSON.parse(raw.replace(/```json|```/g, '').trim())
        break
      }
      case 'seo': {
        const raw = await ask(
          `Give 5 actionable SEO tips for a blog post:\nTitle: ${body.title}\nExcerpt: ${body.excerpt || ''}\nTags: ${(body.tags || []).join(', ')}\nReturn only a JSON array of tip strings.`
        )
        result = JSON.parse(raw.replace(/```json|```/g, '').trim())
        break
      }
      case 'tags': {
        const raw = await ask(
          `Suggest 5-8 relevant tags for a blog post titled "${body.title}".\nContent:\n${(body.content || '').slice(0, 800)}\nReturn only a JSON array of lowercase tag strings (no # prefix).`
        )
        result = JSON.parse(raw.replace(/```json|```/g, '').trim())
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
