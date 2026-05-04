export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { ET } from '@/lib/theme'
import EmailCTA from '@/components/EmailCTA'

const pinnedFeatures = [
  {
    title: 'Emergency Recovery',
    description: 'A 5-step fail-safe for when burnout spirals begin. Run the reset protocol in under 10 minutes.',
    image: '/uploads/emergency-recovery-cover.svg',
    href: '/momentum',
    badge: 'Fail-Safe',
    accentColor: '#ff4444',
    accentBg: 'rgba(255,68,68,0.15)',
    accentBorder: 'rgba(255,68,68,0.3)',
    complexity: 'low' as const,
  },
  {
    title: 'Protocol Builder',
    description: 'Architect your momentum constellation. Map tasks in 3D space to bypass emotional resistance.',
    image: '/uploads/protocol-builder-cover.svg',
    href: '/protocol-builder',
    badge: 'System Architect',
    accentColor: ET.accent,
    accentBg: 'rgba(0,229,255,0.15)',
    accentBorder: 'rgba(0,229,255,0.3)',
    complexity: 'high' as const,
  },
  {
    title: 'The Atomizer',
    description: 'Break intimidating projects into 2-minute atomic steps with AI.',
    image: '/uploads/atomizer-cover.svg',
    href: '/atomizer',
    badge: 'Executive Tool',
    accentColor: ET.accent,
    accentBg: 'rgba(0,229,255,0.15)',
    accentBorder: 'rgba(0,229,255,0.3)',
    complexity: 'high' as const,
  },
  {
    title: 'Ignite Momentum',
    description: '600-second power-up sequence to break inertia and launch into flow state.',
    image: '/uploads/ignition-cover.svg',
    href: '/ignition',
    badge: 'Quick Launch',
    accentColor: '#f43f5e',
    accentBg: 'rgba(244,63,94,0.15)',
    accentBorder: 'rgba(244,63,94,0.3)',
    complexity: 'medium' as const,
  },
]

const principles = [
  { label: 'Systems over Willpower', desc: 'Reliable systems outperform unreliable motivation every time.', num: '01' },
  { label: 'Assets over Effort', desc: 'Build things that compound. Output that works while you sleep.', num: '02' },
  { label: 'Momentum over Perfection', desc: 'Start small, iterate fast, let the flywheel carry you.', num: '03' },
]

const painPoints = [
  {
    num: '01',
    pain: "Can't make yourself start",
    reframe: 'The Atomizer breaks any task into 2-minute physical actions — no willpower required.',
    href: '/atomizer',
    accent: ET.accent,
  },
  {
    num: '02',
    pain: 'Spiral when overwhelmed',
    reframe: 'Emergency Recovery runs a 5-step fail-safe that stops the spiral in under 10 minutes.',
    href: '/momentum',
    accent: '#ff4444',
  },
  {
    num: '03',
    pain: 'Plans collapse without structure',
    reframe: 'Protocol Builder maps your momentum in 3D space so you always know the next move.',
    href: '/protocol-builder',
    accent: '#a78bfa',
  },
]

const differentiators = [
  {
    title: 'Zero willpower required',
    desc: 'Every protocol is engineered for your worst days. If it needs motivation to start, it\'s not in the OS.',
    accent: ET.accent,
  },
  {
    title: '2-minute atomic steps',
    desc: 'Tasks are sliced until they\'re physically impossible to resist starting. Activation energy: zero.',
    accent: '#a78bfa',
  },
  {
    title: 'Evidence-based, not hustle',
    desc: 'Built on ADHD and behavioral science research. No "just try harder." No toxic positivity.',
    accent: ET.accent,
  },
  {
    title: 'Fail-safes, not shame spirals',
    desc: 'When you crash, there\'s a protocol for that. Reset and rebuild — every single time.',
    accent: '#ff4444',
  },
]

const stats = [
  { value: '4', label: 'OS Tools' },
  { value: '2 min', label: 'Atomic steps' },
  { value: '5 steps', label: 'Emergency reset' },
]

export default function Home() {
  // Remove dynamic KV data fetching to reduce bundle size
  const latestPosts: Array<{
    title: string
    description: string
    image: string
    href: string
    badge: string
  }> = []

  return (
    <div className="min-h-screen" style={{ backgroundColor: ET.bg, color: ET.ink }}>
      <style>{`
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(60px, -40px) scale(1.1); opacity: 0.75; }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-80px, 30px) scale(0.9); opacity: 0.6; }
        }
        @keyframes orb3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.25; }
          33% { transform: translate(40px, 20px); opacity: 0.45; }
          66% { transform: translate(-20px, -30px); opacity: 0.35; }
        }
        @keyframes bounce-y {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(8px); opacity: 0.7; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ minHeight: 'calc(100vh - 56px)', paddingTop: '6rem', paddingBottom: '8rem' }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div style={{
            position: 'absolute', top: '15%', left: '10%',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,229,255,0.13) 0%, transparent 70%)',
            animation: 'orb1 14s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '8%',
            width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
            animation: 'orb2 18s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', top: '45%', left: '55%',
            width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,68,68,0.07) 0%, transparent 70%)',
            animation: 'orb3 22s ease-in-out infinite',
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: ET.border, backgroundColor: ET.surface, color: ET.sub }}
          >
            <Image src="/logo.png" alt="" width={14} height={14} className="rounded opacity-60" />
            Duck OS · For Neurodivergent Creators
          </div>

          {/* Headline */}
          <h1
            className="font-bold leading-[0.88] tracking-tight mb-8"
            style={{ fontSize: 'clamp(3rem, 10vw, 6.5rem)', color: ET.ink }}
          >
            Stop Fighting<br />
            Your <span style={{ color: ET.accent }}>Brain.</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium mb-4 leading-relaxed" style={{ color: ET.mid }}>
            Build systems that work <em>with</em> it.
          </p>

          <p className="text-sm sm:text-base mb-14 max-w-xl mx-auto leading-relaxed" style={{ color: ET.sub }}>
            Evidence-based OS tools for ADHD and MDD creators.
            Systems over willpower. Assets over effort. Momentum over motivation.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/momentum"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 border border-red-500/40"
              style={{
                backgroundColor: '#ff4444',
                color: '#fff',
                boxShadow: '0 0 28px rgba(255,68,68,0.35)',
              }}
            >
              ⚠️ Emergency Reset — 2 min
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all hover:border-white/20 border"
              style={{ borderColor: ET.border, color: ET.mid }}
            >
              Explore the OS ↓
            </a>
          </div>

          {/* Scroll indicator */}
          <div style={{ color: ET.sub, animation: 'bounce-y 2.5s ease-in-out infinite', display: 'inline-block' }} aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Pain Hook ── */}
      <section className="border-t" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest mb-12 text-center" style={{ color: ET.sub }}>
            Sound familiar?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map(p => (
              <Link key={p.num} href={p.href} className="group block">
                <div
                  className="p-6 rounded-2xl border transition-all duration-300 group-hover:-translate-y-1 h-full"
                  style={{ borderColor: ET.border, backgroundColor: ET.bg }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl font-bold tabular-nums" style={{ color: p.accent, opacity: 0.5 }}>
                      {p.num}
                    </span>
                    <div className="h-px flex-1" style={{ backgroundColor: p.accent, opacity: 0.2 }} />
                  </div>
                  <h3 className="text-base font-semibold mb-3" style={{ color: ET.ink }}>
                    &ldquo;{p.pain}&rdquo;
                  </h3>
                  <p className="text-xs leading-relaxed mb-5" style={{ color: ET.sub }}>
                    {p.reframe}
                  </p>
                  <span className="text-xs font-semibold transition-all group-hover:gap-2 flex items-center gap-1.5" style={{ color: p.accent }}>
                    Try it <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools Showcase ── */}
      <section className="border-t py-24" id="tools" style={{ borderColor: ET.border }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Duck OS Tools</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: ET.ink }}>Your Operating System</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pinnedFeatures.map((f, i) => (
              <Link key={i} href={f.href} className="group block">
                <article
                  className="rounded-2xl border overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col"
                  style={{ backgroundColor: ET.surface, borderColor: ET.border }}
                >
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9', backgroundColor: ET.muted }}>
                    <Image
                      src={f.image}
                      alt={f.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm"
                        style={{ backgroundColor: f.accentBg, color: f.accentColor }}
                      >
                        {f.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-base mb-2" style={{ color: ET.ink }}>{f.title}</h3>
                    <p className="text-xs leading-relaxed flex-1" style={{ color: ET.sub }}>{f.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: f.accentColor }}>
                        Open tool
                      </span>
                      <span
                        className="opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1"
                        style={{ color: f.accentColor }}
                        aria-hidden
                      >→</span>
                    </div>
                  </div>

                  <div
                    className="h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: f.accentColor }}
                  />
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="border-t border-b py-20" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-12 text-center" style={{ color: ET.sub }}>
            Core Principles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {principles.map(p => (
              <div key={p.label} className="flex flex-col gap-3">
                <span className="text-3xl font-bold tabular-nums leading-none" style={{ color: 'rgba(0,229,255,0.4)' }}>
                  {p.num}
                </span>
                <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: ET.accent }} />
                <h3 className="font-semibold text-sm" style={{ color: ET.ink }}>{p.label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="py-20 border-b" style={{ borderColor: ET.border }}>
        <div className="max-w-5xl mx-auto px-6">
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-16 mb-16">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-bold mb-1" style={{ color: ET.accent }}>{s.value}</div>
                <div className="text-[11px] uppercase tracking-widest" style={{ color: ET.sub }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Differentiators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {differentiators.map((d, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border flex gap-4"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}
              >
                <div
                  className="w-1 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: d.accent, minHeight: 40, opacity: 0.7 }}
                />
                <div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: ET.ink }}>{d.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Email CTA ── */}
      <section
        className="py-28 px-6 text-center relative overflow-hidden"
        style={{ backgroundColor: ET.bg }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,229,255,0.08) 0%, transparent 70%)' }}
          aria-hidden
        />
        <div className="relative max-w-xl mx-auto">
          <div className="w-12 h-0.5 mx-auto mb-8 rounded-full" style={{ backgroundColor: ET.accent }} />
          <h2 className="text-3xl font-bold mb-4 leading-tight" style={{ color: ET.ink }}>
            Start Your Flywheel
          </h2>
          <p className="text-sm mb-10 leading-relaxed" style={{ color: ET.sub }}>
            Pick one protocol. Run it for 7 days. Build from there.
          </p>
          <EmailCTA />
          <div className="mt-6">
            <Link
              href="/blog"
              className="text-sm font-medium transition-opacity hover:opacity-70 inline-flex items-center gap-1"
              style={{ color: ET.sub }}
            >
              Browse all posts <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest Protocols ── */}
      {latestPosts.length > 0 && (
        <section className="border-t py-20" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ET.sub }}>From the Field</p>
                <h2 className="text-2xl font-bold" style={{ color: ET.ink }}>Latest Protocols</h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity"
                style={{ color: ET.accent }}
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((f, i) => (
                <Link key={i} href={f.href} className="group block">
                  <article
                    className="rounded-2xl border overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col h-full"
                    style={{ backgroundColor: ET.bg, borderColor: ET.border }}
                  >
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9', backgroundColor: ET.muted }}>
                      {f.image && (
                        <Image
                          src={f.image}
                          alt={f.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm"
                          style={{ backgroundColor: 'rgba(0,229,255,0.15)', color: ET.accent }}
                        >
                          {f.badge}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex items-start justify-between gap-3 flex-1">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-base leading-snug mb-1.5 line-clamp-2" style={{ color: ET.ink }}>{f.title}</h3>
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: ET.sub }}>{f.description}</p>
                      </div>
                      <span
                        className="shrink-0 text-lg mt-0.5 opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1"
                        style={{ color: ET.accent }}
                        aria-hidden
                      >→</span>
                    </div>
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
      )}

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: ET.surface }}>
        {/* Cyan glow divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.35) 50%, transparent 100%)` }} />

        {/* Main columns */}
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <Image src="/logo.png" alt="Adduckivity" width={36} height={36} className="rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="font-bold text-base" style={{ color: ET.ink }}>Adduckivity</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: ET.sub }}>
              Life architecture for neurodivergent creators.
              Evidence-based OS tools built for ADHD and MDD brains — not hustle culture.
            </p>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-lg border w-fit"
              style={{ color: ET.sub, borderColor: ET.border, backgroundColor: ET.bg }}
            >
              Duck OS · v1.0 · STABLE
            </span>
          </div>

          {/* Navigate */}
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: ET.sub }}>Navigate</p>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Blog', href: '/blog', internal: true },
                { label: '3D Experience', href: '/momentum', internal: true },
                { label: 'Tools', href: 'https://duckshort.cc', internal: false },
              ].map(l => l.internal
                ? <Link key={l.label} href={l.href} className="text-xs transition-all hover:translate-x-0.5 hover:opacity-100 opacity-60 w-fit" style={{ color: ET.mid }}>{l.label}</Link>
                : <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-xs transition-all hover:translate-x-0.5 hover:opacity-100 opacity-60 w-fit" style={{ color: ET.mid }}>{l.label}</a>
              )}
            </nav>
          </div>

          {/* OS Tools */}
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: ET.sub }}>OS Tools</p>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Emergency Recovery', href: '/momentum', accent: '#ff4444' },
                { label: 'Protocol Builder', href: '/protocol-builder', accent: ET.accent },
                { label: 'The Atomizer', href: '/atomizer', accent: ET.accent },
                { label: 'Ignite Momentum', href: '/ignition', accent: '#f43f5e' },
              ].map(t => (
                <Link
                  key={t.label}
                  href={t.href}
                  className="text-xs flex items-center gap-2 group w-fit transition-all opacity-60 hover:opacity-100"
                  style={{ color: ET.mid }}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-all group-hover:scale-125" style={{ backgroundColor: t.accent }} />
                  {t.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t px-6" style={{ borderColor: ET.border }}>
          <div className="max-w-7xl mx-auto h-11 flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-25" style={{ color: ET.sub }}>
              Duck OS · Life Architecture for Neurodivergent Creators
            </p>
            <p className="font-mono text-[10px] opacity-30 shrink-0" style={{ color: ET.sub }}>
              © 2026 Adduckivity
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
