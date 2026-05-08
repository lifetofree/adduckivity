'use client'

import React from 'react'
import { useSystem } from '@/lib/system-context'
import { ShieldAlert, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface SystemGateProps {
  children: React.ReactNode
  toolName: string
}

export default function SystemGate({ children, toolName }: SystemGateProps) {
  const { isLocked, isLoaded, energy } = useSystem()

  // Don't render the lock screen until state is hydrated (#11)
  if (!isLoaded) return <>{children}</>

  if (!isLocked) return <>{children}</>

  const isEnergyLock = energy <= 2

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 tracking-tight uppercase italic">System Lock Active</h1>
        <p className="text-sm text-white/40 mb-12 leading-relaxed uppercase tracking-widest">
          {isEnergyLock 
            ? 'Critical energy exhaustion detected. System shutdown enforced to prevent burnout.'
            : `Biological hardware requirements for ${toolName} are not met. Stabilization required.`
          }
        </p>

        <Link
          href="/os"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-500 text-white font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        >
          Enter Immersive Launchpad
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-12 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
          Protect the system. Reset the body.
        </p>
      </motion.div>
    </div>
  )
}
