'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useIgnitionStore } from '@/lib/ignition-store'
import { IgnitionOverlay } from '@/components/ProtocolBuilder/IgnitionOverlay'
import SystemBar from '@/components/ProtocolBuilder/SystemBar'
import SystemFooter from '@/components/ProtocolBuilder/SystemFooter'
import Link from 'next/link'
import { Flame, ArrowRight } from 'lucide-react'

export default function IgnitionPage() {
  const router = useRouter()
  const { isActive, durationRemaining, currentPhase, start } = useIgnitionStore()
  const [mounted, setMounted] = useState(false)
  const [wasStarted, setWasStarted] = useState(false)
  const wasStartedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Track if ignition was ever started
  useEffect(() => {
    if (isActive || durationRemaining > 0) {
      setWasStarted(true)
      wasStartedRef.current = true
    }
  }, [isActive, durationRemaining])

  // Auto-return to landing when ignition completes (only if it was started)
  useEffect(() => {
    if (!mounted) return
    if (!wasStartedRef.current) return // Don't auto-return if never started
    if (isActive) return // Still running
    
    // Ignition finished and was started - auto-return after 2s
    const timer = setTimeout(() => {
      router.push('/')
    }, 2000)
    return () => clearTimeout(timer)
  }, [mounted, isActive, router])

  const handleStartIgnition = () => {
    start(null) // Start without specific target node
  }

  if (!mounted) return null

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0f1e]">
      <SystemBar title="Ignite Momentum" />
      
      {/* Full screen background with flame visual */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Background glow */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isActive ? 'opacity-100' : 'opacity-30'
          }`}
          style={{
            background: isActive 
              ? `radial-gradient(circle at center, ${
                  currentPhase === 'spark' ? 'rgba(244,63,94,0.3)' :
                  currentPhase === 'target' ? 'rgba(0,229,255,0.3)' :
                  currentPhase === 'launch' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'
                } 0%, transparent 70%)` 
              : 'radial-gradient(circle at center, rgba(244,63,94,0.15) 0%, transparent 70%)'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
          {!isActive && !wasStarted && (
            <>
              {/* Icon */}
              <div className="mb-8">
                <Flame className="w-24 h-24 text-rose-500 animate-pulse" />
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6">
                Momentum Ignition
              </h1>
              
              {/* Description */}
              <p className="text-lg text-white/60 mb-4 leading-relaxed">
                600-second power-up sequence to break inertia and launch into flow state.
              </p>
              
              <div className="flex flex-col gap-3 text-sm text-white/40 mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>120s - Physical Activation (The Spark)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>180s - Mental Alignment (The Target)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>300s - Deep Work Ignition (The Launch)</span>
                </div>
              </div>
              
              {/* Start Button */}
              <button
                onClick={handleStartIgnition}
                className="group flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold uppercase tracking-widest rounded-xl hover:from-rose-400 hover:to-orange-400 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(244,63,94,0.4)]"
              >
                <Flame className="w-6 h-6" />
                <span>Ignite Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Guide + Back links */}
              <div className="mt-12 flex items-center gap-6">
                <Link
                  href="/ignition/guide"
                  className="text-white/30 hover:text-white/60 transition-colors text-sm font-mono uppercase tracking-wider"
                >
                  How it works?
                </Link>
                <span className="text-white/15">·</span>
                <Link
                  href="/"
                  className="text-white/30 hover:text-white/60 transition-colors text-sm font-mono uppercase tracking-wider"
                >
                  ← Back to Duck OS
                </Link>
              </div>
            </>
          )}

          {/* Show start button again if was started but now complete (can restart) */}
          {wasStarted && !isActive && (
            <>
              {/* Completion message */}
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Flame className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-emerald-400 uppercase tracking-tight mb-2">
                  Protocol Complete
                </h2>
                <p className="text-white/50">Ignition sequence finished successfully.</p>
              </div>
              
              {/* Restart Button */}
              <button
                onClick={handleStartIgnition}
                className="group flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold uppercase tracking-widest rounded-xl hover:from-rose-400 hover:to-orange-400 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(244,63,94,0.4)]"
              >
                <Flame className="w-6 h-6" />
                <span>Run Again</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Back link */}
              <Link 
                href="/"
                className="mt-12 text-white/30 hover:text-white/60 transition-colors text-sm font-mono uppercase tracking-wider"
              >
                ← Back to Duck OS
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Ignition Overlay */}
      <IgnitionOverlay />
      
      {/* System Footer */}
      <div className="absolute bottom-0 left-0 right-0">
        <SystemFooter />
      </div>
    </main>
  )
}
