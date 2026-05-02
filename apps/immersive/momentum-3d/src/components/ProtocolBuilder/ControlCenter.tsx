'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSystem } from '@/lib/system-context'
import { Droplets, Eye, Headphones, X, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react'

interface ControlCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function ControlCenter({ isOpen, onClose }: ControlCenterProps) {
  const { energy, sensory, setEnergy, setSensory, isLocked, isProtected } = useSystem()

  const sensoryItems = [
    { key: 'water', label: 'Hydration Status', icon: Droplets, color: 'text-blue-400' },
    { key: 'light', label: 'Lumen Levels', icon: Eye, color: 'text-yellow-400' },
    { key: 'noise', label: 'Acoustic Shield', icon: Headphones, color: 'text-purple-400' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xs bg-zinc-950 border-l border-white/5 z-[120] p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Diagnostic</span>
                <h2 className="text-xl font-bold text-white mt-1">System Control</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Alerts */}
            {(isLocked || isProtected) && (
              <div className="mb-10 space-y-3">
                {isLocked && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">System Lock Active</p>
                      <p className="text-[10px] text-red-500/60 mt-0.5 leading-relaxed">Biological requirements not met. Access to execution tools restricted.</p>
                    </div>
                  </div>
                )}
                {isProtected && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Protected Mode</p>
                      <p className="text-[10px] text-amber-500/60 mt-0.5 leading-relaxed">Low energy detected. Filtering high-complexity tasks to prevent burnout.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Energy Score */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Energy Level</span>
                <span className={`text-lg font-mono font-bold ${isProtected ? 'text-amber-500' : 'text-cyan-500'}`}>
                  {energy.toString().padStart(2, '0')}/10
                </span>
              </div>
              
              <div className="relative h-12 flex items-end">
                <div className="absolute inset-x-0 top-0 flex justify-between px-1">
                   {[...Array(10)].map((_, i) => (
                     <div key={i} className={`w-0.5 h-2 ${i < 3 ? 'bg-red-500/20' : 'bg-white/10'}`} />
                   ))}
                </div>
                <input 
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-between mt-3 px-1 text-[8px] font-mono text-white/20 uppercase tracking-widest">
                <span>Critical</span>
                <span>Performance</span>
              </div>
            </div>

            {/* Sensory Sync */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] block mb-6">Sensory Sync</span>
              {sensoryItems.map((item) => {
                const isCheckPassed = sensory[item.key as keyof typeof sensory]
                return (
                  <button
                    key={item.key}
                    onClick={() => setSensory({ [item.key]: !isCheckPassed })}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isCheckPassed 
                        ? 'bg-white/5 border-white/10 text-white' 
                        : 'bg-black/20 border-white/5 text-white/30 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                        isCheckPassed ? 'bg-white/5 ' + item.color : 'bg-white/5'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold tracking-tight">{item.label}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isCheckPassed ? 'bg-cyan-500 text-black' : 'border border-white/10'
                    }`}>
                      {isCheckPassed && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-16 p-6 rounded-3xl bg-white/5 border border-white/5 text-center">
               <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest leading-relaxed">
                 &quot;Protecting the hardware ensures the software can execute.&quot;
               </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
