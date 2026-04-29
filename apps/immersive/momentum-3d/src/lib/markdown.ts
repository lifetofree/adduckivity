export interface Heading { level: number; text: string; id: string }

function toId(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
}

function stripInline(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

export function extractHeadings(md: string): Heading[] {
  const result: Heading[] = []
  const regex = /^(#{1,3}) (.+)$/gm
  let m
  while ((m = regex.exec(md)) !== null) {
    const raw = m[2].trim()
    result.push({ level: m[1].length, text: stripInline(raw), id: toId(raw) })
  }
  return result
}

function applyInline(s: string): string {
  return s
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em>$1</em>')
    .replace(/`([^`]+)`/g,         '<code>$1</code>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:0.5rem;margin:1rem 0;" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,  '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

function parseTable(block: string): string {
  const lines = block.trim().split('\n').map(l => l.trim())
  if (lines.length < 3) return `<p>${block}</p>`
  const isSep = (l: string) => /^\|[\s|:-]+\|$/.test(l)
  if (!isSep(lines[1])) return `<p>${block}</p>`
  const cells = (l: string) => l.replace(/^\||\|$/g, '').split('|').map(c => applyInline(c.trim()))
  const headers = cells(lines[0])
  const rows = lines.slice(2).map(cells)
  const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`
  const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`
  return `<table>${thead}${tbody}</table>`
}

export function renderMarkdown(md: string): string {
  // Pre-process: fenced code blocks and block-level elements (preserve as-is)
  const processed = md
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^### (.+)$/gm, (_, t) => `<h3 id="${toId(t)}">${applyInline(t)}</h3>`)
    .replace(/^## (.+)$/gm,  (_, t) => `<h2 id="${toId(t)}">${applyInline(t)}</h2>`)
    .replace(/^# (.+)$/gm,   (_, t) => `<h1 id="${toId(t)}">${applyInline(t)}</h1>`)
    .replace(/^> (.+)$/gm,   (_, t) => `<blockquote>${applyInline(t)}</blockquote>`)
    .replace(/^---$/gm, '<hr />')
    .replace(/^\d+\. (.+)$/gm, (_, t) => `<oli>${applyInline(t)}</oli>`)
    .replace(/^[-*] (.+)$/gm,  (_, t) => `<li>${applyInline(t)}</li>`)

  return processed
    .split(/\n{2,}/)
    .map(block => {
      const t = block.trim()
      if (!t) return ''
      if (/^<(h[1-3]|pre|blockquote|hr|img)/.test(t)) return t
      if (t.startsWith('<oli>')) return `<ol>${t.replace(/<\/?oli>/g, m => m === '<oli>' ? '<li>' : '</li>')}</ol>`
      if (t.startsWith('<li>')) return `<ul>${t}</ul>`
      // Table: all lines start with |
      const lines = t.split('\n')
      if (lines.length >= 3 && lines.every(l => l.trim().startsWith('|'))) {
        return parseTable(t)
      }
      return `<p>${applyInline(t).replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')
}
