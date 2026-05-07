'use client'
import { useState, useEffect, useCallback } from 'react'
import { ET } from '@/lib/theme'

const STORAGE_KEY = 'duckos:protocol:intro-seen'

// ── Slide content ────────────────────────────────────────────────────────────
const SLIDES = [
  {
    tag: 'Welcome',
    title: 'Protocol Builder',
    subtitle: 'Map your mind. Run your system.',
    body: 'Design custom protocols as visual node graphs — connect tasks, tools, and timers into a system that carries you through the day without willpower.',
    visual: (
      <div className="flex items-center justify-center gap-3">
        {[
          { abbrev: 'ACT', color: '#00E5FF' },
          { abbrev: 'TMR', color: '#f59e0b' },
          { abbrev: 'TOOL', color: '#a78bfa' },
          { abbrev: 'IGN', color: '#f43f5e' },
        ].map(({ abbrev, color }, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              border: `2px solid ${color}`,
              backgroundColor: `${color}15`,
              boxShadow: `0 0 12px ${color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color, letterSpacing: '0.1em' }}>
                {abbrev}
              </span>
            </div>
            <div style={{
              fontSize: 8, fontFamily: 'monospace', letterSpacing: '0.08em',
              color: `${color}99`, textTransform: 'uppercase',
            }}>
              {abbrev === 'ACT' ? 'Action' : abbrev === 'TMR' ? 'Timer' : abbrev === 'TOOL' ? 'Tool' : 'Ignition'}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: 'Node Types',
    title: 'Four Node Types',
    subtitle: 'Each node does one job.',
    body: null,
    visual: (
      <div className="flex flex-col gap-3 w-full">
        {[
          { abbrev: 'ACT', color: '#00E5FF', label: 'Action', desc: 'A step, habit, or task to complete.' },
          { abbrev: 'TMR', color: '#f59e0b', label: 'Timer', desc: 'Timed deep-work or Pomodoro session.' },
          { abbrev: 'TOOL', color: '#a78bfa', label: 'Tool', desc: 'Opens Atomizer or Emergency Recovery.' },
          { abbrev: 'IGN',  color: '#f43f5e', label: 'Ignition', desc: '10-min launch sequence to kill inertia.' },
        ].map(({ abbrev, color, label, desc }) => (
          <div key={abbrev} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 12px', borderRadius: 8,
            backgroundColor: `${color}0d`,
            border: `1px solid ${color}30`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${color}`,
              backgroundColor: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 700, color, letterSpacing: '0.08em' }}>
                {abbrev}
              </span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: ET.ink, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {label}
              </p>
              <p style={{ margin: 0, fontSize: 10, color: ET.sub, marginTop: 2 }}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: 'Build Mode',
    title: 'Build Your Protocol',
    subtitle: 'Add nodes. Draw connections. Name each step.',
    body: 'Use the sidebar to add nodes to the canvas. The force graph auto-arranges them. Click any node to select and edit it — then connect nodes to define the order of execution.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {[
          { step: '01', text: 'Click a node type in the sidebar to add it', color: '#00E5FF' },
          { step: '02', text: 'Select a node to rename, configure, or delete it', color: '#a78bfa' },
          { step: '03', text: 'Connect nodes by selecting source → target in the sidebar', color: '#f59e0b' },
        ].map(({ step, text, color }) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
              color, minWidth: 24, letterSpacing: '0.06em',
            }}>{step}</span>
            <div style={{
              flex: 1, height: 1, backgroundColor: `${color}30`,
            }} />
            <span style={{
              fontSize: 11, color: ET.mid, maxWidth: 200, textAlign: 'right', lineHeight: 1.4,
            }}>{text}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: 'Flow Mode',
    title: 'Run Your Protocol',
    subtitle: 'Click Ignite. Follow the steps.',
    body: 'Press the Ignite button to enter Flow Mode. The system walks you through each node in sequence. Hit Next Step to advance, or let timers auto-advance.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        {[
          { label: 'Ignite', color: '#f43f5e', desc: 'Launches the 600s momentum sequence' },
          { label: 'Next Step →', color: '#00E5FF', desc: 'Advances to the next node in the flow' },
          { label: 'Protocol Complete ✓', color: '#10b981', desc: 'Appears when you reach the last node' },
          { label: 'Stop Flow', color: ET.sub, desc: 'Returns to Build Mode at any time' },
        ].map(({ label, color, desc }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{
              padding: '5px 12px', borderRadius: 4,
              border: `1px solid ${color}60`,
              backgroundColor: `${color}15`,
              fontFamily: 'monospace', fontSize: 10, fontWeight: 600,
              color, letterSpacing: '0.06em', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {label}
            </div>
            <p style={{ margin: 0, fontSize: 10, color: ET.sub, textAlign: 'right', lineHeight: 1.4 }}>
              {desc}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: 'Ready',
    title: "You're ready.",
    subtitle: 'Systems over willpower.',
    body: 'Start with a simple 3-node protocol: one Action → one Timer → one Tool. Run it once. The system will carry you the rest of the way.',
    visual: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, position: 'relative', height: 80 }}>
        {[
          { abbrev: 'ACT', color: '#00E5FF', x: 0 },
          { abbrev: 'TMR', color: '#f59e0b', x: 80 },
          { abbrev: 'TOOL', color: '#a78bfa', x: 160 },
        ].map(({ abbrev, color, x }) => (
          <div key={abbrev} style={{ position: 'absolute', left: `calc(50% - 80px + ${x}px)`, display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              border: `2px solid ${color}`,
              backgroundColor: `${color}18`,
              boxShadow: `0 0 14px ${color}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color, letterSpacing: '0.1em' }}>
                {abbrev}
              </span>
            </div>
            {x < 160 && (
              <div style={{ width: 32, height: 1, backgroundColor: `${color}50`, flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    ),
  },
]

// ── Component ────────────────────────────────────────────────────────────────
export default function IntroSlides({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const [exiting, setExiting] = useState(false)
  const total = SLIDES.length
  const slide = SLIDES[index]
  const isLast = index === total - 1

  const advance = useCallback(() => {
    if (isLast) {
      setExiting(true)
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, '1')
        onDone()
      }, 280)
    } else {
      setIndex(i => i + 1)
    }
  }, [isLast, onDone])

  const back = () => { if (index > 0) setIndex(i => i - 1) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') advance()
      if (e.key === 'ArrowLeft') back()
      if (e.key === 'Escape') {
        localStorage.setItem(STORAGE_KEY, '1')
        onDone()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgba(10,15,30,0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.28s ease',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 480,
        backgroundColor: ET.surface,
        border: `1px solid ${ET.border}`,
        borderRadius: 16,
        padding: '36px 36px 28px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>

        {/* Tag + progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 10, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.18em',
            color: ET.accent,
          }}>
            {slide.tag}
          </span>
          <div style={{ display: 'flex', gap: 5 }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  width: i === index ? 20 : 6, height: 6,
                  borderRadius: 3, border: 'none', cursor: 'pointer',
                  backgroundColor: i === index ? ET.accent : ET.border,
                  transition: 'all 0.2s ease', padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Heading */}
        <div>
          <h2 style={{
            margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.2,
            color: ET.ink, letterSpacing: '-0.01em',
          }}>
            {slide.title}
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: ET.accent, fontFamily: 'monospace' }}>
            {slide.subtitle}
          </p>
        </div>

        {/* Visual */}
        <div style={{ minHeight: 100 }}>
          {slide.visual}
        </div>

        {/* Body text */}
        {slide.body && (
          <p style={{
            margin: 0, fontSize: 13, lineHeight: 1.7,
            color: ET.mid,
          }}>
            {slide.body}
          </p>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <button
            onClick={back}
            style={{
              fontFamily: 'monospace', fontSize: 11, background: 'none', border: 'none',
              color: index === 0 ? 'transparent' : ET.sub,
              cursor: index === 0 ? 'default' : 'pointer',
              letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0,
              transition: 'color 0.15s',
            }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => { localStorage.setItem(STORAGE_KEY, '1'); onDone() }}
              style={{
                fontFamily: 'monospace', fontSize: 10, background: 'none', border: 'none',
                color: ET.sub, cursor: 'pointer',
                letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0,
              }}
            >
              Skip
            </button>
            <button
              onClick={advance}
              style={{
                fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '10px 24px', borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${ET.accent}`,
                backgroundColor: isLast ? ET.accent : 'rgba(0,229,255,0.1)',
                color: isLast ? ET.bg : ET.accent,
                transition: 'all 0.15s ease',
              }}
            >
              {isLast ? 'Build Now' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Hook: show only on first visit ───────────────────────────────────────────
export function useIntroSlides() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setShow(true)
  }, [])

  return { show, done: () => setShow(false) }
}
