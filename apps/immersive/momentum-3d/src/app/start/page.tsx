'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSystem } from '@/lib/system-context'
import { getRecommendation } from '@/lib/protocol-router'
import { ET, energyBars } from '@/lib/theme'

const StateCheckScene = dynamic(() => import('@/components/StateCheckScene'), { ssr: false })

const EMAIL_SHOWN_KEY = 'duckos:start:email_shown'
const LAST_CHECK_KEY  = 'duckos:start:last_check'
const FOUR_HOURS      = 4 * 60 * 60 * 1000

type Step = 'energy' | 'water' | 'light' | 'diagnosis'

const ALL_TOOLS = [
  { name: 'Emergency Recovery', route: '/momentum',         color: '#ff4444', desc: 'Fail-safe reset',  complexity: 'low'  },
  { name: 'The Atomizer',       route: '/atomizer',         color: '#f59e0b', desc: '2-min steps',      complexity: 'high' },
  { name: 'Ignition Sequence',  route: '/ignition',         color: '#00E5FF', desc: '600s power-up',    complexity: 'low'  },
  { name: 'Protocol Builder',   route: '/protocol-builder', color: '#8b5cf6', desc: 'Map your system',  complexity: 'high' },
]

export default function StartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const forceReset = searchParams.get('reset') === 'true'
  const { energy, isLocked, isProtected, isLoaded, setEnergy, setSensory } = useSystem()

  const [step,         setStep]        = useState<Step>('energy')
  const [localEnergy,  setLocalEnergy] = useState(5)
  const [isReturning,  setIsReturning] = useState(false)
  const [showOverride, setShowOverride] = useState(false)
  const [showEmail,    setShowEmail]   = useState(false)
  const [emailShown,   setEmailShown]  = useState(false)
  const [emailValue,   setEmailValue]  = useState('')
  const [emailStatus,  setEmailStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [pendingRoute, setPendingRoute] = useState('')

  // Sync slider from context after localStorage loads
  useEffect(() => {
    if (isLoaded) setLocalEnergy(energy)
  }, [isLoaded, energy])

  // Returning-user and email-gate detection
  useEffect(() => {
    if (!isLoaded) return
    if (localStorage.getItem(EMAIL_SHOWN_KEY)) setEmailShown(true)
    // ?reset=true (e.g. from Emergency Recovery) always forces full check-in
    if (forceReset) return
    const ts = localStorage.getItem(LAST_CHECK_KEY)
    if (ts && Date.now() - Number(ts) < FOUR_HOURS) {
      setIsReturning(true)
      setStep('diagnosis')
    }
  }, [isLoaded, forceReset])

  const rec = getRecommendation({ energy: localEnergy, isLocked })

  const handleEnergySelect = (n: number) => {
    setLocalEnergy(n)
    setEnergy(n)
    localStorage.setItem(LAST_CHECK_KEY, String(Date.now()))
    setStep('water')
  }

  const handleWater = (val: boolean) => {
    setSensory({ water: val })
    setStep('light')
  }

  const handleLight = (val: boolean) => {
    setSensory({ light: val })
    setStep('diagnosis')
  }

  const navigate = (route: string) => {
    if (!emailShown) {
      setPendingRoute(route)
      setShowEmail(true)
    } else {
      router.push(route)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailStatus('loading')
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, source: 'daily-checkin' }),
      })
    } catch { /* network errors are non-fatal */ }
    setEmailStatus('success')
    localStorage.setItem(EMAIL_SHOWN_KEY, '1')
    setTimeout(() => router.push(pendingRoute), 1500)
  }

  const handleEmailSkip = () => {
    localStorage.setItem(EMAIL_SHOWN_KEY, '1')
    router.push(pendingRoute)
  }

  const checkInSteps: Step[] = ['energy', 'water', 'light']
  const stepIndex = checkInSteps.indexOf(step)

  return (
    <div className="relative flex flex-col" style={{ minHeight: 'calc(100vh - 112px)' }}>

      {/* 3D background — purely decorative, must not capture pointer events */}
      <div className="absolute inset-0 pointer-events-none">
        <StateCheckScene energy={localEnergy} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(10,15,30,0.55)' }} />

      {/* Progress dots — check-in steps only */}
      {stepIndex >= 0 && (
        <div className="absolute top-[72px] left-1/2 -translate-x-1/2 flex gap-2 z-10 pointer-events-none">
          {checkInSteps.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === stepIndex ? 20 : 8,
                height: 8,
                backgroundColor: i <= stepIndex ? ET.accent : ET.border,
              }}
            />
          ))}
        </div>
      )}

      {/* Returning-user banner */}
      {isReturning && step === 'diagnosis' && !showOverride && (
        <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full text-xs whitespace-nowrap"
          style={{ backgroundColor: ET.surface, border: `1px solid ${ET.border}`, color: ET.sub }}>
          State loaded from earlier ·{' '}
          <button onClick={() => { setIsReturning(false); setStep('energy') }} style={{ color: ET.accent }}>
            Update it?
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">

          {/* ── Energy ── */}
          {step === 'energy' && (
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Step 1 of 3</p>
                <h2 className="text-2xl font-bold mb-2" style={{ color: ET.ink }}>How charged are you?</h2>
                <p className="text-sm" style={{ color: ET.sub }}>Tap your number.</p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Row 1: 1-5 */}
                <div className="grid grid-cols-5 gap-2">
                  {[1,2,3,4,5].map(n => {
                    const color = n <= 3 ? '#ff4444' : '#f59e0b'
                    return (
                      <button
                        key={n}
                        onClick={() => handleEnergySelect(n)}
                        className="flex items-center justify-center rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95"
                        style={{
                          height: 64,
                          backgroundColor: `${color}18`,
                          border: `2px solid ${color}50`,
                          color,
                        }}
                      >
                        {n}
                      </button>
                    )
                  })}
                </div>
                {/* Row 2: 6-10 */}
                <div className="grid grid-cols-5 gap-2">
                  {[6,7,8,9,10].map(n => {
                    const color = n <= 6 ? '#f59e0b' : '#00E5FF'
                    return (
                      <button
                        key={n}
                        onClick={() => handleEnergySelect(n)}
                        className="flex items-center justify-center rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95"
                        style={{
                          height: 64,
                          backgroundColor: `${color}18`,
                          border: `2px solid ${color}50`,
                          color,
                        }}
                      >
                        {n}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color legend */}
              <div className="flex justify-between text-xs px-1" style={{ color: ET.sub }}>
                <span style={{ color: '#ff4444' }}>● Crash</span>
                <span style={{ color: '#f59e0b' }}>● Low</span>
                <span style={{ color: '#00E5FF' }}>● Ready</span>
              </div>
            </div>
          )}

          {/* ── Water ── */}
          {step === 'water' && (
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Step 2 of 3</p>
                <h2 className="text-2xl font-bold mb-2" style={{ color: ET.ink }}>Have you had water today?</h2>
                <p className="text-sm" style={{ color: ET.sub }}>Even a few sips counts.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleWater(true)}
                  className="w-full py-5 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: ET.surface, border: `2px solid ${ET.accent}`, color: ET.ink }}
                >
                  💧 Yes
                </button>
                <button
                  onClick={() => handleWater(false)}
                  className="w-full py-5 rounded-xl font-semibold text-lg transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: ET.surface, border: `2px solid ${ET.border}`, color: ET.mid }}
                >
                  Not yet
                </button>
              </div>
            </div>
          )}

          {/* ── Light ── */}
          {step === 'light' && (
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Step 3 of 3</p>
                <h2 className="text-2xl font-bold mb-2" style={{ color: ET.ink }}>How&apos;s the light around you?</h2>
                <p className="text-sm" style={{ color: ET.sub }}>Sensory environment check.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleLight(true)}
                  className="w-full py-5 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: ET.surface, border: `2px solid ${ET.accent}`, color: ET.ink }}
                >
                  ☀️ Comfortable
                </button>
                <button
                  onClick={() => handleLight(false)}
                  className="w-full py-5 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: ET.surface, border: `2px solid ${ET.border}`, color: ET.mid }}
                >
                  😬 Too harsh
                </button>
              </div>
            </div>
          )}

          {/* ── Diagnosis ── */}
          {step === 'diagnosis' && !showOverride && (
            <div className="flex flex-col gap-6">
              {/* State label + tool name + tagline */}
              <div className="text-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
                  style={{ backgroundColor: `${rec.colorHex}20`, border: `1px solid ${rec.colorHex}50` }}
                >
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: rec.colorHex }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: rec.colorHex }}>
                    {rec.label}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: ET.ink }}>{rec.toolName}</h2>
                <p className="text-sm" style={{ color: ET.sub }}>{rec.tagline}</p>
              </div>

              {/* Energy bar — centered, tap to re-check */}
              <button
                onClick={() => setStep('energy')}
                className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl mx-auto cursor-pointer transition-all hover:opacity-80 active:scale-95"
                style={{ backgroundColor: ET.surface, border: `1px solid ${ET.border}` }}
                title="Tap to update energy"
              >
                <span className="text-xs font-mono" style={{ color: ET.sub }}>Energy</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div
                      key={i}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: 20,
                        height: 6,
                        backgroundColor: i <= energyBars(localEnergy) ? rec.colorHex : ET.border,
                        boxShadow: i <= energyBars(localEnergy) ? `0 0 6px ${rec.colorHex}80` : 'none',
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold tabular-nums" style={{ color: rec.colorHex }}>
                  {localEnergy}/10
                </span>
                <span className="text-base font-bold" style={{ color: rec.colorHex }}>↺</span>
              </button>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate(rec.route)}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: rec.colorHex, color: ET.bg }}
                >
                  Run {rec.toolName} →
                </button>
                <button
                  onClick={() => setShowOverride(true)}
                  className="w-full py-3 text-xs transition-opacity hover:opacity-70"
                  style={{ color: ET.sub }}
                >
                  Override — I&apos;ll choose my own
                </button>
              </div>
            </div>
          )}

          {/* ── Override drawer ── */}
          {step === 'diagnosis' && showOverride && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setShowOverride(false)} className="text-sm" style={{ color: ET.sub }}>
                  ← Back
                </button>
                <h2 className="text-lg font-bold" style={{ color: ET.ink }}>Choose a protocol</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ALL_TOOLS.map(tool => {
                  const hardLocked  = isLocked   && tool.complexity === 'high'
                  const softWarning = isProtected && tool.complexity === 'high' && !hardLocked
                  return (
                    <button
                      key={tool.route}
                      onClick={() => !hardLocked && navigate(tool.route)}
                      disabled={hardLocked}
                      className="flex flex-col gap-1 p-4 rounded-xl text-left transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: ET.surface,
                        border: `1px solid ${hardLocked ? ET.border : softWarning ? '#f59e0b40' : tool.color + '50'}`,
                      }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tool.color }} />
                      <span className="text-sm font-semibold mt-1" style={{ color: ET.ink }}>{tool.name}</span>
                      <span className="text-xs" style={{ color: ET.sub }}>{tool.desc}</span>
                      {softWarning && (
                        <span className="text-xs mt-1" style={{ color: '#f59e0b' }}>⚠ low energy</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Email gate overlay ── */}
      {showEmail && (
        <div
          className="absolute inset-0 z-20 flex items-end justify-center"
          style={{ background: 'rgba(10,15,30,0.72)' }}
        >
          <div
            className="w-full max-w-md rounded-t-2xl p-8 pb-10"
            style={{ backgroundColor: ET.surface, border: `1px solid ${ET.border}` }}
          >
            {emailStatus === 'success' ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-3">🦆</p>
                <h3 className="text-lg font-bold mb-1" style={{ color: ET.ink }}>You&apos;re in!</h3>
                <p className="text-sm" style={{ color: ET.sub }}>Launching your protocol…</p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit}>
                <h3 className="text-lg font-bold mb-2" style={{ color: ET.ink }}>
                  Want the Duck OS Starter Kit?
                </h3>
                <p className="text-sm mb-6" style={{ color: ET.sub }}>
                  5 protocols + a Notion template — free. Start your system today.
                </p>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={emailValue}
                    onChange={e => setEmailValue(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={emailStatus === 'loading'}
                    className="px-4 py-3 rounded-lg text-sm focus:outline-none"
                    style={{ border: `1px solid ${ET.border}`, backgroundColor: ET.bg, color: ET.ink }}
                  />
                  <button
                    type="submit"
                    disabled={emailStatus === 'loading' || !emailValue}
                    className="px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40"
                    style={{ backgroundColor: ET.accent, color: ET.bg }}
                  >
                    {emailStatus === 'loading' ? 'Sending…' : 'Get the Kit (Free)'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleEmailSkip}
                  className="w-full mt-4 text-xs py-2 transition-opacity hover:opacity-70"
                  style={{ color: ET.sub }}
                >
                  Not now — go to protocol
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
