/** Represents a heading extracted from markdown content. */
export interface Heading {
  /** Heading level (1-3). */
  level: number;
  /** Plain text content with inline formatting stripped. */
  text: string;
  /** URL-safe ID fragment for anchor links. */
  id: string;
}

/**
 * Converts a plain text string into a URL-safe ID fragment.
 * Removes special characters, replaces whitespace with hyphens, and trims.
 *
 * @param text - The text to convert.
 * @returns A lowercase, hyphenated ID string.
 */
function toId(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/^-+|-+$/g, '')
}

/**
 * Removes markdown inline formatting from text.
 * Strips bold, italic, and code syntax, leaving plain text.
 *
 * @param text - Text with markdown formatting.
 * @returns Plain text without formatting markers.
 */
function stripInline(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

/**
 * Extracts a Google Drive file ID from various URL formats.
 * Supports `/uc?export=view&id=`, `/file/d/`, and `/open?id=` patterns.
 *
 * @param url - Google Drive sharing URL.
 * @returns The file ID string, or `null` if not found.
 */
function extractGoogleDriveId(url: string): string | null {
  const ucMatch = url.match(/id=([a-zA-Z0-9_-]+)/)
  if (ucMatch) return ucMatch[1]
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) return fileMatch[1]
  const openMatch = url.match(/open\?id=([a-zA-Z0-9_-]+)/)
  if (openMatch) return openMatch[1]
  return null
}

// convertGoogleDriveUrl kept for potential future use
// function convertGoogleDriveUrl(url: string): string {
//   const fileId = extractGoogleDriveId(url)
//   if (!fileId) return url
//   if (url.includes('uc?export=view') || url.includes('drive.usercontent.google.com')) return url
//   return `https://drive.google.com/uc?export=view&id=${fileId}`
// }

/**
 * Extracts all h1-h3 headings from markdown content.
 * Generates ID fragments for anchor linking and strips inline formatting.
 *
 * @param md - Raw markdown content.
 * @returns Array of heading objects with level, text, and ID.
 */
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

/**
 * Escapes HTML attribute values to prevent attribute injection / XSS.
 */
function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Returns a safe href: only http(s) and relative URLs are allowed.
 * Strips javascript:, data:, vbscript:, and other dangerous schemes.
 */
function sanitizeUrl(url: string): string {
  const trimmed = url.trim()
  // Allow protocol-relative, root-relative, hash, and explicit http(s)/mailto.
  if (/^(https?:|mailto:|\/|#|\?)/i.test(trimmed)) return trimmed
  // Disallow anything with a colon that wasn't matched above (catches javascript:, data:, etc.)
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return '#'
  // Treat as relative path
  return trimmed
}

function applyInline(s: string): string {
  // Process images - convert Google Drive sharing URLs to direct export URLs
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    const safeAlt = escapeAttr(alt)
    let finalUrl = url
    if (url.includes('drive.google.com') && !url.includes('uc?export=view') && !url.includes('drive.usercontent.google.com')) {
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/open\?id=([a-zA-Z0-9_-]+)/)
      if (fileIdMatch) {
        finalUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`
      }
    }
    const safeUrl = escapeAttr(sanitizeUrl(finalUrl))
    return `<img src="${safeUrl}" alt="${safeAlt}" style="max-width:100%;border-radius:0.5rem;margin:1rem 0;" loading="lazy" />`
  })

  return s
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em>$1</em>')
    .replace(/`([^`]+)`/g,         '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      const safeUrl = escapeAttr(sanitizeUrl(url))
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`
    })
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

/**
 * Converts markdown content to HTML with support for:
 * - Headers (h1-h3) with auto-generated IDs
 * - Blockquotes, horizontal rules
 * - Ordered and unordered lists
 * - Tables with pipe syntax
 * - Inline formatting (bold, italic, code, links)
 * - Images with Google Drive URL conversion
 * - Fenced code blocks
 *
 * @param md - Raw markdown content.
 * @returns HTML string.
 */
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
