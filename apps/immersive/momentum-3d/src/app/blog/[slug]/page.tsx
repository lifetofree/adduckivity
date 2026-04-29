export const runtime = 'edge'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getPostBySlug, getAllPosts, isPostLive } from '@/lib/posts'
import { renderMarkdown, extractHeadings } from '@/lib/markdown'
import { ET } from '@/lib/theme'
import { getMockKV } from '@/lib/dev-kv'

function getKV() {
  return process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
  const { slug } = await params
  const post = await getPostBySlug(getKV(), slug)
  if (!post) return {}

  const siteUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://immersive.adduckivity.com'
  const url = `${siteUrl}/blog/${slug}`
  const image = post.featuredImage?.startsWith('http') ? post.featuredImage : undefined

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: post.imageAlt || post.title }] }),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.excerpt,
      ...(image && { images: [image] }),
    },
  }
  } catch {
    return {}
  }
}


export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const kv = getKV()
  const post = await getPostBySlug(kv, slug)

  if (!post || !isPostLive(post)) notFound()

  const allPosts = await getAllPosts(kv)
  const related = allPosts
    .filter(p => p.slug !== post.slug && p.status === 'published' && (
      p.category === post.category || p.tags.some(t => post.tags.includes(t))
    ))
    .slice(0, 3)

  const bodyHtml = renderMarkdown(post.content)
  const headings = extractHeadings(post.content)
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: ET.bg, color: ET.ink }}>

      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(10,15,30,0.92)',
          borderColor: ET.border,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <Image src="/logo.png" alt="Adduckivity" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold hidden sm:block" style={{ color: ET.ink }}>Adduckivity</span>
          </Link>
          <span className="text-sm" style={{ color: ET.border }}>/</span>
          <Link href="/blog" className="text-sm transition-opacity hover:opacity-70 shrink-0" style={{ color: ET.sub }}>
            Blog
          </Link>
          <span className="text-sm hidden sm:block" style={{ color: ET.border }}>/</span>
          <span className="text-sm font-medium truncate hidden sm:block" style={{ color: ET.mid }}>{post.title}</span>
        </div>
        <Link
          href="/blog"
          className="shrink-0 text-xs font-medium transition-opacity hover:opacity-70 flex items-center gap-1"
          style={{ color: ET.sub }}
        >
          ← All posts
        </Link>
      </nav>

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
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: ET.ink }}>
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
              alt={post.imageAlt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Table of Contents */}
        {headings.length >= 2 && (
          <nav
            className="rounded-xl border mb-10 p-5"
            style={{ backgroundColor: ET.surface, borderColor: ET.border }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>
              Contents
            </p>
            <ol className="space-y-1.5">
              {headings.map((h, i) => (
                <li key={i} style={{ paddingLeft: h.level === 1 ? 0 : h.level === 2 ? '0.75rem' : '1.5rem' }}>
                  <a
                    href={`#${h.id}`}
                    className="text-sm transition-opacity hover:opacity-70 leading-snug block"
                    style={{ color: h.level === 1 ? ET.ink : ET.mid }}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Body */}
        <article className="prose-et mb-12" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-8 border-t mb-10" style={{ borderColor: ET.border }}>
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

        {/* Back CTA */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
          style={{ borderColor: ET.border, color: ET.mid, backgroundColor: ET.surface }}
        >
          ← Back to all posts
        </Link>
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
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,229,255,0.15)', color: '#00E5FF' }}>
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
      <footer className="border-t py-10 px-6" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Adduckivity" width={28} height={28} className="rounded-md" />
            <span className="font-semibold text-sm" style={{ color: ET.ink }}>Adduckivity</span>
          </div>
          <div className="flex items-center gap-7 text-xs" style={{ color: ET.sub }}>
            <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Archive</a>
            <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Tools</a>
            <a href="https://github.com/lifetofree/adduckivity" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">GitHub</a>
          </div>
          <p className="text-xs" style={{ color: ET.sub }}>Powered by Duck OS Systems</p>
        </div>
      </footer>

      <style>{`
        .prose-et p   { margin: 0 0 1.25rem; line-height: 1.8; color: ${ET.mid}; font-size: 1rem; }
        .prose-et h1  { font-size: 1.75rem; font-weight: 700; color: ${ET.ink}; margin: 2rem 0 1rem; line-height: 1.3; }
        .prose-et h2  { font-size: 1.35rem; font-weight: 700; color: ${ET.ink}; margin: 2rem 0 0.75rem; }
        .prose-et h3  { font-size: 1.1rem;  font-weight: 600; color: ${ET.ink}; margin: 1.5rem 0 0.5rem; }
        .prose-et ul, .prose-et ol { color: ${ET.mid}; }
        .prose-et li  { color: ${ET.mid}; }
        .prose-et blockquote {
          border-left: 3px solid ${ET.accent}; margin: 1.5rem 0;
          padding: 0.5rem 0 0.5rem 1.25rem; color: ${ET.sub}; font-style: italic;
          background: ${ET.accentL}; border-radius: 0 0.5rem 0.5rem 0;
        }
        .prose-et code { font-size: 0.85em; background: ${ET.muted}; color: ${ET.accent}; padding: 0.15em 0.4em; border-radius: 0.25rem; }
        .prose-et pre  { background: ${ET.muted}; color: ${ET.ink}; border-radius: 0.75rem; padding: 1.25rem 1.5rem; overflow-x: auto; margin: 1.5rem 0; font-size: 0.875rem; line-height: 1.7; }
        .prose-et pre code { background: none; color: inherit; padding: 0; }
        .prose-et a   { color: ${ET.accent}; text-decoration: underline; text-decoration-color: ${ET.accentL}; text-underline-offset: 3px; }
        .prose-et a:hover { text-decoration-color: ${ET.accent}; }
        .prose-et hr  { border: none; border-top: 1px solid ${ET.border}; margin: 2.5rem 0; }
        .prose-et strong { color: ${ET.ink}; font-weight: 600; }
        .prose-et table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
        .prose-et th { background: ${ET.muted}; color: ${ET.ink}; font-weight: 600; text-align: left; padding: 0.6rem 1rem; border: 1px solid ${ET.border}; }
        .prose-et td { color: ${ET.mid}; padding: 0.55rem 1rem; border: 1px solid ${ET.border}; }
        .prose-et tr:nth-child(even) td { background: ${ET.surface}; }
      `}</style>
    </div>
  )
}
