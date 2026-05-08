import { describe, it, expect } from 'vitest'
import { renderMarkdown, extractHeadings } from './markdown'

describe('renderMarkdown — XSS sanitization (ISSUESTOFIX #27, #28)', () => {
  it('strips javascript: URIs from links', () => {
    const html = renderMarkdown('[click](javascript:alert(1))')
    expect(html).not.toContain('javascript:')
    expect(html).toContain('href="#"')
  })

  it('strips data: URIs from links', () => {
    const html = renderMarkdown('[click](data:text/html,<script>alert(1)</script>)')
    expect(html).not.toContain('data:')
    expect(html).toContain('href="#"')
  })

  it('strips vbscript: URIs from links', () => {
    const html = renderMarkdown('[click](vbscript:msgbox(1))')
    expect(html).not.toContain('vbscript:')
  })

  it('preserves http and https links', () => {
    const html = renderMarkdown('[ok](https://example.com)')
    expect(html).toContain('href="https://example.com"')
  })

  it('preserves relative and hash links', () => {
    expect(renderMarkdown('[a](/internal)')).toContain('href="/internal"')
    expect(renderMarkdown('[b](#anchor)')).toContain('href="#anchor"')
  })

  it('escapes double quotes in image alt text so injected event handlers cannot break out', () => {
    const html = renderMarkdown('![" onerror="alert(1)" x="](https://example.com/img.png)')
    // The double-quote that would close the alt attribute must be escaped.
    // We can't assert "onerror=" is absent because escapeAttr keeps it as text;
    // what matters is that a raw, unescaped " never appears inside the alt value.
    const altMatch = html.match(/alt="([^"]*)"/)
    expect(altMatch).not.toBeNull()
    expect(altMatch![1]).toContain('&quot;')
    expect(altMatch![1]).not.toMatch(/[^&]"/) // no raw " inside the alt value
  })

  it('escapes < and > in image alt text', () => {
    const html = renderMarkdown('![<script>x</script>](https://example.com/img.png)')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe('renderMarkdown — happy path', () => {
  it('renders headings with anchor IDs', () => {
    const html = renderMarkdown('## Hello World')
    expect(html).toContain('id="hello-world"')
    expect(html).toContain('Hello World')
  })

  it('renders bold and italic', () => {
    const html = renderMarkdown('**bold** and *italic*')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<em>italic</em>')
  })
})

describe('extractHeadings', () => {
  it('extracts level/text/id for h1-h3', () => {
    const md = '# A\n## B\n### C'
    const headings = extractHeadings(md)
    expect(headings).toHaveLength(3)
    expect(headings[0]).toMatchObject({ level: 1, text: 'A', id: 'a' })
    expect(headings[2]).toMatchObject({ level: 3, text: 'C', id: 'c' })
  })
})
