import Link from 'next/link'
import Image from 'next/image'
import { ET } from '@/lib/theme'

const phases = [
  {
    num: '01',
    name: 'The Spark',
    duration: '120s',
    color: '#f43f5e',
    colorBg: 'rgba(244,63,94,0.1)',
    colorBorder: 'rgba(244,63,94,0.25)',
    prompt: 'IGNITE YOUR NERVOUS SYSTEM MOVE NOW',
    description:
      'Physical activation breaks the freeze response. You will see a random movement command every 3 seconds — jumping jacks, high knees, burpees, lunges. Do them. Your nervous system needs the signal before your brain will cooperate.',
    actions: ['JUMPING JACKS', 'HIGH KNEES', 'DEEP SQUATS', 'BURPEES', 'LUNGES'],
    tip: 'Don\'t skip this. Even 30 seconds of movement changes your neurochemistry.',
  },
  {
    num: '02',
    name: 'The Target',
    duration: '180s',
    color: '#00E5FF',
    colorBg: 'rgba(0,229,255,0.1)',
    colorBorder: 'rgba(0,229,255,0.25)',
    prompt: 'ALIGN WITH YOUR PRIMARY GOALS',
    description:
      'Mental alignment phase. While the timer counts down, write your single most important task for the session. One sentence. Not a list — just the one thing that matters most right now.',
    actions: ['Write your primary task', 'Clear all other tabs', 'Put your phone face-down', 'Set your intention'],
    tip: 'Grab a notebook. Writing it by hand makes the commitment feel real.',
  },
  {
    num: '03',
    name: 'The Launch',
    duration: '300s',
    color: '#10b981',
    colorBg: 'rgba(16,185,129,0.1)',
    colorBorder: 'rgba(16,185,129,0.25)',
    prompt: 'PREPARE FOR DEEP WORK FOCUS',
    description:
      'The final stretch before flow. Your workspace should be ready, your task is clear. Use this time to open only the tools you need, close distractions, and let your brain begin the transition into deep work.',
    actions: ['Open only needed tools', 'Close social media', 'Start background music', 'Begin when timer ends'],
    tip: 'When the timer hits zero, start immediately — momentum is already built.',
  },
]

function PhaseOverlayMockup({ phase }: { phase: typeof phases[0] }) {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      {/* BG */}
      <rect width="480" height="300" fill="#000000" rx="12"/>
      <rect width="480" height="300" fill={phase.color} rx="12" opacity="0.05"/>
      {/* Pulse glow */}
      <ellipse cx="240" cy="140" rx="180" ry="120" fill={phase.color} opacity="0.06"/>
      {/* Large countdown number */}
      <text
        x="240" y="120"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="900"
        fontSize="96"
        fill={phase.color}
        letterSpacing="-4"
      >
        {phase.duration}
      </text>
      {/* Phase name tag */}
      <rect x="160" y="130" width="160" height="26" rx="4" fill={phase.color} opacity="0.15"/>
      <text x="240" y="148" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={phase.color} fontWeight="700" letterSpacing="4">
        {phase.name.toUpperCase()}
      </text>
      {/* Prompt text */}
      <text x="240" y="185" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={phase.color} fontWeight="700" letterSpacing="2" opacity="0.9">
        {phase.prompt.length > 38 ? phase.prompt.slice(0, 38) + '…' : phase.prompt}
      </text>
      {/* Action label (spark only) */}
      {phase.num === '01' && (
        <text x="240" y="214" textAnchor="middle" fontFamily="monospace" fontSize="14" fill={phase.color} fontWeight="700" letterSpacing="4">
          JUMPING JACKS
        </text>
      )}
      {/* Abort button mock */}
      <rect x="168" y="244" width="144" height="28" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <text x="240" y="262" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.4)" letterSpacing="3">ABORT MISSION</text>
      {/* Progress bar */}
      <rect x="0" y="290" width="480" height="4" fill="rgba(255,255,255,0.08)" rx="0"/>
      <rect x="0" y="290" width={phase.num === '01' ? 360 : phase.num === '02' ? 210 : 80} height="4" fill={phase.color} rx="0" opacity="0.8"/>
    </svg>
  )
}

function LandingCardMockup() {
  return (
    <svg viewBox="0 0 480 280" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      {/* Page bg */}
      <rect width="480" height="280" fill="#0A0F1E" rx="12"/>
      {/* Grid hint */}
      <line x1="0" y1="40" x2="480" y2="40" stroke="#1E3A5F" strokeWidth="0.5" opacity="0.5"/>
      {/* Nav bar */}
      <rect width="480" height="40" fill="#0F1829" rx="0"/>
      <circle cx="24" cy="20" r="10" fill="#1E3A5F"/>
      <rect x="42" y="14" width="60" height="12" rx="3" fill="#1E3A5F"/>
      <rect x="340" y="14" width="40" height="12" rx="3" fill="#1E3A5F"/>
      <rect x="390" y="14" width="40" height="12" rx="3" fill="rgba(0,229,255,0.2)" stroke="#00E5FF" strokeWidth="0.5"/>

      {/* Section label */}
      <text x="240" y="72" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8" letterSpacing="4">QUICK LAUNCH</text>

      {/* Card highlight */}
      <rect x="100" y="82" width="280" height="152" rx="12" fill="#0F1829" stroke="#f43f5e" strokeWidth="2" opacity="1"/>
      {/* Card inner glow */}
      <rect x="100" y="82" width="280" height="152" rx="12" fill="rgba(244,63,94,0.04)"/>

      {/* Card image area */}
      <rect x="112" y="94" width="256" height="80" rx="8" fill="#1A2840"/>
      <text x="240" y="124" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#f43f5e" fontWeight="700" letterSpacing="2">IGNITE</text>
      <text x="240" y="142" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#f43f5e" opacity="0.6" letterSpacing="1">MOMENTUM</text>

      {/* Card body */}
      <text x="130" y="196" fontFamily="monospace" fontSize="12" fill="#E8F4F8" fontWeight="700">Ignite Momentum</text>
      <rect x="130" y="204" width="180" height="7" rx="2" fill="#1E3A5F" opacity="0.8"/>
      <rect x="130" y="216" width="130" height="7" rx="2" fill="#1E3A5F" opacity="0.5"/>

      {/* Click indicator arrow */}
      <circle cx="356" cy="200" r="18" fill="rgba(244,63,94,0.2)" stroke="#f43f5e" strokeWidth="1.5"/>
      <text x="356" y="206" textAnchor="middle" fontSize="16" fill="#f43f5e">→</text>

      {/* Click label */}
      <text x="240" y="252" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#f43f5e" letterSpacing="2" opacity="0.7">CLICK TO LAUNCH</text>
    </svg>
  )
}

function IgnitionStartMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      <ellipse cx="240" cy="150" rx="180" ry="120" fill="rgba(244,63,94,0.08)"/>
      {/* Flame icon mockup */}
      <text x="240" y="90" textAnchor="middle" fontSize="48">🔥</text>
      {/* Title */}
      <text x="240" y="128" textAnchor="middle" fontFamily="monospace" fontSize="20" fill="#E8F4F8" fontWeight="900" letterSpacing="3">MOMENTUM IGNITION</text>
      <text x="240" y="150" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#6B9BB8" letterSpacing="1">600-second power-up sequence</text>
      {/* Phase dots */}
      <circle cx="172" cy="175" r="5" fill="#f43f5e"/>
      <text x="186" y="179" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.5)">120s Physical Activation</text>
      <circle cx="172" cy="194" r="5" fill="#00E5FF"/>
      <text x="186" y="198" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.5)">180s Mental Alignment</text>
      <circle cx="172" cy="213" r="5" fill="#10b981"/>
      <text x="186" y="217" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.5)">300s Deep Work Ignition</text>
      {/* Button */}
      <rect x="148" y="236" width="184" height="40" rx="10" fill="url(#btnGrad)"/>
      <defs>
        <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e"/>
          <stop offset="100%" stopColor="#f97316"/>
        </linearGradient>
      </defs>
      <text x="240" y="261" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="white" fontWeight="700" letterSpacing="3">⚡ IGNITE NOW</text>
    </svg>
  )
}

const steps = [
  {
    num: '01',
    title: 'Open the Landing Page',
    body: 'Go to the Adduckivity home page. In the tools section you will see the "Ignite Momentum" card with a rose-red accent. Click it to open the ignition page.',
    visual: <LandingCardMockup />,
  },
  {
    num: '02',
    title: 'Press "Ignite Now"',
    body: 'You will see a pre-launch screen with the 3 phases listed. Read them once so you know what is coming. Then click the "Ignite Now" button — the full-screen overlay launches immediately.',
    visual: <IgnitionStartMockup />,
  },
  {
    num: '03',
    title: 'Phase 1 · Spark (0–120s)',
    body: 'A random physical movement is shown every 3 seconds. Do each one. Move your body — this phase breaks the freeze response that keeps you stuck. The screen pulses red. Stay with it.',
    visual: <PhaseOverlayMockup phase={phases[0]} />,
  },
  {
    num: '04',
    title: 'Phase 2 · Target (120–300s)',
    body: 'The screen turns cyan. Write down your single most important task for this session. One thing only. This phase locks in your intention before the work begins.',
    visual: <PhaseOverlayMockup phase={phases[1]} />,
  },
  {
    num: '05',
    title: 'Phase 3 · Launch (300–600s)',
    body: 'The screen turns green. Set up your workspace — open only what you need, close distractions, start ambient music if that helps. When the timer hits zero, you start working. No delay.',
    visual: <PhaseOverlayMockup phase={phases[2]} />,
  },
]

const tips = [
  {
    title: 'Use it on your worst days',
    body: 'Ignition is not for when you are already motivated. It is for when you are stuck, scattered, or frozen. The worse you feel, the more it works.',
    icon: '🧊',
  },
  {
    title: 'Audio is optional but powerful',
    body: 'The audio cues reinforce phase transitions. Toggle audio with the button in the top-right corner of the overlay. Try it both ways.',
    icon: '🔊',
  },
  {
    title: 'Do not skip the movements',
    body: 'The Spark phase works because physical movement changes neurochemistry. Thinking about doing jumping jacks does nothing. Doing them does everything.',
    icon: '⚡',
  },
  {
    title: 'One task, not a list',
    body: 'During the Target phase, write one sentence. Not a bullet list — one sentence. "I am going to finish the API route for authentication." That is your anchor.',
    icon: '🎯',
  },
]

export default function IgnitionGuidePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: ET.bg, color: ET.ink }}>

      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: 'rgba(10,15,30,0.92)', borderColor: ET.border, backdropFilter: 'blur(12px)' }}
      >
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Adduckivity" width={36} height={36} className="rounded-lg" />
          <span className="font-semibold text-lg" style={{ color: ET.ink }}>Adduckivity</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/ignition" className="text-sm font-medium px-4 py-2 rounded-full transition-all hover:opacity-80"
            style={{ backgroundColor: 'rgba(244,63,94,0.12)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
            Launch Ignition →
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6">

        {/* ── Hero ── */}
        <div className="py-16 md:py-20 border-b" style={{ borderColor: ET.border }}>
          <Link href="/ignition" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 hover:opacity-70 transition-opacity"
            style={{ color: '#f43f5e' }}>
            ← Back to Ignition
          </Link>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ET.sub }}>
                Duck OS · Quick Launch · Guide
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: ET.ink }}>
                How to Use<br /><span style={{ color: '#f43f5e' }}>Ignition Momentum</span>
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: ET.mid }}>
                A 600-second protocol that converts a frozen, scattered mind into a focused one. Three phases — physical, mental, environmental — each designed to lower the activation energy required to start deep work.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '600 seconds', sub: 'total protocol' },
                  { label: '3 phases', sub: 'spark · target · launch' },
                  { label: 'no willpower', sub: 'system does the work' },
                ].map(b => (
                  <div key={b.label} className="px-4 py-2.5 rounded-xl border text-center"
                    style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
                    <div className="text-sm font-bold" style={{ color: '#f43f5e' }}>{b.label}</div>
                    <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: ET.sub }}>{b.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-72 shrink-0">
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: ET.border }}>
                <Image
                  src="/uploads/ignition-cover.svg"
                  alt="Ignition Momentum"
                  width={800}
                  height={450}
                  className="w-full"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Why It Works ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>The Science</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>Why this works for ADHD brains</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'Physical movement first',
                body: 'Movement raises dopamine and norepinephrine — the exact neurotransmitters ADHD brains are short on. The Spark phase uses your body to prime your brain.',
                color: '#f43f5e',
              },
              {
                title: 'One clear target',
                body: 'Decision fatigue and task uncertainty are major ADHD blockers. Writing one concrete task during Target eliminates the "where do I even start" paralysis.',
                color: '#00E5FF',
              },
              {
                title: 'Environment before willpower',
                body: 'The Launch phase sets up your workspace. Removing friction from the environment means you never have to rely on willpower to get started.',
                color: '#10b981',
              },
            ].map(c => (
              <div key={c.title} className="rounded-xl border p-5" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                <div className="w-2 h-6 rounded-full mb-4" style={{ backgroundColor: c.color }} />
                <h3 className="font-semibold text-sm mb-2" style={{ color: ET.ink }}>{c.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The 3 Phases ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Protocol Breakdown</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>The 3 phases</h2>
          <div className="flex flex-col gap-6">
            {phases.map(phase => (
              <div key={phase.num} className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: ET.surface, borderColor: phase.colorBorder }}>
                <div className="flex flex-col md:flex-row">
                  {/* Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono" style={{ color: ET.sub }}>{phase.num}</span>
                      <span className="text-xl font-bold" style={{ color: phase.color }}>{phase.name}</span>
                      <span className="ml-auto text-sm font-mono px-3 py-1 rounded-full border"
                        style={{ borderColor: phase.colorBorder, color: phase.color, backgroundColor: phase.colorBg }}>
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: ET.mid }}>{phase.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {phase.actions.map(a => (
                        <span key={a} className="text-[10px] px-2.5 py-1 rounded-full font-mono uppercase tracking-wide border"
                          style={{ borderColor: phase.colorBorder, color: phase.color, backgroundColor: phase.colorBg }}>
                          {a}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-start gap-2 text-xs rounded-lg p-3"
                      style={{ backgroundColor: phase.colorBg, color: phase.color }}>
                      <span className="shrink-0">💡</span>
                      <span>{phase.tip}</span>
                    </div>
                  </div>
                  {/* Mockup */}
                  <div className="md:w-72 shrink-0 p-4 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <div className="w-full">
                      <PhaseOverlayMockup phase={phase} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Step by Step ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>How to Use</p>
          <h2 className="text-2xl font-bold mb-10" style={{ color: ET.ink }}>Step-by-step walkthrough</h2>
          <div className="flex flex-col gap-16">
            {steps.map((step, i) => (
              <div key={step.num}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0"
                      style={{ backgroundColor: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
                      {step.num}
                    </span>
                    <h3 className="font-bold text-lg" style={{ color: ET.ink }}>{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed pl-11" style={{ color: ET.mid }}>{step.body}</p>
                </div>
                {/* Visual */}
                <div className="w-full md:w-80 shrink-0">
                  <div className="rounded-2xl border overflow-hidden" style={{ borderColor: ET.border }}>
                    {step.visual}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tips ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Best Practices</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>Tips for getting the most out of it</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tips.map(tip => (
              <div key={tip.title} className="rounded-xl border p-5 flex gap-4"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                <span className="text-2xl shrink-0 mt-0.5">{tip.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm mb-1.5" style={{ color: ET.ink }}>{tip.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ET.sub }}>Ready?</p>
          <h2 className="text-3xl font-bold mb-4" style={{ color: ET.ink }}>
            Stop reading.<br />
            <span style={{ color: '#f43f5e' }}>Start the sequence.</span>
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: ET.sub }}>
            The protocol works while you are doing it, not while you are thinking about doing it.
          </p>
          <Link
            href="/ignition"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #f43f5e, #f97316)',
              color: 'white',
              boxShadow: '0 0 40px rgba(244,63,94,0.35)',
            }}
          >
            <span>🔥</span>
            Ignite Now — 600s
          </Link>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t py-10 px-6" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Adduckivity" width={28} height={28} className="rounded-md" />
            <span className="font-semibold text-sm" style={{ color: ET.ink }}>Adduckivity</span>
          </div>
          <div className="flex items-center gap-7 text-xs" style={{ color: ET.sub }}>
            <Link href="/" className="hover:opacity-70 transition-opacity">Home</Link>
            <Link href="/blog" className="hover:opacity-70 transition-opacity">Blog</Link>
            <Link href="/ignition" className="hover:opacity-70 transition-opacity">Launch Ignition</Link>
            <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Tools</a>
          </div>
          <p className="text-xs" style={{ color: ET.sub }}>Powered by Duck OS Systems</p>
        </div>
      </footer>

    </div>
  )
}
