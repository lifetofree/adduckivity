'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Cpu, ChevronRight } from 'lucide-react'

interface SystemBarProps {
  title: string
  mode?: 'build' | 'flow'
  setMode?: (mode: 'build' | 'flow') => void
  isSyncing?: boolean
  showModeSwitcher?: boolean
}

export default function SystemBar({ 
  title, 
  mode, 
  setMode, 
  isSyncing = false,
  showModeSwitcher = false 
}: SystemBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 border-b border-white/5 bg-black/20 backdrop-blur-md z-[100] flex items-center justify-between px-6">
      {/* Left: System Identity */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-6 h-6 overflow-hidden rounded-md border border-white/10 group-hover:border-cyan-500/50 transition-colors text-white">
            <Image src="/logo.png" alt="Duck OS" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>System</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-white/80">{title}</span>
          </div>
        </Link>
      </div>

      {/* Center: Mode Switcher (Optional) */}
      {showModeSwitcher && setMode && mode && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-black/40 border border-white/5 rounded-full p-1 gap-1">
          <button
            onClick={() => setMode('build')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              mode === 'build' 
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Architect
          </button>
          <button
            onClick={() => setMode('flow')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              mode === 'flow' 
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Pilot
          </button>
        </div>
      )}

      {/* Right: Status Indicators */}
      <div className="flex items-center gap-6 text-white">
        <div className="flex items-center gap-2">
          {isSyncing ? (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[9px] font-mono uppercase text-cyan-500 tracking-widest font-bold">Syncing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[9px] font-mono uppercase text-white/20 tracking-widest">System Stable</span>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">Energy Level</span>
                <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`w-2 h-1 rounded-full ${i <= 4 ? 'bg-cyan-500/50' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>
            <Cpu className="w-4 h-4 text-white/20" />
        </div>
      </div>
    </div>
  )
}
