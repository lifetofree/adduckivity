'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSystem } from '@/lib/system-context'
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react'
import { ET } from '@/lib/theme'

export default function LaunchpadOverlay() {
  const { energy, sensory, isLocked, isProtected } = useSystem()

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-center p-8">
      {/* Top Status Bar — Moved down to clear the global SystemBar */}
      <div className="absolute top-20 left-8 right-8 flex justify-between items-start pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isLocked ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'} shadow-[0_0_10px_rgba(6,182,212,0.5)]`} />
            <h1 className="text-2xl font-black tracking-tighter uppercase italic" style={{ color: ET.ink }}>
              Duck OS Launchpad
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">System Status</span>
              <span className={`text-[10px] font-mono font-bold uppercase ${isLocked ? 'text-red-400' : 'text-cyan-400'}`}>
                {isLocked ? 'Containment Active' : 'Stable / Online'}
              </span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Energy Level</span>
              <div className="flex items-center gap-1">
                <Zap className={`w-3 h-3 ${isProtected ? 'text-yellow-500' : 'text-cyan-400'}`} />
                <span className="text-[10px] font-mono font-bold text-white">{energy}/10</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-end gap-2"
        >
          <div className="px-4 py-2 rounded-xl border bg-black/40 backdrop-blur-md flex items-center gap-3" style={{ borderColor: ET.border }}>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Biological Integrity</span>
            <div className="flex gap-1.5">
              {Object.entries(sensory).map(([key, value]) => (
                <div 
                  key={key} 
                  className={`w-2 h-2 rounded-sm ${value ? 'bg-cyan-500' : 'bg-red-500/40'}`}
                  title={key}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Center Alerts */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-24 h-24 rounded-full border-2 border-red-500/20 flex items-center justify-center relative">
              <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
              <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-ping opacity-20" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Biological Lock Detected</h2>
              <p className="text-xs text-white/40 max-w-xs leading-relaxed uppercase tracking-widest">
                Protocol execution requires high-stability biological state. 
                Locate and stabilize red vertices in the web.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Context Info */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-8 py-4 rounded-2xl border bg-black/60 backdrop-blur-xl flex items-center gap-6"
          style={{ borderColor: isLocked ? 'rgba(239,68,68,0.2)' : 'rgba(0,229,255,0.2)' }}
        >
          {!isLocked ? (
            <>
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Systems Clear</span>
                <p className="text-xs text-white font-medium">Select a core protocol node to initiate flight.</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Ritual Pending</span>
               <div className="flex items-center gap-2">
                 <div className="h-1 w-24 bg-red-500/20 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-red-500 transition-all duration-500" 
                    style={{ width: `${(Object.values(sensory).filter(v => v).length / 3) * 100}%` }}
                   />
                 </div>
                 <span className="text-[10px] font-mono text-white/40 italic">Initialising...</span>
               </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
