export function renderMarkdown(md: string): string {
  return md
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em>$1</em>')
    .replace(/`([^`]+)`/g,         '<code>$1</code>')
    .replace(/^> (.+)$/gm,         '<blockquote>$1</blockquote>')
    .replace(/^---$/gm,            '<hr />')
    .replace(/^\d+\. (.+)$/gm,     '<li>$1</li>')
    .replace(/^[-*] (.+)$/gm,      '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .split(/\n{2,}/)
    .map(block => {
      const t = block.trim()
      if (!t) return ''
      if (/^<(h[1-3]|pre|blockquote|hr|li)/.test(t)) return t
      if (t.startsWith('<li>')) return `<ul>${t}</ul>`
      return `<p>${t.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')
}
