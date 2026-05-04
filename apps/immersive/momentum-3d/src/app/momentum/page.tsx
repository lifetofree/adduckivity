'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FlywheelScene from '@/components/FlywheelScene'
import EmergencyProtocol from '@/components/EmergencyProtocol'
import EmailCTA from '@/components/EmailCTA'
import { ET } from '@/lib/theme'

const phases = [
  { num: '01', name: 'Activation', desc: 'Smallest possible action. 2-minute commitment. No willpower required.', time: '2 min' },
  { num: '02', name: 'Build Phase', desc: 'Resistance drops. Dopamine kicks in. Keep going.', time: '10 min' },
  { num: '03', name: 'Momentum State', desc: 'Flow takes over. The system carries you now.', time: '20+ min' },
  { num: '04', name: 'Asset Capture', desc: 'Document the output. Compound the library over time.', time: 'ongoing' },
]

const implementationSteps = [
  ['2-Minute Activation', 'Commit to exactly 2 minutes. Anyone can do 2 minutes. If you want to stop after, you can. (You almost never will.)'],
  ['Remove All Friction', 'Phone in another room. Tabs closed. Tools ready. Make the path of least resistance working.'],
  ['Ride the Flywheel', "Once you hit 10 minutes, don't analyze it. Just ride it. Let the system carry you."],
  ['Capture the Asset', "When done, document what you made. You're not just working — you're building an empire."],
]

const tools = [
  {
    title: 'The Atomizer',
    description: 'Break any scary task into 2-minute atomic steps with AI assistance.',
    href: '/atomizer',
    badge: 'Executive Tool',
    accent: ET.accent,
  },
  {
    title: 'Protocol Builder',
    description: 'Architect your momentum constellation. Map tasks in 3D space.',
    href: '/protocol-builder',
    badge: 'System Architect',
    accent: '#a78bfa',
  },
  {
    title: 'Browse Protocols',
    description: 'Evidence-based systems and field notes from the Duck OS.',
    href: '/blog',
    badge: 'Knowledge Base',
    accent: ET.accent,
  },
]

export default function MomentumPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(Math.min(Math.max(window.scrollY / totalHeight, 0), 1))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ backgroundColor: ET.bg }}>
      {/* 3D background — visible only through the transparent hero */}
      <FlywheelScene scrollProgress={scrollProgress} />

      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: 'rgba(10,15,30,0.92)', borderColor: ET.border, backdropFilter: 'blur(12px)' }}
      >
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Adduckivity" width={36} height={36} className="rounded-lg" />
          <span className="font-semibold text-lg" style={{ color: ET.ink }}>Adduckivity</span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          <Link href="/blog" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>Blog</Link>
          <Link href="/momentum" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>3D Experience</Link>
          <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: ET.mid }}>Tools</a>
        </div>
      </nav>

      {/* ── Hero — split layout ── */}
      <section
        className="relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
        style={{ minHeight: 'calc(100vh - 65px)' }}
      >
        {/* Left gradient overlay — text readability against 3D bg */}
        <div
          className="absolute inset-0 lg:w-3/5 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.45) 100%)' }}
          aria-hidden
        />

        {/* Left: protocol identity */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-14 py-20 lg:py-0">
          {/* Status badge */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#ff4444', boxShadow: '0 0 8px #ff4444' }}
            />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.2em] px-3 py-1 rounded border"
              style={{ color: '#ff6666', borderColor: 'rgba(255,68,68,0.3)', backgroundColor: 'rgba(255,68,68,0.08)' }}
            >
              ACT-04 // Emergency Recovery
            </span>
          </div>

          <h1
            className="font-bold leading-[0.88] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: ET.ink }}
          >
            Stop the<br />
            <span style={{ color: '#ff4444' }}>Spiral.</span>
          </h1>

          <p className="text-base md:text-lg leading-relaxed mb-10 max-w-sm" style={{ color: ET.mid }}>
            When burnout hits, don&apos;t think — run the protocol.
            A 5-step fail-safe that restores momentum in under 10 minutes.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { label: '5 steps', color: '#ff4444' },
              { label: '< 10 min', color: ET.accent },
              { label: 'zero willpower', color: '#a78bfa' },
            ].map(s => (
              <span
                key={s.label}
                className="font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-lg border"
                style={{ color: s.color, borderColor: `${s.color}40`, backgroundColor: `${s.color}10` }}
              >
                {s.label}
              </span>
            ))}
          </div>

          <p className="text-xs" style={{ color: ET.sub }}>
            Initialize the protocol on the right. Or scroll to learn the system.
          </p>
        </div>

        {/* Right: EmergencyProtocol wizard — visible on load */}
        <div className="relative z-10 flex items-center justify-center px-6 py-14 lg:py-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.6) 0%, rgba(10,15,30,0.85) 100%)' }}
        >
          <div className="w-full max-w-md">
            <EmergencyProtocol />
          </div>
        </div>
      </section>

      {/* ── Below fold: solid bg covers 3D ── */}
      <div className="relative z-10" style={{ backgroundColor: ET.bg }}>

        {/* ── Phases strip ── */}
        <section className="border-t py-16" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
          <div className="max-w-6xl mx-auto px-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] mb-12 text-center" style={{ color: ET.sub }}>
              The Momentum Protocol · 4 Phases
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {phases.map((p, i) => (
                <div key={i} className="relative">
                  {/* Connector line between items */}
                  {i < phases.length - 1 && (
                    <div
                      className="hidden lg:block absolute top-4 left-[calc(100%+1rem)] right-0 h-px"
                      style={{ backgroundColor: ET.border, width: 'calc(100% - 2rem)' }}
                    />
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: ET.accent, color: ET.bg }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded"
                      style={{ color: ET.sub, backgroundColor: ET.muted }}
                    >
                      {p.time}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: ET.ink }}>{p.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Method — 2 col ── */}
        <section className="border-t py-20" style={{ borderColor: ET.border }}>
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: The Problem */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-6" style={{ color: '#ff4444' }}>
                The Problem
              </p>
              <h2 className="text-2xl font-bold mb-6" style={{ color: ET.ink }}>The Motivation Trap</h2>
              <div className="space-y-4 text-sm leading-relaxed mb-8" style={{ color: ET.mid }}>
                <p>You&apos;ve experienced this cycle: You feel inspired → You take action → The feeling fades → You stop → You wait for inspiration again.</p>
                <p><strong style={{ color: '#ff4444' }}>This is a broken feedback loop.</strong> You&apos;re outsourcing your agency to your emotional state.</p>
                <p>The Duck OS philosophy: <em>&quot;Systems over willpower.&quot;</em> Motivation builds on quicksand. Systems build on bedrock.</p>
              </div>
              <blockquote
                className="p-5 rounded-xl"
                style={{ backgroundColor: ET.surface, borderLeft: `2px solid ${ET.accent}`, paddingLeft: '1.25rem' }}
              >
                <p className="text-sm italic leading-relaxed" style={{ color: ET.mid }}>
                  &quot;The system is the bridge between intention and action.&quot;
                </p>
                <footer className="mt-3 text-xs font-semibold" style={{ color: ET.sub }}>— UDO</footer>
              </blockquote>
            </div>

            {/* Right: Implementation */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-6" style={{ color: ET.accent }}>
                How to Run ACT-04
              </p>
              <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>The Implementation</h2>
              <div className="space-y-0">
                {implementationSteps.map(([title, body], i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                        style={{ backgroundColor: ET.accent, color: ET.bg }}
                      >
                        {i + 1}
                      </span>
                      {i < implementationSteps.length - 1 && (
                        <div className="w-px flex-1 my-1" style={{ backgroundColor: ET.border, minHeight: 28 }} />
                      )}
                    </div>
                    <div className="pb-7">
                      <p className="font-semibold text-sm mb-1.5" style={{ color: ET.ink }}>{title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── OS Tools ── */}
        <section className="border-t py-20" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: ET.sub }}>Duck OS</p>
              <h2 className="text-2xl font-bold" style={{ color: ET.ink }}>More Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {tools.map((t, i) => (
                <Link key={i} href={t.href} className="group block">
                  <div
                    className="p-6 rounded-2xl border transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col"
                    style={{ backgroundColor: ET.bg, borderColor: ET.border }}
                  >
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg border mb-4 inline-block w-fit"
                      style={{ color: t.accent, borderColor: `${t.accent}40`, backgroundColor: `${t.accent}10` }}
                    >
                      {t.badge}
                    </span>
                    <h3 className="font-bold text-base mb-2" style={{ color: ET.ink }}>{t.title}</h3>
                    <p className="text-xs leading-relaxed flex-1" style={{ color: ET.sub }}>{t.description}</p>
                    <div className="mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                      <span className="text-xs font-semibold" style={{ color: t.accent }}>Open</span>
                      <span className="text-xs" style={{ color: t.accent }} aria-hidden>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Email CTA ── */}
        <section
          className="py-24 px-6 text-center relative overflow-hidden border-t"
          style={{ backgroundColor: ET.bg, borderColor: ET.border }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,229,255,0.07) 0%, transparent 70%)' }}
            aria-hidden
          />
          <div className="relative max-w-xl mx-auto">
            <div className="w-12 h-0.5 mx-auto mb-8 rounded-full" style={{ backgroundColor: ET.accent }} />
            <h2 className="text-3xl font-bold mb-4" style={{ color: ET.ink }}>Start Your Flywheel</h2>
            <p className="text-sm mb-10 leading-relaxed" style={{ color: ET.sub }}>
              Pick one protocol. Run it for 7 days. Build from there.
            </p>
            <EmailCTA />
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ backgroundColor: ET.surface }}>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.35) 50%, transparent 100%)' }} />
          <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">

            <div className="md:col-span-5 flex flex-col gap-5">
              <Link href="/" className="flex items-center gap-3 group w-fit">
                <Image src="/logo.png" alt="Adduckivity" width={36} height={36} className="rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="font-bold text-base" style={{ color: ET.ink }}>Adduckivity</span>
              </Link>
              <p className="text-xs leading-relaxed max-w-xs" style={{ color: ET.sub }}>
                Life architecture for neurodivergent creators.
                Evidence-based OS tools built for ADHD and MDD brains.
              </p>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-lg border w-fit"
                style={{ color: ET.sub, borderColor: ET.border, backgroundColor: ET.bg }}
              >
                Duck OS · v1.0 · STABLE
              </span>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: ET.sub }}>Navigate</p>
              <nav className="flex flex-col gap-3">
                {[
                  { label: 'Home', href: '/', internal: true },
                  { label: 'Blog', href: '/blog', internal: true },
                ].map(l => l.internal
                  ? <Link key={l.label} href={l.href} className="text-xs transition-all hover:translate-x-0.5 hover:opacity-100 opacity-60 w-fit" style={{ color: ET.mid }}>{l.label}</Link>
                  : <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-xs transition-all hover:translate-x-0.5 hover:opacity-100 opacity-60 w-fit" style={{ color: ET.mid }}>{l.label}</a>
                )}
              </nav>
            </div>

            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: ET.sub }}>OS Tools</p>
              <nav className="flex flex-col gap-3">
                {[
                  { label: 'Emergency Recovery', href: '/momentum', accent: '#ff4444' },
                  { label: 'Protocol Builder', href: '/protocol-builder', accent: ET.accent },
                  { label: 'The Atomizer', href: '/atomizer', accent: ET.accent },
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

          <div className="border-t px-6" style={{ borderColor: ET.border }}>
            <div className="max-w-6xl mx-auto h-11 flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-25" style={{ color: ET.sub }}>
                Duck OS · Life Architecture for Neurodivergent Creators
              </p>
              <p className="font-mono text-[10px] opacity-30 shrink-0" style={{ color: ET.sub }}>© 2026 Adduckivity</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
