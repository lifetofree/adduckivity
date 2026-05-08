'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSystem } from '@/lib/system-context'
import { Droplets, Eye, Headphones, X, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react'

interface ControlCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function ControlCenter({ isOpen, onClose }: ControlCenterProps) {
  const { energy, sensory, setEnergy, setSensory, isLocked, isProtected } = useSystem()
  const [showEnergyFeedback, setShowEnergyFeedback] = useState(false)
  const [lastEnergy, setLastEnergy] = useState(energy)
  const [sensoryFeedback, setSensoryFeedback] = useState<{ key: string; enabled: boolean } | null>(null)

  // Show feedback when energy changes
  // Note: setState in this effect is intentional for feedback animation
  useEffect(() => {
    if (isOpen && energy !== lastEnergy) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setShowEnergyFeedback(true)
      setLastEnergy(energy)
      /* eslint-enable react-hooks/set-state-in-effect */
      const timer = setTimeout(() => setShowEnergyFeedback(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [energy, lastEnergy, isOpen])

  // Show feedback when sensory changes
  useEffect(() => {
    if (isOpen && sensoryFeedback) {
      const timer = setTimeout(() => setSensoryFeedback(null), 1500)
      return () => clearTimeout(timer)
    }
  }, [sensoryFeedback, isOpen])

  const handleSensoryToggle = (key: string) => {
    if (energy <= 2) {
      setSensoryFeedback({ key, enabled: false })
      return
    }
    const newValue = !sensory[key as keyof typeof sensory]
    setSensory({ [key]: newValue })
    setSensoryFeedback({ key, enabled: newValue })
  }

  // Static Tailwind class strings so the production purge keeps them (#52).
  const getEnergyLabel = (level: number) => {
    if (level <= 2) return { text: 'Critical Low', color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500/20' }
    if (level <= 4) return { text: 'Low Energy', color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/20' }
    if (level <= 6) return { text: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/20' }
    if (level <= 8) return { text: 'Good', color: 'text-cyan-500', bg: 'bg-cyan-500/20', border: 'border-cyan-500/20' }
    return { text: 'Peak Performance', color: 'text-emerald-500', bg: 'bg-emerald-500/20', border: 'border-emerald-500/20' }
  }

  const energyInfo = getEnergyLabel(energy)

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
                      <p className="text-[10px] text-red-500/60 mt-0.5 leading-relaxed">
                        {energy <= 2 
                          ? 'Critical energy exhaustion detected. System shutdown enforced to prevent burnout.' 
                          : 'Biological requirements not met. Access to execution tools restricted.'}
                      </p>
                    </div>
                  </div>
                )}
                {isProtected && energy > 2 && (
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
                <span className={`text-lg font-mono font-bold ${energyInfo.color}`}>
                  {energy.toString().padStart(2, '0')}/10
                </span>
              </div>
              
              <AnimatePresence>
                {showEnergyFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-4 px-4 py-2 rounded-xl ${energyInfo.bg} border ${energyInfo.border}`}
                  >
                    <p className={`text-xs font-bold ${energyInfo.color} uppercase tracking-wider`}>
                      {energyInfo.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
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
                <span>Peak</span>
              </div>
            </div>

            {/* Sensory Sync */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] block mb-6">Sensory Sync</span>
              {sensoryItems.map((item) => {
                const isCheckPassed = sensory[item.key as keyof typeof sensory]
                const isItemLocked = energy <= 2
                const showFeedback = sensoryFeedback?.key === item.key
                
                return (
                  <div key={item.key} className="relative">
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`absolute -right-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          isItemLocked ? 'bg-red-500 text-white' : 
                          sensoryFeedback.enabled ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {isItemLocked ? 'Sync Offline' : sensoryFeedback.enabled ? '✓ Active' : '○ Inactive'}
                      </motion.div>
                    )}
                    <motion.button
                      whileTap={isItemLocked ? { x: [-4, 4, -4, 4, 0], transition: { duration: 0.4 } } : { scale: 0.98 }}
                      onClick={() => handleSensoryToggle(item.key)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        isItemLocked
                          ? 'bg-red-500/5 border-red-500/10 text-white/20 cursor-not-allowed'
                          : isCheckPassed 
                            ? 'bg-white/5 border-white/10 text-white' 
                            : 'bg-black/20 border-white/5 text-white/30 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                          isItemLocked ? 'bg-red-500/5 text-red-500/40' :
                          isCheckPassed ? 'bg-white/5 ' + item.color : 'bg-white/5'
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold tracking-tight">{item.label}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isItemLocked ? 'border border-red-500/20 text-red-500/40' :
                        isCheckPassed ? 'bg-cyan-500 text-black' : 'border border-white/10'
                      }`}>
                        {isCheckPassed && !isItemLocked && <CheckCircle2 className="w-4 h-4" />}
                        {isItemLocked && <X className="w-3 h-3" />}
                      </div>
                    </motion.button>
                  </div>
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
