import { GoogleGenerativeAI } from '@google/generative-ai'

const getClient = () => new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

const model = () => getClient().getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

export async function suggestTitles(content: string, currentTitle?: string): Promise<string[]> {
  const prompt = `Generate 5 compelling SEO-friendly blog post titles.
Current title: "${currentTitle || 'none'}"
Content preview: ${content.slice(0, 400)}

Rules: 50–60 characters each, include main keyword, engaging tone.
Return only titles, one per line, numbered 1–5. No extra text.`

  const res = await model().generateContent(prompt)
  return res.response.text()
    .split('\n')
    .filter(l => l.trim())
    .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(l => l.length > 0)
    .slice(0, 5)
}

export async function autoExcerpt(title: string, content: string): Promise<string> {
  const prompt = `Write a meta description (excerpt) for this blog post.
Title: ${title}
Content: ${content.slice(0, 600)}

Rules: 120–160 characters, include main keyword, compelling, ends with a hook.
Return only the excerpt text.`

  const res = await model().generateContent(prompt)
  return res.response.text().trim()
}

export async function buildOutline(title: string, content: string): Promise<string[]> {
  const prompt = `Analyze this post and return a content outline.
Title: ${title}
Content: ${content}

Return a numbered outline with sub-items indented. Be concise.`

  const res = await model().generateContent(prompt)
  return res.response.text().split('\n').filter(l => l.trim())
}

export async function seoTips(title: string, excerpt: string, content: string, tags: string[]): Promise<string[]> {
  const prompt = `Give 4 actionable SEO tips for this blog post.
Title: ${title}
Excerpt: ${excerpt}
Tags: ${tags.join(', ')}
Content preview: ${content.slice(0, 500)}

Return as a numbered list. Be specific and concise.`

  const res = await model().generateContent(prompt)
  return res.response.text()
    .split('\n')
    .filter(l => l.trim())
    .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(l => l.length > 0)
    .slice(0, 5)
}

export async function suggestTags(title: string, content: string): Promise<string[]> {
  const prompt = `Generate 5–7 relevant tags for this blog post.
Title: ${title}
Content: ${content.slice(0, 500)}

Return comma-separated tags, lowercase, no hashtags.`

  const res = await model().generateContent(prompt)
  return res.response.text()
    .split(',')
    .map(t => t.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    .filter(t => t.length > 0)
    .slice(0, 7)
}
