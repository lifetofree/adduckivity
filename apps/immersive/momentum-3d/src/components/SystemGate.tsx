'use client'

import React, { useEffect, useState } from 'react'
import { useSystem } from '@/lib/system-context'
import { ShieldAlert, Droplets, Eye, Headphones, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SystemGateProps {
  children: React.ReactNode
  toolName: string
}

export default function SystemGate({ children, toolName }: SystemGateProps) {
  const { isLocked, sensory, setSensory } = useSystem()
  const [showOverlay, setShowOverlay] = useState(isLocked)

  useEffect(() => {
    if (isLocked) {
      setShowOverlay(true)
    } else {
      setShowOverlay(false)
    }
  }, [isLocked])

  const sensoryChecks = [
    { key: 'hydration', label: 'Hydration check', icon: Droplets, color: 'text-blue-400' },
    { key: 'light', label: 'Check lighting', icon: Eye, color: 'text-yellow-400' },
    { key: 'noise', label: 'Manage noise', icon: Headphones, color: 'text-purple-400' },
  ]

  if (!isLocked) return <>{children}</>

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">System Lock Active</h1>
            <p className="text-sm text-white/40 mb-12 leading-relaxed">
              Biological hardware requirements for <span className="text-white font-bold">{toolName}</span> are not met. 
              Execution is blocked until the system is stable.
            </p>

            <div className="space-y-3 mb-12">
              {sensoryChecks.map((check) => {
                const passed = sensory[check.key as keyof typeof sensory]
                return (
                  <button
                    key={check.key}
                    onClick={() => setSensory({ [check.key]: true })}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      passed 
                        ? 'bg-white/5 border-white/10 text-white/40 line-through' 
                        : 'bg-white/5 border-red-500/20 text-white hover:border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <check.icon className={`w-5 h-5 ${passed ? 'text-white/20' : check.color}`} />
                      <span className="text-xs font-bold uppercase tracking-widest">{check.label}</span>
                    </div>
                    {passed ? (
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-white/20" />
                      </div>
                    ) : (
                      <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                        Required
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
              Protect the system. Reset the body.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
