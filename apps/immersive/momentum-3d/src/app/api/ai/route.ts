export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Best-effort rate limiter using a per-isolate in-memory Map.
 *
 * NOTE: Cloudflare Workers run in many short-lived isolates, so this Map is
 * reset on cold starts and is NOT shared across regions. It only protects
 * against bursts within a single warm isolate. For real per-IP throttling
 * across regions, move to a KV-backed limiter or Cloudflare's built-in rules.
 */
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

async function askMiniMax(apiKey: string, prompt: string, retries = 2): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'abab6.5s-chat',
          messages: [{ sender_type: 'USER', sender_name: 'User', text: prompt }],
          stream: false,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`MiniMax API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json() as {
        choices?: Array<{ message?: { content?: string } }>
      }
      const text = data.choices?.[0]?.message?.content || ''
      if (!text) throw new Error('Empty response from MiniMax')
      return text
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('429') && i < retries) {
        const waitTime = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }
      throw err
    }
  }
  throw new Error('Max retries exceeded')
}

async function askGemini(apiKey: string, prompt: string, retries = 2): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('429') && i < retries) {
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

    // Get API keys
    let miniMaxKey: string | undefined
    let geminiKey: string | undefined

    try {
      const ctx = getRequestContext<CloudflareEnv>()
      miniMaxKey = ctx.env.MINIMAX_API_KEY
      geminiKey = ctx.env.GEMINI_API_KEY
    } catch {
      miniMaxKey = process.env.MINIMAX_API_KEY
      geminiKey = process.env.GEMINI_API_KEY
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
    let provider = 'gemini'

    // Extract body fields to avoid circular reference in closures
    const bTitle = body.title || ''
    const bContent = body.content || ''
    const bExcerpt = body.excerpt || ''
    const bTags = body.tags || []

    // Helper to build prompts
    const buildPrompt = (act: string, title: string, content: string, excerpt: string, tags: string[]) => {
      switch (act) {
        case 'titles':
          return `Suggest 5 compelling blog post titles.\nTopic/current title: "${title || 'unknown'}"\nContent snippet:\n${(content || '').slice(0, 800)}\n\nRespond with ONLY a JSON array of 5 title strings. No explanation.`
        case 'excerpt':
          return `Write a 1–2 sentence excerpt (max 160 characters) for this post titled "${title}":\n${(content || '').slice(0, 1500)}\n\nRespond with ONLY the excerpt text. No quotes, no explanation.`
        case 'outline':
          return `Generate a structured outline for a blog post titled "${title}".\nContent so far:\n${(content || '').slice(0, 800)}\n\nRespond with ONLY a JSON array of heading strings (use ## or ### prefixes). No explanation.`
        case 'seo': {
          const tagsStr = (tags || []).join(', ') || '(none)'
          const excerptStr = excerpt || '(none)'
          return `Give 5 actionable, specific SEO tips for this blog post.\nTitle: "${title || 'unknown'}"\nExcerpt: "${excerptStr}"\nTags: "${tagsStr}"\n\nRespond with ONLY a JSON array of 5 tip strings. No explanation.`
        }
        case 'tags':
          return `Suggest 6 relevant tags for a blog post titled "${title}".\nContent:\n${(content || '').slice(0, 600)}\n\nRespond with ONLY a JSON array of lowercase tag strings (no # prefix). No explanation.`
        default:
          return ''
      }
    }

    const fallbacks: Record<string, () => string[]> = {
      titles: () => [
        `${bTitle || 'Your Topic'}: A Complete Guide`,
        `How to Master ${bTitle || 'This Topic'}`,
        `The Ultimate ${bTitle || 'Topic'} Tutorial`,
        `${bTitle || 'Your Topic'}: Tips and Strategies`,
        `Understanding ${bTitle || 'This Topic'}: A Deep Dive`
      ],
      excerpt: () => {
        const contentPreview = (bContent || '').slice(0, 100).replace(/\n+/g, ' ')
        return [`Discover ${bTitle || 'this topic'} and learn practical strategies. ${contentPreview}...`]
      },
      outline: () => [
        "## Introduction",
        "## Understanding the Problem",
        "## Key Strategies and Solutions",
        "## Step-by-Step Implementation",
        "## Common Mistakes to Avoid",
        "## Conclusion and Next Steps"
      ],
      seo: () => [
        "Use your target keyword in the first 100 words",
        "Include related keywords naturally throughout the content",
        "Write a compelling meta description under 160 characters",
        "Use descriptive alt text for images",
        "Build internal links to related content"
      ],
      tags: () => {
        const title = bTitle || 'topic'
        return [
          title.toLowerCase().replace(/\s+/g, '-'),
          'tutorial', 'guide', 'tips', 'strategies', 'how-to'
        ]
      }
    }

    const prompt = buildPrompt(action, bTitle, bContent, bExcerpt, bTags)
    if (!prompt) return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

    // Try MiniMax first
    if (miniMaxKey) {
      try {
        const raw = await askMiniMax(miniMaxKey, prompt)
        result = parseJSON(raw)
        provider = 'minimax'
      } catch (err) {
        console.error('[AI] MiniMax failed, falling back to Gemini:', err)
      }
    }

    // Fall back to Gemini if MiniMax failed or wasn't available
    if (!result && geminiKey) {
      try {
        const raw = await askGemini(geminiKey, prompt)
        result = parseJSON(raw)
        provider = 'gemini'
      } catch (err) {
        console.error('[AI] Gemini failed:', err)
      }
    }

    // Use hardcoded fallback if both AI providers failed
    if (!result || !Array.isArray(result)) {
      const fallbackFn = fallbacks[action]
      if (fallbackFn) {
        result = fallbackFn()
        provider = 'fallback'
      } else {
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
      }
    }

    return NextResponse.json({ result, provider })
  } catch (err) {
    console.error('[AI] Request failed:', err)
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 })
  }
}
