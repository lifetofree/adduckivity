'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Cpu, ChevronRight } from 'lucide-react'
import { useSystem } from '@/lib/system-context'
import ControlCenter from './ControlCenter'

export default function SystemBar() {
  const pathname = usePathname()
  const { energy, isLocked, isProtected, isSyncing, systemBarNode } = useSystem()
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false)

  // Derive system title from pathname
  const getSystemTitle = () => {
    if (pathname.startsWith('/atomizer')) return 'Atomizer'
    if (pathname.startsWith('/protocol-builder')) return 'Architect'
    if (pathname.startsWith('/momentum')) return 'Momentum'
    if (pathname.startsWith('/ignition')) return 'Ignition'
    if (pathname.startsWith('/blog')) return 'Archive'
    if (pathname.startsWith('/os')) return 'Launchpad'
    return 'Core'
  }

  const title = getSystemTitle()

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 border-b border-white/5 bg-black/20 backdrop-blur-md z-[100] flex items-center justify-between px-6">
        {/* Left: System Identity */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-6 h-6 overflow-hidden rounded-md border border-white/10 group-hover:border-cyan-500/50 transition-colors">
              <Image src="/logo.png" alt="Duck OS" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span>System</span>
              <ChevronRight className="w-3 h-3 mx-1" />
              <span className="text-white/80">{title}</span>
            </div>
          </Link>
        </div>

        {/* Center: Dynamic Node Slot (e.g. Mode Switcher) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          {systemBarNode}
        </div>

        {/* Right: Status Indicators */}
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-2">
            {isSyncing ? (
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  isLocked ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                  isProtected ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                  'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                }`} />
                <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${
                  isLocked ? 'text-red-500' : isProtected ? 'text-amber-500' : 'text-cyan-500'
                }`}>Syncing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isLocked ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                  isProtected ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                  'bg-white/20'
                }`} />
                <span className={`text-[9px] font-mono uppercase tracking-widest ${
                  isLocked ? 'text-red-500 font-bold' : isProtected ? 'text-amber-500 font-bold' : 'text-white/20'
                }`}>
                  {isLocked ? 'System Locked' : isProtected ? 'Protected Mode' : 'System Stable'}
                </span>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-white/10" />

          <button 
            onClick={() => setIsControlCenterOpen(true)}
            className="flex items-center gap-3 group"
          >
              <div className="flex flex-col items-end">
                  <span className={`text-[8px] font-mono uppercase tracking-tighter transition-colors ${
                    isLocked ? 'text-red-500' : isProtected ? 'text-amber-500' : 'text-white/30 group-hover:text-white/50'
                  }`}>Energy Level</span>
                  <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => {
                        const level = Math.ceil(energy / 2)
                        const isCritical = energy <= 2
                        return (
                          <div key={i} className={`w-2 h-1 rounded-full transition-all ${
                            i <= level 
                              ? (isCritical 
                                ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                                : isProtected 
                                  ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                                  : 'bg-cyan-500/50 group-hover:bg-cyan-500') 
                              : 'bg-white/10'
                          }`} />
                        )
                      })}
                  </div>
              </div>
              <Cpu className={`w-4 h-4 transition-colors ${
                isLocked ? 'text-red-500' : isProtected ? 'text-amber-500' : 'text-white/20 group-hover:text-white/50'
              }`} />
          </button>
        </div>
      </div>

      <ControlCenter 
        isOpen={isControlCenterOpen} 
        onClose={() => setIsControlCenterOpen(false)} 
      />
    </>
  )
}
