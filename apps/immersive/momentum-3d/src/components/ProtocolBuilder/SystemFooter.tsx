'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function SystemFooter() {
  return (
    <footer className="z-10 h-14 border-t border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6">
      {/* Left: kernel tag */}
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
        Duck OS // v1.0.4-STABLE
      </span>

      {/* Center: brand */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative w-5 h-5 overflow-hidden rounded-md border border-white/10 group-hover:border-cyan-500/50 transition-colors">
          <Image src="/logo.png" alt="Duck OS" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/70 transition-colors">
          <span>Adduckivity</span>
          <ChevronRight className="w-3 h-3 mx-1 opacity-50" />
          <span className="text-white/50">Momentum Protocol</span>
        </div>
      </Link>

      {/* Right: copyright */}
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
        © 2026 Adduckivity
      </span>
    </footer>
  )
}
