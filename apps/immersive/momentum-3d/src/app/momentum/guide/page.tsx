import Link from 'next/link'
import Image from 'next/image'
import { ET } from '@/lib/theme'

const RED = '#ff4444'
const RED_BG = 'rgba(255,68,68,0.1)'
const RED_BORDER = 'rgba(255,68,68,0.25)'

const steps = [
  {
    num: '01',
    name: 'Name the Signal',
    time: '~1 min',
    icon: '🔴',
    description:
      'Type what is happening in your system right now. One sentence. The act of naming a mental state creates separation between you and it — you stop being the chaos and start observing it.',
    why: 'Labeling an emotion activates the prefrontal cortex and reduces the amygdala\'s alarm signal. This is the difference between being overwhelmed and witnessing overwhelm.',
    ui: 'A text input prompt appears. Write anything — "My brain won\'t stop racing", "I feel empty and stuck", "Everything is too much." Then tap "I Have Named It."',
  },
  {
    num: '02',
    name: 'Isolate Intentionally',
    time: '30 min',
    icon: '🔇',
    description:
      'A 30-minute countdown timer starts. Close every notification. Put your phone face-down or in another room. Lie flat or sit in silence. Do not try to fix anything. Just stop.',
    why: 'Your nervous system cannot regulate while receiving new inputs. Isolation is not avoidance — it is a required reset condition. The timer removes the ambiguity of "how long should I rest."',
    ui: 'A large monospace timer counts down from 30:00. You can start it immediately or skip to Step 3 if you already rested.',
  },
  {
    num: '03',
    name: 'Activate Your Anchor',
    time: '~5 min',
    icon: '🎵',
    description:
      'A curated Spotify playlist loads directly in the page. Press play. This is not background music — the goal is to let the sound replace the mental noise for a few minutes.',
    why: 'Music reaches the limbic system (emotional brain) faster than thought. An anchor playlist you associate with calm or focus becomes a conditioned trigger that bypasses willpower.',
    ui: 'A Spotify embed appears with the anchor playlist. Tap play. Tap "Anchor Activated" when you feel a shift — even a small one.',
  },
  {
    num: '04',
    name: 'Do One Tiny Thing',
    time: '~3 min',
    icon: '🤲',
    description:
      'Four physical micro-tasks appear as buttons: touch typing for 1 min, make your bed, wash one cup, reorganize one drawer. Pick exactly one. Complete it with your hands.',
    why: 'Physical action breaks the feedback loop between inaction and shame. These tasks are small enough that your brain cannot justify refusing them, but real enough to generate genuine completion satisfaction.',
    ui: 'Tap one task to select it (turns cyan). Tap "Hands Moved" once done. You only need one — resist the urge to do all four.',
  },
  {
    num: '05',
    name: 'Ask the System',
    time: '~2 min',
    icon: '⚡',
    description:
      'One final input: "What is the fastest thing you can finish right now?" Write one task — not a project, not a plan, one concrete action. Then tap Execute.',
    why: 'The protocol ends with forward motion, not reflection. You are not planning your week — you are picking the smallest possible re-entry point into productivity. Momentum compounds from here.',
    ui: 'Text field appears. Type one task. Tap "Execute & Return to Momentum." The protocol is complete.',
  },
]

// ── SVG Mockups ────────────────────────────────────────────────────────────

function AlertMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      <ellipse cx="240" cy="150" rx="200" ry="130" fill="rgba(255,68,68,0.06)"/>
      {/* Warning circle */}
      <circle cx="240" cy="100" r="40" fill="rgba(255,68,68,0.12)" stroke={RED} strokeWidth="1.5" opacity="0.8"/>
      <text x="240" y="108" textAnchor="middle" fontSize="32">⚠️</text>
      {/* Title */}
      <text x="240" y="162" textAnchor="middle" fontFamily="monospace" fontSize="16" fill="#E8F4F8" fontWeight="900">System Alert Triggered</text>
      <text x="240" y="184" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8">Feeling chaotic but empty? Stop. Don't push through.</text>
      {/* Button */}
      <rect x="152" y="204" width="176" height="40" rx="10" fill="#00E5FF"/>
      <text x="240" y="229" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#0A0F1E" fontWeight="700">Initialize Protocol</text>
      {/* Progress bar */}
      <rect x="0" y="293" width="480" height="4" fill="rgba(0,229,255,0.1)" rx="0"/>
      <rect x="0" y="293" width="0" height="4" fill="#00E5FF" rx="0"/>
    </svg>
  )
}

function Step1Mockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      <text x="32" y="44" fontFamily="monospace" fontSize="9" fill="#00E5FF" fontWeight="700" letterSpacing="3">STEP 01</text>
      <text x="32" y="72" fontFamily="monospace" fontSize="18" fill="#E8F4F8" fontWeight="900">Name the Signal</text>
      <text x="32" y="96" fontFamily="monospace" fontSize="9" fill="#6B9BB8">Type it out. Naming the state separates you from it:</text>
      {/* Input field */}
      <rect x="32" y="112" width="416" height="52" rx="10" fill="rgba(0,0,0,0.4)" stroke="#1E3A5F" strokeWidth="1"/>
      <text x="48" y="142" fontFamily="monospace" fontSize="10" fill="#6B9BB8" fontStyle="italic">My system is about to break...</text>
      {/* Cursor blink */}
      <rect x="236" y="130" width="2" height="18" fill="#00E5FF" opacity="0.8"/>
      {/* Button */}
      <rect x="32" y="184" width="416" height="44" rx="10" fill="transparent" stroke="#00E5FF" strokeWidth="1.5"/>
      <text x="240" y="211" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#00E5FF" fontWeight="700">I Have Named It</text>
      {/* Step counter */}
      <text x="240" y="272" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#2A4A6A" letterSpacing="4">EMERGENCY PROTOCOL ACTIVE — 1/5</text>
      {/* Progress bar */}
      <rect x="0" y="293" width="480" height="4" fill="rgba(0,229,255,0.1)"/>
      <rect x="0" y="293" width="69" height="4" fill="#00E5FF"/>
    </svg>
  )
}

function Step2Mockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      <text x="32" y="44" fontFamily="monospace" fontSize="9" fill="#00E5FF" fontWeight="700" letterSpacing="3">STEP 02</text>
      <text x="32" y="72" fontFamily="monospace" fontSize="18" fill="#E8F4F8" fontWeight="900">Isolate Intentionally</text>
      <text x="32" y="94" fontFamily="monospace" fontSize="9" fill="#6B9BB8">Set a timer. Close all notifications. Sit in silence.</text>
      {/* Timer display */}
      <rect x="32" y="108" width="416" height="80" rx="12" fill="rgba(0,0,0,0.4)" stroke="#1E3A5F" strokeWidth="1"/>
      <text x="240" y="162" textAnchor="middle" fontFamily="monospace" fontSize="44" fill="#00E5FF" fontWeight="900" letterSpacing="-2">29:47</text>
      {/* Button */}
      <rect x="32" y="208" width="416" height="44" rx="10" fill="#00E5FF"/>
      <text x="240" y="235" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#0A0F1E" fontWeight="700">Start Maintenance</text>
      {/* Step counter */}
      <text x="240" y="272" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#2A4A6A" letterSpacing="4">EMERGENCY PROTOCOL ACTIVE — 2/5</text>
      {/* Progress bar */}
      <rect x="0" y="293" width="480" height="4" fill="rgba(0,229,255,0.1)"/>
      <rect x="0" y="293" width="138" height="4" fill="#00E5FF"/>
    </svg>
  )
}

function Step3Mockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      <text x="32" y="44" fontFamily="monospace" fontSize="9" fill="#00E5FF" fontWeight="700" letterSpacing="3">STEP 03</text>
      <text x="32" y="72" fontFamily="monospace" fontSize="18" fill="#E8F4F8" fontWeight="900">Activate Your Anchor</text>
      <text x="32" y="94" fontFamily="monospace" fontSize="9" fill="#6B9BB8">Music bypasses the thinking brain. Listen to anchor playlist.</text>
      {/* Spotify embed mockup */}
      <rect x="32" y="108" width="416" height="90" rx="8" fill="#121212" stroke="#1E3A5F" strokeWidth="1"/>
      <circle cx="68" cy="153" r="22" fill="#1DB954" opacity="0.9"/>
      <text x="68" y="158" textAnchor="middle" fontSize="18">▶</text>
      <rect x="104" y="136" width="140" height="10" rx="3" fill="#2A2A2A"/>
      <rect x="104" y="152" width="100" height="8" rx="3" fill="#1A1A1A"/>
      <rect x="104" y="168" width="120" height="6" rx="3" fill="#1A1A1A"/>
      <rect x="300" y="143" width="120" height="4" rx="2" fill="#1DB954" opacity="0.6"/>
      <rect x="300" y="155" width="80" height="4" rx="2" fill="#2A2A2A"/>
      {/* Button */}
      <rect x="32" y="216" width="416" height="44" rx="10" fill="#00E5FF"/>
      <text x="240" y="243" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#0A0F1E" fontWeight="700">Anchor Activated</text>
      {/* Progress bar */}
      <rect x="0" y="293" width="480" height="4" fill="rgba(0,229,255,0.1)"/>
      <rect x="0" y="293" width="206" height="4" fill="#00E5FF"/>
    </svg>
  )
}

function Step4Mockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      <text x="32" y="44" fontFamily="monospace" fontSize="9" fill="#00E5FF" fontWeight="700" letterSpacing="3">STEP 04</text>
      <text x="32" y="68" fontFamily="monospace" fontSize="18" fill="#E8F4F8" fontWeight="900">Do One Tiny Thing</text>
      <text x="32" y="88" fontFamily="monospace" fontSize="9" fill="#6B9BB8">Don't try to be productive. Just move your hands. Pick ONE:</text>
      {/* Tasks — first one selected (cyan) */}
      <rect x="32" y="100" width="416" height="36" rx="8" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="1"/>
      <text x="48" y="122" fontFamily="monospace" fontSize="10" fill="#E8F4F8">Touch typing for 1 min</text>
      <text x="424" y="122" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#00E5FF">✓</text>

      <rect x="32" y="142" width="416" height="36" rx="8" fill="transparent" stroke="#1E3A5F" strokeWidth="1"/>
      <text x="48" y="164" fontFamily="monospace" fontSize="10" fill="#A8C8D8">Make your bed</text>

      <rect x="32" y="184" width="416" height="36" rx="8" fill="transparent" stroke="#1E3A5F" strokeWidth="1"/>
      <text x="48" y="206" fontFamily="monospace" fontSize="10" fill="#A8C8D8">Wash one cup</text>
      {/* Button */}
      <rect x="32" y="228" width="416" height="36" rx="8" fill="#00E5FF"/>
      <text x="240" y="251" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#0A0F1E" fontWeight="700">Hands Moved</text>
      {/* Progress bar */}
      <rect x="0" y="293" width="480" height="4" fill="rgba(0,229,255,0.1)"/>
      <rect x="0" y="293" width="275" height="4" fill="#00E5FF"/>
    </svg>
  )
}

function Step5Mockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      <text x="32" y="44" fontFamily="monospace" fontSize="9" fill="#00E5FF" fontWeight="700" letterSpacing="3">STEP 05</text>
      <text x="32" y="72" fontFamily="monospace" fontSize="18" fill="#E8F4F8" fontWeight="900">Ask the System</text>
      <text x="32" y="94" fontFamily="monospace" fontSize="9" fill="#6B9BB8">What is the fastest thing you can finish right now?</text>
      <text x="32" y="110" fontFamily="monospace" fontSize="9" fill="#6B9BB8">Don't plan. Just execute.</text>
      {/* Input */}
      <rect x="32" y="124" width="416" height="52" rx="10" fill="rgba(0,0,0,0.4)" stroke="#1E3A5F" strokeWidth="1"/>
      <text x="48" y="154" fontFamily="monospace" fontSize="10" fill="#E8F4F8">Reply to that one email...</text>
      {/* Button */}
      <rect x="32" y="196" width="416" height="44" rx="10" fill="#00E5FF"/>
      <text x="240" y="223" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#0A0F1E" fontWeight="700">Execute & Return to Momentum</text>
      {/* Success hint */}
      <text x="240" y="260" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#2A4A6A">Protocol complete — Momentum Restored 🚀</text>
      {/* Progress bar full */}
      <rect x="0" y="293" width="480" height="4" fill="rgba(0,229,255,0.1)"/>
      <rect x="0" y="293" width="480" height="4" fill="#00E5FF"/>
    </svg>
  )
}

function LandingMockup() {
  return (
    <svg viewBox="0 0 480 280" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="280" fill="#0A0F1E" rx="12"/>
      <line x1="0" y1="40" x2="480" y2="40" stroke="#1E3A5F" strokeWidth="0.5" opacity="0.5"/>
      {/* Nav */}
      <rect width="480" height="40" fill="#0F1829"/>
      <circle cx="24" cy="20" r="10" fill="#1E3A5F"/>
      <rect x="42" y="14" width="60" height="12" rx="3" fill="#1E3A5F"/>
      <rect x="340" y="14" width="60" height="12" rx="3" fill="#1E3A5F"/>
      <rect x="410" y="14" width="48" height="12" rx="3" fill="rgba(255,68,68,0.2)" stroke={RED} strokeWidth="0.5"/>
      {/* Hero text */}
      <text x="240" y="76" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8" letterSpacing="2">⚠️ EMERGENCY RESET — 2 MIN</text>
      {/* Card */}
      <rect x="100" y="88" width="280" height="150" rx="12" fill="#0F1829" stroke={RED} strokeWidth="2"/>
      <rect x="100" y="88" width="280" height="150" rx="12" fill="rgba(255,68,68,0.04)"/>
      {/* Card image area */}
      <rect x="112" y="100" width="256" height="72" rx="8" fill="#1A2840"/>
      {/* Shield icon */}
      <path d="M 240 110 L 260 117 L 260 130 C 260 140 240 146 240 146 C 240 146 220 140 220 130 L 220 117 Z"
        fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6"/>
      <text x="240" y="133" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={RED} fontWeight="700">↺</text>
      {/* Card body */}
      <text x="130" y="194" fontFamily="monospace" fontSize="11" fill="#E8F4F8" fontWeight="700">Emergency Recovery</text>
      <rect x="130" y="202" width="180" height="6" rx="2" fill="#1E3A5F" opacity="0.7"/>
      <rect x="130" y="213" width="130" height="6" rx="2" fill="#1E3A5F" opacity="0.4"/>
      {/* Arrow */}
      <circle cx="352" cy="200" r="16" fill="rgba(255,68,68,0.2)" stroke={RED} strokeWidth="1.5"/>
      <text x="352" y="206" textAnchor="middle" fontSize="14" fill={RED}>→</text>
      <text x="240" y="254" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={RED} letterSpacing="2" opacity="0.7">CLICK TO LAUNCH</text>
    </svg>
  )
}

const walkthroughSteps = [
  {
    num: '01',
    title: 'Open Emergency Recovery',
    body: 'From the home page, click the red "Emergency Reset — 2 min" button at the top, or find the Emergency Recovery card in the OS Tools section. Both go to /momentum.',
    visual: <LandingMockup />,
  },
  {
    num: '02',
    title: 'Initialize the Protocol',
    body: 'Scroll down to the Emergency Protocol widget. You will see a warning screen. Tap "Initialize Protocol" to begin — the 5-step sequence starts immediately.',
    visual: <AlertMockup />,
  },
  {
    num: '03',
    title: 'Step 1 — Name the Signal',
    body: 'A text field appears. Type what your mental state feels like right now in one sentence. It does not have to be eloquent. Then tap "I Have Named It" to continue.',
    visual: <Step1Mockup />,
  },
  {
    num: '04',
    title: 'Step 2 — Isolate (30 min timer)',
    body: 'Start the 30-minute timer and step away from all screens. Lie down or sit quietly. The timer creates a defined container for the rest — no guilt, no ambiguity.',
    visual: <Step2Mockup />,
  },
  {
    num: '05',
    title: 'Step 3 — Activate your Anchor',
    body: 'The Spotify playlist loads directly in the page. Press play. You do not need a Spotify account — it plays in the embedded player. Tap "Anchor Activated" when ready.',
    visual: <Step3Mockup />,
  },
  {
    num: '06',
    title: 'Step 4 — Do One Tiny Thing',
    body: 'Four micro-tasks appear. Tap one to select it (it turns cyan), complete the physical task, then tap "Hands Moved." Do not do all four — one is the rule.',
    visual: <Step4Mockup />,
  },
  {
    num: '07',
    title: 'Step 5 — Execute the Next Thing',
    body: 'Write the single fastest task you can finish right now. Not a plan — one action. Tap "Execute & Return to Momentum." The protocol completes and you re-enter work.',
    visual: <Step5Mockup />,
  },
]

const tips = [
  {
    icon: '🚨',
    title: 'Use it before the spiral — not after',
    body: 'The protocol works best when you catch the signal early: the hollow feeling, the racing thoughts that go nowhere, the paralysis. Do not wait until you are fully crashed.',
  },
  {
    icon: '⏱️',
    title: 'Honor the 30-minute timer',
    body: 'Do not shorten Step 2. Thirty minutes feels long when your brain is in emergency mode. That discomfort is the point — you are letting the system reset, not powering through.',
  },
  {
    icon: '🎵',
    title: 'Build a real anchor playlist',
    body: 'The default playlist works but your own curated one works better. Condition it by playing it repeatedly during calm, focused moments. Over time it becomes a trigger.',
  },
  {
    icon: '🤲',
    title: 'The physical task is non-negotiable',
    body: 'Step 4 is not symbolic. Your hands need to do something real. Washing a cup takes 45 seconds and creates genuine sensory feedback. That is the mechanism.',
  },
  {
    icon: '🔁',
    title: 'You can run it more than once',
    body: 'The protocol resets after completion. On a bad day you might run it twice — once in the morning to get started, once mid-afternoon if momentum breaks. That is fine.',
  },
  {
    icon: '📵',
    title: 'Step 2 means no phone',
    body: 'Scrolling during the 30-minute isolation adds inputs to an overloaded system. Phone face-down in another room, not just silenced.',
  },
]

export default function EmergencyRecoveryGuidePage() {
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
            href="/momentum"
            className="text-sm font-medium px-4 py-2 rounded-full transition-all hover:opacity-80"
            style={{ backgroundColor: RED_BG, color: RED, border: `1px solid ${RED_BORDER}` }}
          >
            ⚠️ Launch Recovery →
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6">

        {/* ── Hero ── */}
        <div className="py-16 md:py-20 border-b" style={{ borderColor: ET.border }}>
          <Link
            href="/momentum"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 hover:opacity-70 transition-opacity"
            style={{ color: RED }}
          >
            ← Back to Emergency Recovery
          </Link>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ET.sub }}>
                Duck OS · Fail-Safe · Guide
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: ET.ink }}>
                How to Use<br />
                <span style={{ color: RED }}>Emergency Recovery</span>
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: ET.mid }}>
                A 5-step fail-safe protocol for when the spiral starts. Not a productivity system — a reset mechanism. Designed for your worst moments, not your best ones.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '5 steps', sub: 'sequential protocol' },
                  { label: '~40 min', sub: 'full run time' },
                  { label: 'fail-safe', sub: 'works on worst days' },
                ].map(b => (
                  <div key={b.label} className="px-4 py-2.5 rounded-xl border text-center"
                    style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
                    <div className="text-sm font-bold" style={{ color: RED }}>{b.label}</div>
                    <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: ET.sub }}>{b.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-72 shrink-0">
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: ET.border }}>
                <Image
                  src="/uploads/emergency-recovery-cover.svg"
                  alt="Emergency Recovery"
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
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>When to Run This</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>Recognize the signal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { signal: 'Chaotic but empty', desc: 'Mind racing but no actual output happening. Switching tabs. Starting things without finishing.', color: RED },
              { signal: 'Frozen and stuck', desc: 'Unable to start anything. Decision paralysis. Staring at a screen for 20 minutes doing nothing.', color: RED },
              { signal: 'Emotional flooding', desc: 'Feeling disproportionately overwhelmed by a task or situation. Shame spiral starting.', color: '#ff8c00' },
              { signal: 'Post-crash flatness', desc: 'After an overwork sprint, a bad day, or a conflict. System is depleted and unresponsive.', color: '#ff8c00' },
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
          <div className="rounded-xl p-4 border text-sm leading-relaxed" style={{ backgroundColor: RED_BG, borderColor: RED_BORDER, color: RED }}>
            <strong>Important:</strong> This protocol is for the signal, not the crash. If you can feel it coming — the hollow feeling, the racing thoughts — run it now. Do not wait until you are fully down.
          </div>
        </section>

        {/* ── The 5 Steps ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Protocol Breakdown</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>The 5 steps</h2>
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
                      style={{ borderColor: RED_BORDER, color: RED, backgroundColor: RED_BG }}>
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: ET.mid }}>{step.description}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 rounded-lg p-3 text-xs leading-relaxed"
                      style={{ backgroundColor: 'rgba(0,229,255,0.06)', color: ET.sub, border: `1px solid ${ET.border}` }}>
                      <span className="font-semibold" style={{ color: ET.accent }}>Why it works: </span>{step.why}
                    </div>
                    <div className="flex-1 rounded-lg p-3 text-xs leading-relaxed"
                      style={{ backgroundColor: RED_BG, color: ET.sub, border: `1px solid ${RED_BORDER}` }}>
                      <span className="font-semibold" style={{ color: RED }}>In the app: </span>{step.ui}
                    </div>
                  </div>
                </div>
                {/* Step progress indicator */}
                <div className="h-1" style={{ backgroundColor: ET.border }}>
                  <div className="h-full transition-all" style={{ width: `${((i + 1) / 5) * 100}%`, backgroundColor: RED, opacity: 0.5 }} />
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
                      style={{ backgroundColor: RED_BG, color: RED, border: `1px solid ${RED_BORDER}` }}
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
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>Tips for the protocol to actually work</h2>
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
            <span style={{ color: RED }}>Run the protocol.</span>
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: ET.sub }}>
            This works when you are actively in a spiral — not when you are reading about one.
          </p>
          <Link
            href="/momentum"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${RED}, #ff8c00)`,
              color: 'white',
              boxShadow: `0 0 40px rgba(255,68,68,0.35)`,
            }}
          >
            <span>⚠️</span>
            Launch Emergency Recovery
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
            <Link href="/momentum" className="hover:opacity-70 transition-opacity">Launch Recovery</Link>
            <Link href="/ignition/guide" className="hover:opacity-70 transition-opacity">Ignition Guide</Link>
          </div>
          <p className="text-xs" style={{ color: ET.sub }}>Powered by Duck OS Systems</p>
        </div>
      </footer>

    </div>
  )
}
