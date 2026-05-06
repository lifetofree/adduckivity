export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { ET } from '@/lib/theme'
import { getWordPressPosts, formatWordPressPost, getPostSeoFromHtml } from '@/lib/wordpress'
import SiteFooter from '@/components/SiteFooter'

const PlaceholderImage = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <svg viewBox="0 0 120 68" className="w-20 opacity-20" fill="none">
      <rect width="120" height="68" rx="4" fill={ET.border} />
      <circle cx="42" cy="28" r="10" fill={ET.sub} />
      <path d="M0 52 L30 32 L55 48 L80 30 L120 52 L120 68 L0 68 Z" fill={ET.sub} opacity="0.5" />
    </svg>
  </div>
)

export default async function BlogPage() {
  const wpPosts = await getWordPressPosts({ perPage: 9 })

  const posts = await Promise.all(
    wpPosts.map(async (p) => {
      const formatted = formatWordPressPost(p)
      const { seoTitle, seoDesc } = await getPostSeoFromHtml(p.link)
      formatted.seoTitle = seoTitle || formatted.title
      formatted.seoDesc = seoDesc || formatted.excerpt
      return formatted
    })
  )

  const [featured, ...rest] = posts

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
          <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>
            Tools
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute -top-20 left-1/3 w-[480px] h-[480px] rounded-full blur-3xl opacity-[0.07]"
            style={{ backgroundColor: ET.accent }}
          />
          <div
            className="absolute top-32 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-[0.04]"
            style={{ backgroundColor: ET.accent }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle, ${ET.border} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 relative text-center">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest border mb-7"
            style={{ borderColor: ET.border, color: ET.sub, backgroundColor: ET.surface }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ET.accent }} />
            Duck OS
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-5">
            Build systems,{' '}
            <span style={{ color: ET.accent }}>not stress</span>
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: ET.sub }}>
            Protocols, frameworks, and ideas for neurodivergent creators navigating work, focus, and life.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-24">

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

        {/* ── Featured post ── */}
        {featured && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest shrink-0" style={{ color: ET.sub }}>Featured</p>
              <div className="flex-1 h-px" style={{ backgroundColor: ET.border }} />
            </div>
            <a href={featured.link} target="_blank" rel="noopener noreferrer" className="group block">
              <article
                className="rounded-2xl border overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 md:flex"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}
              >
                {/* Cover */}
                <div
                  className="relative md:w-[45%] shrink-0 overflow-hidden"
                  style={{ minHeight: 240, backgroundColor: ET.muted }}
                >
                  {featured.featuredImage ? (
                    <Image
                      src={featured.featuredImage}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 45vw"
                      priority
                    />
                  ) : (
                    <PlaceholderImage />
                  )}
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm"
                      style={{ backgroundColor: 'rgba(0,229,255,0.15)', color: ET.accent }}
                    >
                      {featured.category}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 md:p-10 flex flex-col justify-center flex-1">
                  <h2 className="font-bold text-2xl md:text-3xl leading-snug mb-4" style={{ color: ET.ink }}>
                    {featured.seoTitle || featured.title}
                  </h2>
                  {featured.seoDesc && (
                    <p className="text-sm leading-relaxed line-clamp-3 mb-6" style={{ color: ET.sub }}>
                      {featured.seoDesc}
                    </p>
                  )}
                  {featured.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {featured.tags.slice(0, 4).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-[10px] border" style={{ borderColor: ET.border, color: ET.sub }}>
                          #{t.replace(/^#+/, '')}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-mono" style={{ color: ET.sub }}>
                      <span>{new Date(featured.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>{featured.readingTime}</span>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 group-hover:gap-2.5"
                      style={{ color: ET.accent }}
                    >
                      Read article <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>

                <div className="h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden" style={{ backgroundColor: ET.accent }} />
              </article>
            </a>
          </div>
        )}

        {/* ── Latest posts grid ── */}
        {rest.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest shrink-0" style={{ color: ET.sub }}>Latest Posts</p>
              <div className="flex-1 h-px" style={{ backgroundColor: ET.border }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
              {rest.map(post => (
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
                    {/* Cover */}
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
                        <PlaceholderImage />
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm"
                          style={{ backgroundColor: 'rgba(0,229,255,0.15)', color: ET.accent }}
                        >
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h2 className="font-semibold text-base leading-snug line-clamp-2" style={{ color: ET.ink }}>
                          {post.seoTitle || post.title}
                        </h2>
                        <span
                          className="shrink-0 text-lg mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1"
                          style={{ color: ET.accent }}
                          aria-hidden
                        >
                          →
                        </span>
                      </div>

                      {post.seoDesc && (
                        <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: ET.sub }}>
                          {post.seoDesc}
                        </p>
                      )}

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] border" style={{ borderColor: ET.border, color: ET.sub }}>
                              #{t.replace(/^#+/, '')}
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
          </>
        )}

        {/* ── View More ── */}
        {posts.length > 0 && (
          <div className="flex justify-center">
            <a
              href="https://wp.adduckivity.com/post/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border text-sm font-medium transition-all duration-200 hover:opacity-80 hover:-translate-y-0.5"
              style={{ borderColor: ET.accent, color: ET.accent, backgroundColor: 'rgba(0,229,255,0.06)' }}
            >
              View all posts
              <span aria-hidden>→</span>
            </a>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
