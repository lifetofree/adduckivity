'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Terminal, ShieldCheck, Activity } from 'lucide-react'

export default function SystemFooter() {
  return (
    <footer className="z-10 py-8 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: System Spec */}
        <div className="flex flex-col items-center md:items-start gap-2 opacity-30 group hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-cyan-500" />
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white">Kernel Version: 1.0.4-STABLE</span>
          </div>
          <p className="text-[8px] font-mono uppercase tracking-widest text-white/60">Duck OS // Momentum Protocol // Active</p>
        </div>

        {/* Center: Identity */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-5 grayscale opacity-50 contrast-125 group-hover:grayscale-0 transition-all duration-700">
                <Image src="/logo.png" alt="Adduckivity Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-xs uppercase tracking-[0.4em] text-white/60">Adduckivity</span>
          </div>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.1em] font-medium text-center">
            Life Architecture for <span className="text-cyan-500/50">Neurodivergent Creators</span>
          </p>
        </div>

        {/* Right: Security/Status */}
        <div className="flex items-center gap-6 opacity-30 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-white/80">ENCRYPTION: ACTIVE</span>
                <ShieldCheck className="w-3 h-3 text-green-500/50" />
            </div>
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-white/40 uppercase">
                <span>Latency: 14ms</span>
                <Activity className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-white/20">
        <p className="text-[8px] font-mono uppercase tracking-widest">© 2026 Adduckivity // Distributed under Momentum License</p>
        <div className="flex items-center gap-6 text-[8px] font-mono uppercase tracking-widest">
            <a href="#" className="hover:text-cyan-500/50 transition-colors">Manifesto</a>
            <a href="#" className="hover:text-cyan-500/50 transition-colors">System Archive</a>
            <a href="#" className="hover:text-cyan-500/50 transition-colors">Security protocol</a>
        </div>
      </div>
    </footer>
  )
}
