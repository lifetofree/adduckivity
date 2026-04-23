import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/content'

const ET = {
  bg:      '#F5EFE3',
  surface: '#FAF5EC',
  muted:   '#EDE5D8',
  border:  '#D8C9B0',
  ink:     '#2C1F14',
  mid:     '#5A4030',
  sub:     '#7B6248',
  accent:  '#C07850',
  accentL: 'rgba(192,120,80,0.12)',
}

function renderMarkdown(md: string): string {
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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  // Only show published posts to public
  if (!post || post.status !== 'published') notFound()

  const allPosts = getAllPosts()
  const related = allPosts
    .filter(p => p.slug !== post.slug && p.status === 'published' && (
      p.category === post.category || p.tags.some(t => post.tags.includes(t))
    ))
    .slice(0, 3)

  const bodyHtml = renderMarkdown(post.content)
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: ET.bg, color: ET.ink }}>

      {/* ── Nav ── */}
      <header
        className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(250,245,236,0.92)',
          borderColor: ET.border,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity shrink-0">
            <Image src="/logo.png" alt="Adduckivity" width={26} height={26} className="rounded-md" />
          </Link>
          <span style={{ color: ET.border }}>/</span>
          <Link href="/blog" className="text-sm transition-opacity hover:opacity-70 shrink-0" style={{ color: ET.sub }}>
            Blog
          </Link>
          <span style={{ color: ET.border }}>/</span>
          <span className="text-sm font-semibold truncate" style={{ color: ET.ink }}>{post.title}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">

        {/* Category */}
        <div className="mb-5">
          <span
            className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: ET.accentL, color: ET.accent }}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: ET.ink }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg leading-relaxed mb-6" style={{ color: ET.sub }}>
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b" style={{ borderColor: ET.border }}>
          <span className="font-mono text-xs" style={{ color: ET.sub }}>{formattedDate}</span>
          <span style={{ color: ET.border }}>·</span>
          <span className="text-xs" style={{ color: ET.sub }}>{post.readingTime}</span>
          <span style={{ color: ET.border }}>·</span>
          <span className="text-xs font-medium" style={{ color: ET.mid }}>{post.author}</span>
        </div>

        {/* 16:9 Cover */}
        {post.featuredImage && (
          <div
            className="relative w-full overflow-hidden rounded-2xl mb-10"
            style={{ aspectRatio: '16 / 9', backgroundColor: ET.muted }}
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Body */}
        <article className="prose-et mb-12" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-8 border-t" style={{ borderColor: ET.border }}>
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs border"
                style={{ borderColor: ET.border, color: ET.sub, backgroundColor: ET.surface }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section className="border-t py-14" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: ET.sub }}>
              Related Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(rp => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                  <article
                    className="rounded-2xl border overflow-hidden transition-all duration-300 group-hover:shadow-lg"
                    style={{ backgroundColor: ET.bg, borderColor: ET.border }}
                  >
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ aspectRatio: '16 / 9', backgroundColor: ET.muted }}
                    >
                      {rp.featuredImage ? (
                        <Image
                          src={rp.featuredImage}
                          alt={rp.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 120 68" className="w-16 opacity-20" fill="none">
                            <rect width="120" height="68" rx="4" fill={ET.border} />
                            <circle cx="42" cy="28" r="10" fill={ET.sub} />
                            <path d="M0 52 L30 32 L55 48 L80 30 L120 52 L120 68 L0 68 Z" fill={ET.sub} opacity="0.5" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm" style={{ backgroundColor: 'rgba(44,31,20,0.55)', color: '#FAF5EC' }}>
                          {rp.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 transition-opacity group-hover:opacity-70" style={{ color: ET.ink }}>
                        {rp.title}
                      </h3>
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: ET.border }}>
                        <span className="font-mono text-[11px]" style={{ color: ET.sub }}>
                          {new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-[11px]" style={{ color: ET.sub }}>{rp.readingTime}</span>
                      </div>
                    </div>
                    <div className="h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: ET.accent }} />
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-10 px-6 text-center" style={{ backgroundColor: ET.bg, borderColor: ET.border }}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <Image src="/logo.png" alt="Adduckivity" width={24} height={24} className="rounded-md" />
          <span className="text-sm font-semibold" style={{ color: ET.ink }}>Adduckivity</span>
        </div>
        <p className="text-xs" style={{ color: ET.sub }}>Duck OS — Life Architecture for Neurodivergent Creators</p>
      </footer>

      <style>{`
        .prose-et p   { margin: 0 0 1.25rem; line-height: 1.8; color: ${ET.mid}; font-size: 1rem; }
        .prose-et h1  { font-size: 1.75rem; font-weight: 700; color: ${ET.ink}; margin: 2rem 0 1rem; line-height: 1.3; }
        .prose-et h2  { font-size: 1.35rem; font-weight: 700; color: ${ET.ink}; margin: 2rem 0 0.75rem; }
        .prose-et h3  { font-size: 1.1rem;  font-weight: 600; color: ${ET.ink}; margin: 1.5rem 0 0.5rem; }
        .prose-et ul, .prose-et ol { padding-left: 1.5rem; margin: 0 0 1.25rem; color: ${ET.mid}; }
        .prose-et li  { margin-bottom: 0.4rem; line-height: 1.7; }
        .prose-et blockquote {
          border-left: 3px solid ${ET.accent}; margin: 1.5rem 0;
          padding: 0.5rem 0 0.5rem 1.25rem; color: ${ET.sub}; font-style: italic;
          background: ${ET.accentL}; border-radius: 0 0.5rem 0.5rem 0;
        }
        .prose-et code { font-size: 0.85em; background: ${ET.muted}; color: ${ET.accent}; padding: 0.15em 0.4em; border-radius: 0.25rem; }
        .prose-et pre  { background: ${ET.ink}; color: #FAF5EC; border-radius: 0.75rem; padding: 1.25rem 1.5rem; overflow-x: auto; margin: 1.5rem 0; font-size: 0.875rem; line-height: 1.7; }
        .prose-et pre code { background: none; color: inherit; padding: 0; }
        .prose-et a   { color: ${ET.accent}; text-decoration: underline; text-decoration-color: ${ET.accentL}; text-underline-offset: 3px; }
        .prose-et a:hover { text-decoration-color: ${ET.accent}; }
        .prose-et hr  { border: none; border-top: 1px solid ${ET.border}; margin: 2.5rem 0; }
        .prose-et strong { color: ${ET.ink}; font-weight: 600; }
      `}</style>
    </div>
  )
}
