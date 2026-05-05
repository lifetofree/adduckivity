import Link from 'next/link'
import Image from 'next/image'
import { ET } from '@/lib/theme'

const CYAN = '#00E5FF'
const CYAN_BG = 'rgba(0,229,255,0.1)'
const CYAN_BORDER = 'rgba(0,229,255,0.25)'

const steps = [
  {
    num: '01',
    name: 'Enter the Scary Task',
    time: '~30 sec',
    icon: '🎯',
    description:
      'Type the task you have been avoiding — the project, email, form, or thing your brain refuses to start. Be specific. Instead of "work on project," write "write the intro paragraph for the client proposal."',
    why: 'Vague tasks never get done because your brain cannot compute the first physical action. Specificity collapses the ambiguity that causes avoidance. The more concrete, the faster the atomization.',
    ui: 'A single text input appears on a dark background: "What\'s the scary task?" Type it in, press Enter or click "Atomize." That is the entire input phase.',
  },
  {
    num: '02',
    name: 'AI Atomizes It',
    time: '~5 sec',
    icon: '⚡',
    description:
      'The AI breaks your task into 2-minute atomic steps — small enough that your brain cannot find a reason to resist starting. Each step is a physical action, not a vague objective.',
    why: 'ADHD brains resist tasks that feel large. A task that takes 2 minutes has near-zero activation energy. The system converts "write the proposal" into "open a new document and type one sentence about the client."',
    ui: 'A brief "Atomizing..." loading state plays with a particle animation, then the step list appears instantly.',
  },
  {
    num: '03',
    name: 'Execute the Active Step',
    time: '~2 min each',
    icon: '🔵',
    description:
      'Only one step is fully visible and actionable at a time — the current active step shown in cyan. The next two are faded. Everything else is blurred. Click the active step to mark it complete.',
    why: 'Showing all steps at once triggers overwhelm. The blurred design removes choice anxiety and forces single-task focus. You only have to answer one question: can I do this one thing right now?',
    ui: 'Active step: full opacity, cyan border, "Active Action" label, clickable. Next 2: 60% opacity, not clickable. Remaining: blurred and hidden. After clicking, the next step unlocks.',
  },
  {
    num: '04',
    name: 'Energy Check (every 6 steps)',
    time: '~1 min',
    icon: '🔋',
    description:
      'After every 6 completed steps (or 3 in Protected Mode), an energy check popup appears. You choose to continue or rest. If you rest, a meditation is opened — no shame, just a maintenance window.',
    why: 'ADHD burnout often comes from ignoring depletion signals until it is too late. Forced check-ins interrupt hyperfocus at safe intervals, preventing the crash that wipes out a full day of work.',
    ui: 'A full-screen overlay shows your completed step count. Two options: "Continue Momentum" (proceed) or "Rest Protocol" (opens a 5-minute meditation). Tap either to continue.',
  },
  {
    num: '05',
    name: 'Task Eradicated',
    time: 'done',
    icon: '✓',
    description:
      'When all steps are marked complete, the "Task Eradicated" screen appears. If you launched from a Protocol Builder node, you return to the protocol automatically. Otherwise, start a new atomization.',
    why: 'Completion is a neurological event — your brain releases dopamine on task closure. The explicit "Task Eradicated" screen amplifies this signal, reinforcing the behavior loop for next time.',
    ui: 'Green checkmark, "Task Eradicated" title, and either a "Return to Protocol Now →" button (if launched from Protocol Builder) or a "New Atomization" button.',
  },
]

// ── SVG Mockups ────────────────────────────────────────────────────────────

function LandingMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0A0F1E" rx="12"/>
      {/* Nav bar */}
      <rect width="480" height="44" fill="#0F1829"/>
      <circle cx="26" cy="22" r="12" fill="#1E3A5F"/>
      <rect x="46" y="16" width="70" height="12" rx="3" fill="#1E3A5F"/>
      {/* Hero */}
      <text x="240" y="80" textAnchor="middle" fontFamily="monospace" fontSize="22" fill="#E8F4F8" fontWeight="900">Stop Fighting</text>
      <text x="240" y="106" textAnchor="middle" fontFamily="monospace" fontSize="22" fill="#E8F4F8" fontWeight="900">Your <tspan fill="#00E5FF">Brain.</tspan></text>
      <text x="240" y="128" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8">Evidence-based OS tools for ADHD creators</text>
      {/* The Atomizer card */}
      <rect x="80" y="148" width="320" height="110" rx="12" fill="#0F1829" stroke="#00E5FF" strokeWidth="1.5"/>
      <rect x="92" y="158" width="296" height="58" rx="8" fill="#1A2840"/>
      {/* Atom icon in card image */}
      <circle cx="240" cy="187" r="18" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.5"/>
      <circle cx="240" cy="187" r="6" fill="#00E5FF" opacity="0.8"/>
      <ellipse cx="240" cy="187" rx="22" ry="9" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.4"/>
      {/* Badge */}
      <rect x="96" y="162" width="72" height="16" rx="6" fill="rgba(0,229,255,0.15)"/>
      <text x="132" y="174" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#00E5FF" fontWeight="700">Executive Tool</text>
      {/* Card text */}
      <text x="96" y="232" fontFamily="monospace" fontSize="11" fill="#E8F4F8" fontWeight="700">The Atomizer</text>
      <rect x="96" y="240" width="180" height="6" rx="2" fill="#1E3A5F" opacity="0.6"/>
      <circle cx="368" cy="233" r="14" fill={CYAN_BG} stroke="#00E5FF" strokeWidth="1.5"/>
      <text x="368" y="238" textAnchor="middle" fontSize="12" fill="#00E5FF">→</text>
    </svg>
  )
}

function InputMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Particle bg hints */}
      <circle cx="80" cy="60" r="2" fill="#00E5FF" opacity="0.15"/>
      <circle cx="400" cy="80" r="1.5" fill="#00E5FF" opacity="0.1"/>
      <circle cx="60" cy="220" r="2.5" fill="#00E5FF" opacity="0.08"/>
      <circle cx="420" cy="240" r="2" fill="#00E5FF" opacity="0.12"/>
      {/* Nav bar */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8" letterSpacing="3">ATOMIZER</text>
      {/* Hero headline */}
      <text x="240" y="96" textAnchor="middle" fontFamily="monospace" fontSize="20" fill="#E8F4F8" fontWeight="900">What&apos;s the</text>
      <text x="240" y="120" textAnchor="middle" fontFamily="monospace" fontSize="20" fill="#00E5FF" fontWeight="900">scary task?</text>
      <text x="240" y="142" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#6B9BB8">We&apos;ll atomize it into 2-minute steps.</text>
      {/* Input field */}
      <line x1="40" y1="196" x2="360" y2="196" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
      <text x="40" y="183" fontFamily="monospace" fontSize="11" fill="#E8F4F8">Write the client proposal intro...</text>
      <rect x="362" y="168" width="78" height="34" rx="8" fill="rgba(0,229,255,0.12)" stroke="rgba(0,229,255,0.2)" strokeWidth="1"/>
      <text x="401" y="189" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#00E5FF" fontWeight="700">Atomize</text>
      {/* Sub-caption */}
      <text x="240" y="228" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#2A4A6A">Law 1: System &gt; Emotion</text>
    </svg>
  )
}

function AtomizingMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Particle burst */}
      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * 2 * Math.PI
        const r = 80 + (i % 3) * 24
        const x = 240 + r * Math.cos(angle)
        const y = 150 + r * Math.sin(angle)
        return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#00E5FF" opacity={0.1 + (i % 4) * 0.06}/>
      })}
      {/* Center atom */}
      <circle cx="240" cy="150" r="36" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1" opacity="0.6"/>
      <circle cx="240" cy="150" r="18" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="1.5" opacity="0.8"/>
      <circle cx="240" cy="150" r="6" fill="#00E5FF" opacity="0.9"/>
      {/* Orbital rings */}
      <ellipse cx="240" cy="150" rx="48" ry="18" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.3"/>
      <ellipse cx="240" cy="150" rx="48" ry="18" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.2" transform="rotate(60 240 150)"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8" letterSpacing="3">ATOMIZER</text>
      {/* Loading text */}
      <text x="240" y="224" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#00E5FF" fontWeight="700">Atomizing...</text>
      <text x="240" y="244" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#2A4A6A">Splitting into 2-minute steps</text>
    </svg>
  )
}

function StepListMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8" letterSpacing="3">ATOMIZER</text>
      {/* Header */}
      <text x="240" y="62" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#00E5FF" fontWeight="700" letterSpacing="3">PROJECT ATOMIZED</text>
      <text x="240" y="80" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#E8F4F8" fontWeight="900">WRITE CLIENT PROPOSAL</text>
      {/* Active step — full opacity, cyan border */}
      <rect x="32" y="94" width="416" height="52" rx="10" fill="rgba(0,229,255,0.06)" stroke="#00E5FF" strokeWidth="1.5"/>
      <text x="48" y="112" fontFamily="monospace" fontSize="7" fill="#00E5FF" fontWeight="700" letterSpacing="2">ACTIVE ACTION</text>
      <text x="48" y="130" fontFamily="monospace" fontSize="10" fill="#E8F4F8">Open a new document and type one sentence</text>
      <text x="428" y="123" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#00E5FF">→</text>
      {/* Step 2 — faded */}
      <rect x="32" y="154" width="416" height="40" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      <text x="48" y="178" fontFamily="monospace" fontSize="10" fill="#E8F4F8" opacity="0.45">Write the problem statement in one line</text>
      {/* Step 3 — faded */}
      <rect x="32" y="200" width="416" height="40" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      <text x="48" y="224" fontFamily="monospace" fontSize="10" fill="#E8F4F8" opacity="0.35">List 3 key points to address</text>
      {/* Blurred steps hint */}
      <rect x="32" y="246" width="416" height="28" rx="8" fill="rgba(255,255,255,0.01)"/>
      <rect x="48" y="253" width="200" height="8" rx="3" fill="rgba(255,255,255,0.06)"/>
      <rect x="48" y="265" width="140" height="4" rx="2" fill="rgba(255,255,255,0.04)"/>
    </svg>
  )
}

function EnergyCheckMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Blurred background hint */}
      <rect width="480" height="300" fill="rgba(0,0,0,0.6)"/>
      {/* Overlay card */}
      <rect x="60" y="40" width="360" height="220" rx="16" fill="#0F1829" stroke={CYAN_BORDER} strokeWidth="1.5"/>
      {/* Battery icon */}
      <rect x="210" y="60" width="60" height="30" rx="4" fill="none" stroke="#00E5FF" strokeWidth="2" opacity="0.7"/>
      <rect x="270" y="69" width="6" height="12" rx="2" fill="#00E5FF" opacity="0.5"/>
      <rect x="214" y="64" width="40" height="22" rx="2" fill="#00E5FF" opacity="0.3"/>
      {/* Text */}
      <text x="240" y="116" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#6B9BB8" fontWeight="700" letterSpacing="3">ENERGY CHECK</text>
      <text x="240" y="140" textAnchor="middle" fontFamily="monospace" fontSize="15" fill="#E8F4F8" fontWeight="900">6 Steps Complete</text>
      <text x="240" y="162" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#6B9BB8">How is your system running?</text>
      {/* Buttons */}
      <rect x="76" y="182" width="164" height="40" rx="10" fill="#00E5FF"/>
      <text x="158" y="207" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#0A0F1E" fontWeight="700">Continue Momentum</text>
      <rect x="248" y="182" width="156" height="40" rx="10" fill="transparent" stroke={CYAN_BORDER} strokeWidth="1"/>
      <text x="326" y="207" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8">Rest Protocol</text>
    </svg>
  )
}

function SuccessMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Green glow */}
      <ellipse cx="240" cy="140" rx="160" ry="120" fill="rgba(34,197,94,0.06)"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8" letterSpacing="3">ATOMIZER</text>
      {/* Check circle */}
      <circle cx="240" cy="116" r="30" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2"/>
      <text x="240" y="125" textAnchor="middle" fontFamily="monospace" fontSize="24" fill="#22c55e" fontWeight="900">✓</text>
      {/* Title */}
      <text x="240" y="166" textAnchor="middle" fontFamily="monospace" fontSize="18" fill="#E8F4F8" fontWeight="900">Task Eradicated</text>
      <text x="240" y="186" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#6B9BB8" letterSpacing="3">MOMENTUM SUSTAINED</text>
      {/* Button */}
      <rect x="120" y="206" width="240" height="42" rx="10" fill="white"/>
      <text x="240" y="232" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#0A0F1E" fontWeight="700">New Atomization</text>
      {/* Sparkles */}
      <circle cx="100" cy="120" r="3" fill="#22c55e" opacity="0.4"/>
      <circle cx="380" cy="100" r="2" fill="#22c55e" opacity="0.3"/>
      <circle cx="370" cy="180" r="3" fill="#22c55e" opacity="0.25"/>
      <circle cx="110" cy="190" r="2" fill="#22c55e" opacity="0.35"/>
    </svg>
  )
}

const walkthroughSteps = [
  {
    num: '01',
    title: 'Open The Atomizer from the landing page',
    body: 'From the home page, find The Atomizer card in the OS Tools section. Click it to go to /atomizer. You can also reach it directly via the navigation or from a Protocol Builder node that links out to it.',
    visual: <LandingMockup />,
  },
  {
    num: '02',
    title: 'Type the task you have been avoiding',
    body: 'A single text field appears: "What\'s the scary task?" Be specific. Write the actual thing — the client email, the first page, the form — not the project it belongs to. Then press Enter or click Atomize.',
    visual: <InputMockup />,
  },
  {
    num: '03',
    title: 'Wait 5 seconds while AI atomizes it',
    body: 'A brief particle animation plays. The AI sends your task to the backend, which returns 6-10 two-minute physical steps. The whole process takes about 5 seconds. Nothing to do here.',
    visual: <AtomizingMockup />,
  },
  {
    num: '04',
    title: 'Complete the active step — one at a time',
    body: 'Only the top step is fully visible and clickable (cyan border). Do that one thing — it should take 2 minutes or less. When done, click it to complete it. The next step unlocks. Repeat.',
    visual: <StepListMockup />,
  },
  {
    num: '05',
    title: 'Check in at the energy checkpoint',
    body: 'After every 6 steps, an Energy Check popup appears. If you feel good, tap "Continue Momentum." If depleted, tap "Rest Protocol" and take 5 minutes. This is mandatory — not optional.',
    visual: <EnergyCheckMockup />,
  },
  {
    num: '06',
    title: 'Reach Task Eradicated',
    body: 'When every step is marked complete, the "Task Eradicated" screen appears. Tap "New Atomization" to start again, or if you came from the Protocol Builder, tap "Return to Protocol Now →" to go back.',
    visual: <SuccessMockup />,
  },
]

const tips = [
  {
    icon: '🎯',
    title: 'Be specific when you input the task',
    body: 'The output quality depends on the input. "Work on project" returns generic steps. "Write the executive summary for the Q2 report" returns steps you can actually execute in 2 minutes. Specificity is the protocol.',
  },
  {
    icon: '🔵',
    title: 'Only do the active step — nothing else',
    body: 'The blurred steps are hidden for a reason. Reading ahead triggers overwhelm and task-switching anxiety. Trust the system to surface the next step at the right time. Your job is just the blue one.',
  },
  {
    icon: '⏱️',
    title: 'If a step takes more than 5 minutes, restart',
    body: 'The atomization occasionally generates steps that are too large. If you are stuck on one step for over 5 minutes, click "Abandon System & Restart," enter the same task with more detail, and re-atomize.',
  },
  {
    icon: '🔋',
    title: 'Honor the energy check — do not skip rest',
    body: 'The rest option opens a 5-minute meditation. Taking it does not mean you are weak — it means you are operating the system correctly. Six steps in a row is real work. Maintenance windows prevent crashes.',
  },
  {
    icon: '🔁',
    title: 'Use it for the same task every day',
    body: 'Long projects can be atomized multiple times. Start with "Write chapter 3 introduction today" on Monday, "Edit chapter 3 for flow" on Tuesday. Each session is a new atomization, not a continuation.',
  },
  {
    icon: '🚀',
    title: 'Combine with Ignition for high-resistance tasks',
    body: 'If you genuinely cannot start, run the 600-second Ignition sequence first to break inertia. Then open The Atomizer while still in flow state. The combination eliminates the two main startup barriers.',
  },
]

export default function AtomizerGuidePage() {
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
          <Link
            href="/atomizer"
            className="text-sm font-medium px-4 py-2 rounded-full transition-all hover:opacity-80"
            style={{ backgroundColor: CYAN_BG, color: CYAN, border: `1px solid ${CYAN_BORDER}` }}
          >
            ⚡ Launch Atomizer →
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6">

        {/* ── Hero ── */}
        <div className="py-16 md:py-20 border-b" style={{ borderColor: ET.border }}>
          <Link
            href="/atomizer"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 hover:opacity-70 transition-opacity"
            style={{ color: CYAN }}
          >
            ← Back to The Atomizer
          </Link>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ET.sub }}>
                Duck OS · Executive Tool · Guide
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: ET.ink }}>
                How to Use<br />
                <span style={{ color: CYAN }}>The Atomizer</span>
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: ET.mid }}>
                The Atomizer turns any task you are avoiding into a sequence of 2-minute physical actions. No willpower required. No planning anxiety. Just the next small thing to do.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '5 steps', sub: 'input → execute' },
                  { label: '~15 min', sub: 'first session' },
                  { label: 'AI-powered', sub: 'task breakdown' },
                ].map(b => (
                  <div key={b.label} className="px-4 py-2.5 rounded-xl border text-center"
                    style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
                    <div className="text-sm font-bold" style={{ color: CYAN }}>{b.label}</div>
                    <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: ET.sub }}>{b.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-72 shrink-0">
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: ET.border }}>
                <Image
                  src="/uploads/atomizer-cover.svg"
                  alt="The Atomizer"
                  width={800}
                  height={450}
                  className="w-full"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── When to Use It ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>When to Use This</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>What The Atomizer solves</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { signal: 'Task avoidance loop', desc: 'You have been staring at or thinking about the same task for 30+ minutes but cannot start it. The task keeps returning to your head but never gets done.', color: CYAN },
              { signal: 'Executive function block', desc: 'You know what you need to do but your brain refuses to translate intention into action. Typical for ADHD dopamine crashes and low-energy states.', color: CYAN },
              { signal: 'Overwhelm from project scope', desc: 'The task feels too large to start. "Write my thesis" is paralyzing. "Type the first sentence of chapter 2" is doable. The Atomizer makes the conversion.', color: '#a78bfa' },
              { signal: 'Returning from a crash', desc: 'After running Emergency Recovery, you have stabilized but don\'t know where to re-enter work. Run The Atomizer on the lowest-resistance task to rebuild momentum.', color: '#a78bfa' },
            ].map(s => (
              <div key={s.signal} className="flex gap-4 p-4 rounded-xl border"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                <div className="w-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: s.color, minHeight: 40 }} />
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: ET.ink }}>{s.signal}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 border text-sm leading-relaxed" style={{ backgroundColor: CYAN_BG, borderColor: CYAN_BORDER, color: CYAN }}>
            <strong>Key insight:</strong> Activation energy — the energy required to start a task — is the core ADHD problem. The Atomizer eliminates it by shrinking every first step to under 2 minutes. You cannot procrastinate a 2-minute action indefinitely.
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>The Science</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>Why atomization works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: 'Activation Energy',
                body: 'The ADHD brain requires disproportionately high activation energy to begin tasks. A 2-minute step has near-zero activation energy. Starting creates momentum that carries through the rest.',
              },
              {
                num: '02',
                title: 'Task Serialization',
                body: 'Showing all steps at once triggers overwhelm. Revealing one step at a time eliminates choice anxiety. The blurred design is not aesthetic — it is a cognitive load management system.',
              },
              {
                num: '03',
                title: 'Completion Loops',
                body: 'Each completed step triggers a small dopamine release. The ADHD brain is reward-sensitive and responds strongly to closure. Frequent completions create a positive feedback loop that sustains work.',
              },
            ].map(c => (
              <div key={c.num} className="p-5 rounded-2xl border flex flex-col gap-3"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                <span className="text-3xl font-bold tabular-nums leading-none" style={{ color: 'rgba(0,229,255,0.35)' }}>{c.num}</span>
                <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: CYAN }} />
                <h3 className="font-semibold text-sm" style={{ color: ET.ink }}>{c.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The 5 Steps ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Protocol Breakdown</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>The 5 phases</h2>
          <div className="flex flex-col gap-5">
            {steps.map((step, i) => (
              <div key={step.num} className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-xs font-mono" style={{ color: ET.sub }}>{step.num}</span>
                    <span className="font-bold text-lg" style={{ color: ET.ink }}>{step.name}</span>
                    <span className="ml-auto text-xs font-mono px-3 py-1 rounded-full border"
                      style={{ borderColor: CYAN_BORDER, color: CYAN, backgroundColor: CYAN_BG }}>
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: ET.mid }}>{step.description}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 rounded-lg p-3 text-xs leading-relaxed"
                      style={{ backgroundColor: 'rgba(0,229,255,0.06)', color: ET.sub, border: `1px solid ${ET.border}` }}>
                      <span className="font-semibold" style={{ color: CYAN }}>Why it works: </span>{step.why}
                    </div>
                    <div className="flex-1 rounded-lg p-3 text-xs leading-relaxed"
                      style={{ backgroundColor: CYAN_BG, color: ET.sub, border: `1px solid ${CYAN_BORDER}` }}>
                      <span className="font-semibold" style={{ color: CYAN }}>In the app: </span>{step.ui}
                    </div>
                  </div>
                </div>
                <div className="h-1" style={{ backgroundColor: ET.border }}>
                  <div className="h-full transition-all" style={{ width: `${((i + 1) / 5) * 100}%`, backgroundColor: CYAN, opacity: 0.4 }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Step by Step Walkthrough ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>How to Use</p>
          <h2 className="text-2xl font-bold mb-10" style={{ color: ET.ink }}>Step-by-step walkthrough</h2>
          <div className="flex flex-col gap-16">
            {walkthroughSteps.map((step, i) => (
              <div key={step.num}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0"
                      style={{ backgroundColor: CYAN_BG, color: CYAN, border: `1px solid ${CYAN_BORDER}` }}
                    >
                      {step.num}
                    </span>
                    <h3 className="font-bold text-lg" style={{ color: ET.ink }}>{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed pl-11" style={{ color: ET.mid }}>{step.body}</p>
                </div>
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
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>Tips to get the most out of it</h2>
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
            <span style={{ color: CYAN }}>Atomize the scary task.</span>
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: ET.sub }}>
            The protocol only works when you run it on an actual task you are avoiding — not a hypothetical one.
          </p>
          <Link
            href="/atomizer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, #00E5FF, #0088aa)`,
              color: '#0a0f1e',
              boxShadow: `0 0 40px rgba(0,229,255,0.3)`,
            }}
          >
            <span>⚡</span>
            Launch The Atomizer
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
            <Link href="/atomizer" className="hover:opacity-70 transition-opacity">Launch Atomizer</Link>
            <Link href="/ignition/guide" className="hover:opacity-70 transition-opacity">Ignition Guide</Link>
            <Link href="/momentum/guide" className="hover:opacity-70 transition-opacity">Recovery Guide</Link>
          </div>
          <p className="text-xs" style={{ color: ET.sub }}>Powered by Duck OS Systems</p>
        </div>
      </footer>

    </div>
  )
}
