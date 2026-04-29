'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ET } from '@/lib/theme'

interface StepProps {
  onNext: () => void
  onBack?: () => void
}

const Step0 = ({ onNext }: StepProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="text-center"
  >
    <div className="mb-6 inline-flex p-4 rounded-full bg-red-500/10 border border-red-500/20">
      <span className="text-3xl">⚠️</span>
    </div>
    <h3 className="text-2xl font-bold mb-4" style={{ color: ET.ink }}>System Alert Triggered</h3>
    <p className="text-base mb-8 max-w-md mx-auto" style={{ color: ET.mid }}>
      Feeling chaotic but empty? Stop. Don&apos;t push through. 
      Activate the Emergency Protocol now.
    </p>
    <button 
      onClick={onNext}
      className="px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
      style={{ backgroundColor: ET.accent, color: ET.bg }}
    >
      Initialize Protocol
    </button>
  </motion.div>
)

const Step1 = ({ onNext }: StepProps) => {
  const [signal, setSignal] = useState('')
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ET.accent }}>Step 01</p>
      <h3 className="text-2xl font-bold mb-4" style={{ color: ET.ink }}>Name the Signal</h3>
      <p className="text-sm mb-6" style={{ color: ET.mid }}>
        Type it out. Naming the state separates you from it:
      </p>
      
      <input 
        type="text"
        value={signal}
        onChange={e => setSignal(e.target.value)}
        placeholder="e.g., My system is about to break..."
        className="w-full p-4 rounded-xl mb-8 bg-black/40 outline-none focus:ring-1 ring-cyan-500 italic font-mono"
        style={{ color: ET.ink, border: `1px solid ${ET.border}` }}
      />

      <button 
        disabled={!signal.trim()}
        onClick={onNext}
        className="w-full py-4 rounded-xl font-bold border transition-all hover:bg-white/5 disabled:opacity-40"
        style={{ borderColor: ET.accent, color: ET.accent }}
      >
        I Have Named It
      </button>
    </motion.div>
  )
}

const Step2 = ({ onNext }: StepProps) => {
  const [seconds, setSeconds] = useState(30 * 60)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: any = null
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1)
      }, 1000)
    } else if (seconds === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, seconds])

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ET.accent }}>Step 02</p>
      <h3 className="text-2xl font-bold mb-4" style={{ color: ET.ink }}>Isolate Intentionally</h3>
      <p className="text-sm mb-6" style={{ color: ET.sub }}>
        Set a timer for 30 minutes. Close all notifications. Lie down or sit in silence.
      </p>
      
      <div className="text-5xl font-mono text-center py-8 mb-6 rounded-2xl bg-black/40" style={{ color: ET.accent, border: `1px solid ${ET.border}` }}>
        {formatTime(seconds)}
      </div>

      <div className="flex gap-4">
        {!isActive ? (
          <button 
            onClick={() => setIsActive(true)}
            className="flex-1 py-4 rounded-xl font-bold"
            style={{ backgroundColor: ET.accent, color: ET.bg }}
          >
            Start Maintenance
          </button>
        ) : (
          <button 
            onClick={onNext}
            className="flex-1 py-4 rounded-xl font-bold border"
            style={{ borderColor: ET.border, color: ET.mid }}
          >
            Skip to Step 3
          </button>
        )}
      </div>
    </motion.div>
  )
}

const Step3 = ({ onNext }: StepProps) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
  >
    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ET.accent }}>Step 03</p>
    <h3 className="text-2xl font-bold mb-4" style={{ color: ET.ink }}>Activate Your Anchor</h3>
    <p className="text-sm mb-6" style={{ color: ET.sub }}>
      Music bypasses the thinking brain and hits the emotional brain directly. Listen to this anchor playlist to reboot your focus.
    </p>
    
    <div className="rounded-xl mb-8 overflow-hidden border" style={{ borderColor: ET.border, height: '152px' }}>
      <iframe 
        src="https://open.spotify.com/embed/playlist/2ofu1VIe6umZDQjjdMsZ6j?utm_source=generator&theme=0" 
        width="100%" 
        height="152" 
        frameBorder="0" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
      />
    </div>

    <button 
      onClick={onNext}
      className="w-full py-4 rounded-xl font-bold"
      style={{ backgroundColor: ET.accent, color: ET.bg }}
    >
      Anchor Activated
    </button>
  </motion.div>
)

const Step4 = ({ onNext }: StepProps) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Touch typing for 1 min', done: false },
    { id: 2, text: 'Make your bed', done: false },
    { id: 3, text: 'Wash one cup', done: false },
    { id: 4, text: 'Reorganize one drawer', done: false },
  ])

  const toggle = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const allDone = tasks.some(t => t.done)

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ET.accent }}>Step 04</p>
      <h3 className="text-2xl font-bold mb-4" style={{ color: ET.ink }}>Do One Tiny Thing</h3>
      <p className="text-sm mb-6" style={{ color: ET.sub }}>
        Don&apos;t try to be productive. Just move your hands. Pick ONE:
      </p>
      
      <div className="space-y-3 mb-8">
        {tasks.map(t => (
          <button 
            key={t.id}
            onClick={() => toggle(t.id)}
            className="w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all"
            style={{ 
              backgroundColor: t.done ? `${ET.accent}20` : 'transparent', 
              borderColor: t.done ? ET.accent : ET.border,
              color: t.done ? ET.ink : ET.mid
            }}
          >
            <span className="text-sm">{t.text}</span>
            {t.done && <span>✓</span>}
          </button>
        ))}
      </div>

      <button 
        disabled={!allDone}
        onClick={onNext}
        className="w-full py-4 rounded-xl font-bold disabled:opacity-50"
        style={{ backgroundColor: ET.accent, color: ET.bg }}
      >
        Hands Moved
      </button>
    </motion.div>
  )
}

const Step5 = ({ onNext }: StepProps) => {
  const [task, setTask] = useState('')
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ET.accent }}>Step 05</p>
      <h3 className="text-2xl font-bold mb-4" style={{ color: ET.ink }}>Ask the System</h3>
      <p className="text-sm mb-6" style={{ color: ET.sub }}>
        What is the fastest thing you can finish right now? <br/>
        Don&apos;t plan. Just execute.
      </p>
      
      <input 
        type="text"
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="e.g., Reply to that one email..."
        className="w-full p-4 rounded-xl mb-8 bg-black/40 outline-none focus:ring-1 ring-cyan-500"
        style={{ color: ET.ink, border: `1px solid ${ET.border}` }}
      />

      <button 
        disabled={!task}
        onClick={onNext}
        className="w-full py-4 rounded-xl font-bold disabled:opacity-50"
        style={{ backgroundColor: ET.accent, color: ET.bg }}
      >
        Execute & Return to Momentum
      </button>
    </motion.div>
  )
}

const Success = ({ onNext }: StepProps) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="mb-6 inline-flex p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
        <span className="text-3xl">🚀</span>
      </div>
      <h3 className="text-2xl font-bold mb-4" style={{ color: ET.ink }}>Momentum Restored</h3>
      
      {status === 'success' ? (
        <div className="py-4">
          <p className="text-lg font-bold text-cyan-400 mb-2">System Updated.</p>
          <p className="text-sm mb-8" style={{ color: ET.mid }}>Check your inbox for the Duck OS Starter Kit.</p>
          <button 
            onClick={onNext}
            className="w-full py-4 rounded-xl font-bold animate-pulse"
            style={{ backgroundColor: ET.accent, color: ET.bg }}
          >
            Level Up: The Recovery Protocol
          </button>
        </div>
      ) : (
        <form onSubmit={subscribe} className="text-left">
          <p className="text-sm mb-6 text-center" style={{ color: ET.mid }}>
            Protocol complete. Claim your <strong style={{ color: ET.ink }}>Duck OS Starter Kit</strong> (Free) to maintain this momentum.
          </p>
          <input 
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full p-4 rounded-xl mb-3 bg-black/40 outline-none border"
            style={{ color: ET.ink, borderColor: ET.border }}
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 rounded-xl font-bold mb-4"
            style={{ backgroundColor: ET.accent, color: ET.bg }}
          >
            {status === 'loading' ? 'Processing...' : 'Claim Starter Kit (Free)'}
          </button>
          <button 
            type="button"
            onClick={onNext}
            className="w-full text-xs opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: ET.mid }}
          >
            Skip to next step
          </button>
        </form>
      )}
    </motion.div>
  )
}

const Checkout = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center justify-between mb-6">
      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
        Founding Architect Offer
      </span>
      <span className="text-lg font-bold text-cyan-400 line-through opacity-50">499 THB</span>
    </div>
    
    <h3 className="text-2xl font-bold mb-4" style={{ color: ET.ink }}>The Recovery Protocol</h3>
    <p className="text-sm mb-6 leading-relaxed" style={{ color: ET.mid }}>
      Get the complete, deep-dive system to break burnout loops forever. Includes the 12-page PDF and Lifetime Access to the System Hub.
    </p>

    <div className="p-8 rounded-2xl bg-white border-2 border-dashed border-cyan-500/30 mb-8 text-center shadow-[0_0_40px_rgba(255,255,255,0.05)]">
      <p className="text-xs uppercase tracking-widest mb-6 font-bold" style={{ color: '#0A0F1E' }}>Scan with Banking App</p>
      <div className="w-64 h-64 mx-auto bg-white rounded-xl flex items-center justify-center mb-6 overflow-hidden p-2">
        <img src="/PayQR.webp" alt="PromptPay QR Code" className="w-full h-full object-contain" />
      </div>
      <p className="text-4xl font-bold text-[#0A0F1E] mb-1">299 THB</p>
      <p className="text-xs font-medium" style={{ color: '#6B9BB8' }}>Transfer to: Chonlaphon (PromptPay)</p>
    </div>

    <div className="space-y-4">
      <a 
        href="https://www.messenger.com/t/61583198784543" // Most reliable direct link for numeric IDs
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all hover:opacity-90"
        style={{ backgroundColor: '#0084FF', color: '#fff' }}
      >
        <span>💬</span> Send Slip to Facebook Inbox
      </a>
      <button 
        onClick={() => window.location.reload()}
        className="w-full py-4 rounded-xl font-bold border"
        style={{ borderColor: ET.border, color: ET.mid }}
      >
        Return to Home
      </button>
    </div>
    <p className="text-[10px] text-center mt-6 opacity-40 leading-relaxed" style={{ color: ET.sub }}>
      *Pre-order delivery within 72 hours via email. <br/>
      Includes Lifetime System Updates.
    </p>
  </motion.div>
)

export default function EmergencyProtocol() {
  const [step, setStep] = useState(0)

  const steps = [
    <Step0 key="0" onNext={() => setStep(1)} />,
    <Step1 key="1" onNext={() => setStep(2)} />,
    <Step2 key="2" onNext={() => setStep(3)} />,
    <Step3 key="3" onNext={() => setStep(4)} />,
    <Step4 key="4" onNext={() => setStep(5)} />,
    <Step5 key="5" onNext={() => setStep(6)} />,
    <Success key="6" onNext={() => setStep(7)} />,
    <Checkout key="7" />
  ]

  return (
    <div 
      className="max-w-xl mx-auto p-8 md:p-12 rounded-3xl border shadow-2xl overflow-hidden relative"
      style={{ backgroundColor: 'rgba(10,15,30,0.8)', borderColor: ET.border, backdropFilter: 'blur(20px)' }}
    >
      <div 
        className="absolute top-0 left-0 h-1 bg-cyan-500 transition-all duration-500"
        style={{ width: `${(step / 7) * 100}%` }}
      />
      
      <AnimatePresence mode="wait">
        {steps[step]}
      </AnimatePresence>

      {step > 0 && step < 6 && (
        <p className="text-center mt-8 text-[10px] uppercase tracking-[0.2em]" style={{ color: ET.sub }}>
          Emergency Protocol Active — {step}/5
        </p>
      )}
    </div>
  )
}
