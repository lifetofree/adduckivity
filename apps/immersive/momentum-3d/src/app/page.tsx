export const runtime = 'edge'

import Image from 'next/image'
import Link from 'next/link'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getPublishedPosts } from '@/lib/posts'
import { getMockKV } from '@/lib/dev-kv'
import { ET } from '@/lib/theme'
import EmailCTA from '@/components/EmailCTA'

const pinnedFeature = {
  title: 'Emergency Recovery',
  description: 'A 5-step fail-safe for when burnout spirals begin.',
  image: '/uploads/emergency-recovery-cover.svg',
  href: '/momentum',
  badge: 'Fail-Safe',
}

const principles = [
  {
    label: 'Systems over Willpower',
    desc: 'Reliable systems outperform unreliable motivation every time.',
    num: '01',
  },
  {
    label: 'Assets over Effort',
    desc: 'Build things that compound. Output that works while you sleep.',
    num: '02',
  },
  {
    label: 'Momentum over Perfection',
    desc: 'Start small, iterate fast, let the flywheel carry you.',
    num: '03',
  },
]

export default async function Home() {
  const kv = process.env.NODE_ENV === 'development'
    ? getMockKV()
    : getRequestContext<CloudflareEnv>().env.POSTS_KV
  const cmsPosts = await getPublishedPosts(kv)

  // Map CMS posts to feature card format
  const mappedFeatures = cmsPosts
    .filter(p => p.slug !== 'emergency-recovery') // Prevent duplicate if it exists in CMS
    .map(p => ({
      title: p.title,
      description: p.excerpt || 'Read the full protocol in Duck OS.',
      image: p.featuredImage || 'https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260408-IMG-AWARE-01-INVISIBLE-SYSTEMS.webp?fit=768%2C432&ssl=1',
      href: `/blog/${p.slug}`,
      badge: p.category.toUpperCase(),
    }))

  // Final features: Pinned first, then CMS posts, limit to 12 total
  const features = [pinnedFeature, ...mappedFeatures].slice(0, 12)

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
          <Link href="/blog" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>
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

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        <div className="max-w-3xl">
          {/* eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <Image src="/logo.png" alt="Adduckivity" width={40} height={40} className="rounded-xl" />
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: ET.sub, borderColor: ET.border, backgroundColor: ET.surface }}
            >
              Duck OS
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-[0.95] tracking-tight" style={{ color: ET.ink }}>
            Life{' '}
            <span style={{ color: ET.accent }}>Architecture</span>
          </h1>

          <p className="text-xl md:text-2xl mb-4 font-medium leading-relaxed" style={{ color: ET.mid }}>
            For Neurodivergent Creators
          </p>

          <p className="text-base mb-12 leading-relaxed max-w-xl" style={{ color: ET.sub }}>
            Systems over willpower. Asset-building over busywork. Momentum over motivation.
            Build your life operating system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/momentum"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-85 hover:gap-3"
              style={{ backgroundColor: ET.ink, color: ET.surface }}
            >
              Read Momentum Protocol
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-sm border transition-all hover:opacity-80"
              style={{ borderColor: ET.border, color: ET.mid, backgroundColor: ET.surface }}
            >
              Browse All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section
        className="border-t py-20"
        style={{ borderColor: ET.border }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: ET.ink }}>Explore Protocols</h2>
              <p className="text-sm" style={{ color: ET.sub }}>
                Evidence-based systems for ADHD/MDD creators who need more than motivation.
              </p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium shrink-0 transition-opacity hover:opacity-70 flex items-center gap-1"
              style={{ color: ET.accent }}
            >
              View all <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={i} href={f.href} className="group block">
                <article
                  className="rounded-2xl border overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1"
                  style={{ backgroundColor: ET.surface, borderColor: ET.border }}
                >
                  {/* 16:9 image */}
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: '16 / 9', backgroundColor: ET.muted }}
                  >
                    <Image
                      src={f.image}
                      alt={f.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Badge pill */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(0,229,255,0.15)', color: '#00E5FF' }}
                      >
                        {f.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex items-start justify-between gap-3">
                    <div>
                      <h3
                        className="font-semibold text-base leading-snug mb-1.5"
                        style={{ color: ET.ink }}
                      >
                        {f.title}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>
                        {f.description}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-lg mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1"
                      style={{ color: ET.accent }}
                      aria-hidden
                    >
                      →
                    </span>
                  </div>

                  {/* Hover accent line */}
                  <div
                    className="h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: ET.accent }}
                  />
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Principles strip ── */}
      <section className="border-t border-b py-20" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-12 text-center" style={{ color: ET.sub }}>
            Core Principles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {principles.map(p => (
              <div key={p.label} className="flex flex-col gap-3">
                <span className="text-3xl font-bold tabular-nums leading-none" style={{ color: ET.accentL.replace('0.12', '0.5') }}>
                  {p.num}
                </span>
                <div
                  className="w-10 h-0.5 rounded-full"
                  style={{ backgroundColor: ET.accent }}
                />
                <h3 className="font-semibold text-sm" style={{ color: ET.ink }}>{p.label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-28 px-6 text-center relative overflow-hidden"
        style={{ backgroundColor: ET.bg }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,229,255,0.08) 0%, transparent 70%)`,
          }}
        />
        <div className="relative max-w-xl mx-auto">
          <div
            className="w-12 h-0.5 mx-auto mb-8 rounded-full"
            style={{ backgroundColor: ET.accent }}
          />
          <h2 className="text-3xl font-bold mb-4 leading-tight" style={{ color: ET.ink }}>
            Start Your Flywheel
          </h2>
          <p className="text-sm mb-10 leading-relaxed" style={{ color: ET.sub }}>
            Pick one protocol. Run it for 7 days. Build from there.
          </p>
          <EmailCTA />
          <div className="mt-6 text-center">
            <Link
              href="/blog"
              className="text-sm font-medium transition-opacity hover:opacity-70 flex items-center gap-1 justify-center"
              style={{ color: ET.sub }}
            >
              Browse all posts <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

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
          </div>
          <p className="text-xs" style={{ color: ET.sub }}>Powered by Duck OS Systems</p>
        </div>
      </footer>
    </div>
  )
}
