export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Simple in-memory rate limiter for edge runtime
const rateLimiter = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimiter.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimiter.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= maxRequests) {
    return false
  }
  
  record.count++
  return true
}

async function ask(apiKey: string, prompt: string, retries = 2): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  // Use stable model with better rate limits
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('429') && i < retries) {
        // Exponential backoff: 1s, 2s, 4s...
        const waitTime = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }
      throw err
    }
  }
  throw new Error('Max retries exceeded')
}

function parseJSON(raw: string): unknown {
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  try { return JSON.parse(cleaned) } catch { /* fall through */ }
  
  // Try to find JSON array in response
  const arrMatch = cleaned.match(/\[[\s\S]*\]/)
  if (arrMatch) { try { return JSON.parse(arrMatch[0]) } catch { /* fall through */ } }
  
  // Try to find JSON object in response
  const objMatch = cleaned.match(/\{[\s\S]*\}/)
  if (objMatch) { try { return JSON.parse(objMatch[0]) } catch { /* fall through */ } }
  
  // Fallback: parse as line-by-line text
  const lines = cleaned.split('\n').map(l => l.replace(/^[-*\d.)\s"']+/, '').replace(/["',]+$/, '').trim()).filter(Boolean)
  if (lines.length) return lines
  
  console.error('[AI] Failed to parse response:', raw.substring(0, 200))
  throw new Error('Could not parse AI response as JSON')
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit')) {
    return 'AI is thinking too hard. Please wait 10-20 seconds and try again.'
  }
  if (msg.includes('API_KEY') || msg.includes('API key')) return 'AI not configured - check API key'
  if (msg.includes('Max retries exceeded')) return 'Service temporarily busy - please try again'
  return msg.length < 100 ? msg : 'AI request failed - please try again'
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP address
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json({ error: 'Too many AI requests - please wait a minute' }, { status: 429 })
    }

    const apiKey = process.env.NODE_ENV === 'development'
      ? process.env.GEMINI_API_KEY || ''
      : getRequestContext<CloudflareEnv>().env.GEMINI_API_KEY

    if (!apiKey) {
      console.error('[AI] API key not configured')
      return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 })
    }

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
        const tags = (body.tags || []).join(', ') || '(none)'
        const excerpt = body.excerpt || '(none)'
        const prompt = `Give 5 actionable, specific SEO tips for this blog post.\nTitle: "${body.title || 'unknown'}"\nExcerpt: "${excerpt}"\nTags: "${tags}"\n\nRespond with ONLY a JSON array of 5 tip strings. No explanation.`
        
        try {
          const raw = await ask(apiKey, prompt)
          console.log('[AI] SEO response received, length:', raw.length)
          result = parseJSON(raw)
        } catch (parseErr) {
          console.error('[AI] SEO parse error, returning fallback')
          // Return fallback SEO tips if parsing fails
          result = [
            "Use your target keyword in the first 100 words",
            "Include related keywords naturally throughout the content",
            "Write a compelling meta description under 160 characters",
            "Use descriptive alt text for images",
            "Build internal links to related content"
          ]
        }
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
    console.error('[AI] Request failed:', err)
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
