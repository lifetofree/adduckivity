export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { ET } from '@/lib/theme'
import { getWordPressPosts, formatWordPressPost } from '@/lib/wordpress'

export default async function BlogPage() {
  // Fetch posts from WordPress
  const wpPosts = await getWordPressPosts({ perPage: 20 })
  const posts = wpPosts.map(formatWordPressPost)

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
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Adduckivity" width={36} height={36} className="rounded-lg" />
          <span className="font-semibold text-lg" style={{ color: ET.ink }}>Adduckivity</span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          <Link href="/blog" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.accent }}>
            Blog
          </Link>
          <Link href="/momentum" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>
            3D Experience
          </Link>
          <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>
            Archive
          </a>
          <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>
            Tools
          </a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">

        {/* ── Page header ── */}
        <div className="py-16 md:py-20 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ET.sub }}>
            Duck OS · Archive
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3" style={{ color: ET.ink }}>
                All <span style={{ color: ET.accent }}>Posts</span>
              </h1>
              <p className="text-sm" style={{ color: ET.sub }}>
                {posts.length} {posts.length === 1 ? 'article' : 'articles'} from the WordPress archive · systems, protocols, and ideas for neurodivergent creators
              </p>
            </div>
            {posts.length > 0 && (
              <span
                className="shrink-0 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border"
                style={{ borderColor: ET.border, color: ET.sub, backgroundColor: ET.surface }}
              >
                {posts.length} Posts
              </span>
            )}
          </div>
        </div>

        {/* ── Empty ── */}
        {posts.length === 0 && (
          <div
            className="rounded-2xl border py-24 text-center my-12"
            style={{ backgroundColor: ET.surface, borderColor: ET.border }}
          >
            <p className="text-sm mb-2" style={{ color: ET.sub }}>No posts found</p>
            <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:opacity-70" style={{ color: ET.accent }}>
              Visit the WordPress archive →
            </a>
          </div>
        )}

        {/* ── Card grid ── */}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {posts.map(post => (
              <a
                key={post.slug}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <article
                  className="rounded-2xl border overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col"
                  style={{ backgroundColor: ET.surface, borderColor: ET.border }}
                >
                  {/* 16:9 cover */}
                  <div
                    className="relative w-full overflow-hidden shrink-0"
                    style={{ aspectRatio: '16 / 9', backgroundColor: ET.muted }}
                  >
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 120 68" className="w-20 opacity-20" fill="none">
                          <rect width="120" height="68" rx="4" fill={ET.border} />
                          <circle cx="42" cy="28" r="10" fill={ET.sub} />
                          <path d="M0 52 L30 32 L55 48 L80 30 L120 52 L120 68 L0 68 Z" fill={ET.sub} opacity="0.5" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(0,229,255,0.15)', color: '#00E5FF' }}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h2
                        className="font-semibold text-base leading-snug line-clamp-2"
                        style={{ color: ET.ink }}
                      >
                        {post.title}
                      </h2>
                      <span
                        className="shrink-0 text-lg mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1"
                        style={{ color: ET.accent }}
                        aria-hidden
                      >
                        →
                      </span>
                    </div>

                    {post.excerpt && (
                      <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: ET.sub }}>
                        {post.excerpt}
                      </p>
                    )}

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-[10px] border" style={{ borderColor: ET.border, color: ET.sub }}>
                            #{t}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-[10px]" style={{ color: ET.sub }}>+{post.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: ET.border }}>
                      <span className="font-mono text-[11px]" style={{ color: ET.sub }}>
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[11px]" style={{ color: ET.sub }}>{post.readingTime}</span>
                    </div>
                  </div>

                  <div className="h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: ET.accent }} />
                </article>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
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
    </div>
  )
}
