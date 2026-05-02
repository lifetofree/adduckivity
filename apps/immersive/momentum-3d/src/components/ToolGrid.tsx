'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSystem } from '@/lib/system-context'
import { Lock, ShieldAlert } from 'lucide-react'
import { ET } from '@/lib/theme'

interface Tool {
  title: string
  description: string
  image: string
  href: string
  badge: string
  accentColor: string
  accentBg: string
  accentBorder: string
  complexity: 'low' | 'high'
}

interface ToolGridProps {
  tools: Tool[]
}

export default function ToolGrid({ tools }: ToolGridProps) {
  const { isLocked, isProtected } = useSystem()

  // In Protected Mode (energy <= 3), we prioritize low-complexity tools
  const visibleTools = isProtected 
    ? tools.filter(t => t.complexity === 'low' || t.title === 'Emergency Recovery')
    : tools

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {visibleTools.map((f, i) => {
        const isToolLocked = isLocked && (f.title === 'Protocol Builder' || f.title === 'The Atomizer')
        
        return (
          <div key={i} className="relative group">
            <Link 
              href={isToolLocked ? '#' : f.href} 
              className={`block h-full transition-all duration-300 ${isToolLocked ? 'cursor-not-allowed opacity-50 grayscale' : 'group-hover:-translate-y-1'}`}
              onClick={(e) => {
                if (isToolLocked) {
                  e.preventDefault()
                  // In a real app, we'd trigger the ControlCenter dropdown here
                }
              }}
            >
              <article
                className={`rounded-2xl border overflow-hidden transition-all duration-300 h-full flex flex-col ${isToolLocked ? '' : 'group-hover:shadow-2xl'}`}
                style={{ backgroundColor: ET.surface, borderColor: isToolLocked ? 'rgba(239,68,68,0.2)' : ET.border }}
              >
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: ET.muted }}>
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm border"
                      style={{ backgroundColor: f.accentBg, color: f.accentColor, borderColor: f.accentBorder }}
                    >
                      {f.badge}
                    </span>
                    {isToolLocked && (
                      <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-lg">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-base mb-2" style={{ color: ET.ink }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: ET.sub }}>{f.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: isToolLocked ? '#ef4444' : f.accentColor }}>
                      {isToolLocked ? 'Diagnostic required' : 'Open tool'}
                    </span>
                    {!isToolLocked && (
                      <span
                        className="opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1"
                        style={{ color: f.accentColor }}
                        aria-hidden
                      >→</span>
                    )}
                  </div>
                </div>
                {!isToolLocked && (
                  <div
                    className="h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: f.accentColor }}
                  />
                )}
              </article>
            </Link>

            {/* Lock Overlay Tooltip (Optional) */}
            {isToolLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none z-10">
                <ShieldAlert className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
                <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold bg-black/80 px-4 py-2 rounded-full border border-red-500/30 backdrop-blur-xl">
                  Sensory Check Failed
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
