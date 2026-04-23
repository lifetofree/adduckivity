import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, type Post } from '@/lib/content'

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

export default function ContentDashboard() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen" style={{ backgroundColor: ET.bg, color: ET.ink }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(250,245,236,0.92)',
          borderColor: ET.border,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Image src="/logo.png" alt="Adduckivity" width={28} height={28} className="rounded-md" />
          </Link>
          <span style={{ color: ET.border }}>/</span>
          <span className="text-sm font-semibold" style={{ color: ET.ink }}>Content</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Stats row */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold" style={{ color: ET.ink }}>{posts.length}</p>
              <p className="text-xs mt-0.5" style={{ color: ET.sub }}>
                {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
          <p className="text-xs hidden md:block" style={{ color: ET.sub }}>
            Sorted by date · newest first
          </p>
        </div>

        {/* ── Empty state ── */}
        {posts.length === 0 && (
          <div
            className="rounded-2xl border py-24 text-center"
            style={{ backgroundColor: ET.surface, borderColor: ET.border }}
          >
            <p className="text-sm mb-4" style={{ color: ET.sub }}>No posts yet.</p>
            <p className="text-xs" style={{ color: ET.sub }}>
              Create markdown files in <code className="bg-gray-100 px-1 rounded">public/content/</code>
            </p>
          </div>
        )}

        {/* ── Card grid ── */}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: Post) => (
              <Link key={post.slug} href={`/content/${post.slug}`} className="group block">
                <article
                  className="rounded-2xl border overflow-hidden transition-all duration-300 group-hover:shadow-lg"
                  style={{ backgroundColor: ET.surface, borderColor: ET.border }}
                >
                  {/* ── 16:9 Cover image ── */}
                  <div
                    className="relative w-full overflow-hidden"
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
                      /* Placeholder when no cover image */
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 120 68" className="w-20 opacity-20" fill="none">
                          <rect width="120" height="68" rx="4" fill={ET.border} />
                          <circle cx="42" cy="28" r="10" fill={ET.sub} />
                          <path d="M0 52 L30 32 L55 48 L80 30 L120 52 L120 68 L0 68 Z" fill={ET.sub} opacity="0.5" />
                        </svg>
                      </div>
                    )}

                    {/* Category pill over image */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(44,31,20,0.55)', color: '#FAF5EC' }}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="p-5">
                    <h2
                      className="font-semibold text-base leading-snug mb-1.5 line-clamp-2 transition-opacity group-hover:opacity-70"
                      style={{ color: ET.ink }}
                    >
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p
                        className="text-xs leading-relaxed line-clamp-2 mb-3"
                        style={{ color: ET.sub }}
                      >
                        {post.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((t: string) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full text-[10px] border"
                            style={{ borderColor: ET.border, color: ET.sub }}
                          >
                            #{t}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-[10px]" style={{ color: ET.sub }}>
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer meta */}
                    <div
                      className="flex items-center justify-between pt-3 border-t"
                      style={{ borderColor: ET.border }}
                    >
                      <span className="font-mono text-[11px]" style={{ color: ET.sub }}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                      <span className="text-[11px]" style={{ color: ET.sub }}>
                        {post.readingTime}
                      </span>
                    </div>
                  </div>

                  {/* Bottom accent line on hover */}
                  <div
                    className="h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: ET.accent }}
                  />
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
