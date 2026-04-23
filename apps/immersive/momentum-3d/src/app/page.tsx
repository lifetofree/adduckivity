import Image from 'next/image'
import Link from 'next/link'

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

const features = [
  {
    title: 'Momentum Protocol',
    description: 'Action over motivation. Build momentum when you don\'t feel like it.',
    image: 'https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260408-IMG-ACT-04-MOMENTUM.webp?fit=768%2C432&ssl=1',
    href: '/blog/momentum-protocol',
    badge: 'ACT-04',
  },
  {
    title: 'Digital Declutter',
    description: 'Clear the noise. Reclaim your focus and system speed.',
    image: 'https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260407-IMG-SURV-DIGITAL-DECLUTTER.webp?fit=768%2C432&ssl=1',
    href: 'https://wp.adduckivity.com/survival/digital-declutter-system-speed-up-survival-protocol',
    badge: 'SURV-01',
  },
  {
    title: 'System Awareness',
    description: 'See the invisible systems running your life.',
    image: 'https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260408-IMG-AWARE-01-INVISIBLE-SYSTEMS.webp?fit=768%2C432&ssl=1',
    href: 'https://wp.adduckivity.com/system-awareness/system-awareness-visible-architecture',
    badge: 'Foundation',
  },
  {
    title: 'Flow State Architecture',
    description: 'Turn scattered focus into sustained deep work.',
    image: 'https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260405-cnt-act-02-cover.webp?fit=768%2C432&ssl=1',
    href: 'https://wp.adduckivity.com/system-in-action/architecture-of-flow-duck-os-protocol',
    badge: 'Advanced',
  },
  {
    title: 'Single-Tasking Protocol',
    description: 'Stop multitasking. Start mastering deep work.',
    image: 'https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260407-cnt-prod-01-cover-single-tasking.webp?fit=768%2C432&ssl=1',
    href: 'https://wp.adduckivity.com/productivity-hacks/stop-scattered-focus-single-tasking-protocol-2026',
    badge: 'Productivity',
  },
  {
    title: 'Vibe Coding',
    description: 'Ship ideas to production in one night with AI.',
    image: 'https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260412-IMG-PROD-VIBE-CODE-ADDUCK.webp?fit=768%2C432&ssl=1',
    href: 'https://wp.adduckivity.com/protocols/vibe-code-idea-to-production-one-night-ai-spec',
    badge: 'Systems',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: ET.bg, color: ET.ink }}>

      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(250,245,236,0.92)',
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
            Blog
          </a>
          <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>
            Tools
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-36">
        <div className="max-w-3xl">
          <Image src="/logo.png" alt="Adduckivity" width={72} height={72} className="rounded-xl mb-10" />

          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ET.sub }}>
            Duck OS
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: ET.ink }}>
            Life Architecture
          </h1>

          <p className="text-xl md:text-2xl mb-4 leading-relaxed" style={{ color: ET.mid }}>
            For Neurodivergent Creators
          </p>

          <p className="text-base mb-12 leading-relaxed max-w-2xl" style={{ color: ET.sub }}>
            Systems over willpower. Asset-building over busywork. Momentum over motivation.
            Build your life operating system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/blog/momentum-protocol"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-sm transition-opacity hover:opacity-85"
              style={{ backgroundColor: ET.ink, color: ET.surface }}
            >
              Read Momentum Protocol
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-sm border transition-opacity hover:opacity-80"
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
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-3" style={{ color: ET.ink }}>Explore Protocols</h2>
            <p className="text-base" style={{ color: ET.sub }}>
              Evidence-based systems for ADHD/MDD creators who need more than motivation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={i} href={f.href} className="group block">
                <article
                  className="rounded-2xl border overflow-hidden transition-all duration-300 group-hover:shadow-lg"
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
                        style={{ backgroundColor: 'rgba(44,31,20,0.55)', color: '#FAF5EC' }}
                      >
                        {f.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3
                      className="font-semibold text-base leading-snug mb-1.5 transition-opacity group-hover:opacity-70"
                      style={{ color: ET.ink }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>
                      {f.description}
                    </p>
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
      <section className="border-t border-b py-16" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              { label: 'Systems over Willpower', desc: 'Reliable systems outperform unreliable motivation every time.' },
              { label: 'Assets over Effort', desc: 'Build things that compound. Output that works while you sleep.' },
              { label: 'Momentum over Perfection', desc: 'Start small, iterate fast, let the flywheel carry you.' },
            ].map(p => (
              <div key={p.label}>
                <div className="w-8 h-0.5 mx-auto mb-4" style={{ backgroundColor: ET.accent }} />
                <h3 className="font-semibold text-sm mb-2" style={{ color: ET.ink }}>{p.label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: ET.bg }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3" style={{ color: ET.ink }}>Start Your Flywheel</h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: ET.sub }}>
            Pick one protocol. Run it for 7 days. Build from there.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-sm transition-opacity hover:opacity-85"
            style={{ backgroundColor: ET.accent, color: ET.surface }}
          >
            Browse All Posts
          </Link>
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
            <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Blog</a>
            <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Tools</a>
            <a href="https://github.com/lifetofree/adduckivity" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">GitHub</a>
          </div>
          <p className="text-xs" style={{ color: ET.sub }}>Powered by Duck OS Systems</p>
        </div>
      </footer>
    </div>
  )
}
