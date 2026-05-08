'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

interface SensoryState {
  water: boolean
  light: boolean
  noise: boolean
}

interface SystemContextType {
  energy: number
  sensory: SensoryState
  isLocked: boolean
  isProtected: boolean
  isLoaded: boolean
  isSyncing: boolean
  isFooterVisible: boolean
  systemBarNode: React.ReactNode | null
  footerNode: React.ReactNode | null
  // Gradient lock model: sensory required based on energy level
  sensoryRequired: number  // 1, 2, or 3 based on energy
  lockProximity: number    // 0-1, how close to lock (1 = safe)
  setEnergy: (energy: number) => void
  setSensory: (sensory: Partial<SensoryState>) => void
  setSyncing: (isSyncing: boolean) => void
  setFooterVisible: (isVisible: boolean) => void
  setSystemBarNode: (node: React.ReactNode | null) => void
  setFooterNode: (node: React.ReactNode | null) => void
}

const STORAGE_KEY = 'duckos:system:state'
/** Legacy key kept temporarily for one-time migration. */
const LEGACY_STORAGE_KEY = 'st8'

const SystemContext = createContext<SystemContextType | undefined>(undefined)

export function SystemProvider({ children }: { children: React.ReactNode }) {
  // Default to "unlocked" so first-time visitors are not blocked from tools (#11).
  // Users can opt into the lock by toggling sensory checks off in the Control Center.
  const [energy, setEnergyState] = useState(5)
  const [sensory, setSensoryState] = useState<SensoryState>({
    water: true,
    light: true,
    noise: true,
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSyncing, setSyncing] = useState(false)
  const [isFooterVisible, setFooterVisible] = useState(true)
  const [systemBarNode, setSystemBarNode] = useState<React.ReactNode | null>(null)
  const [footerNode, setFooterNode] = useState<React.ReactNode | null>(null)

  useEffect(() => {
    try {
      let saved = localStorage.getItem(STORAGE_KEY)
      // One-time migration from legacy key.
      if (!saved) {
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
        if (legacy) {
          saved = legacy
          localStorage.setItem(STORAGE_KEY, legacy)
          localStorage.removeItem(LEGACY_STORAGE_KEY)
        }
      }
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.energy === 'number') setEnergyState(parsed.energy)
        if (parsed.sensory) setSensoryState(parsed.sensory)
      }
    } catch (e) {
      console.error('Failed to parse system state', e)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ energy, sensory }))
      } catch (e) {
        console.error('Failed to persist system state', e)
      }
    }
  }, [energy, sensory, isLoaded])

  // Biological Crash Recovery: If energy hits critical (<= 2), reset all sensory checks.
  // This forces a manual stabilization ritual once the user recovers.
  useEffect(() => {
    if (isLoaded && energy <= 2) {
      const allSensoryMissing = !sensory.water && !sensory.light && !sensory.noise
      if (!allSensoryMissing) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSensoryState({ water: false, light: false, noise: false })
      }
    }
  }, [energy, isLoaded, sensory.water, sensory.light, sensory.noise])

  // System Lock: Gradient model based on Duck OS philosophy
  // Higher energy = lenient (only 1 sensory required)
  // Lower energy = strict (need all 3 sensory checks)
  // Critical energy (<=2) = hard lock regardless
  const sensoryRequired = useMemo(() => {
    if (energy >= 7) return 1  // High energy: lenient
    if (energy >= 4) return 2  // Medium energy: moderate
    return 3                     // Low energy: strict
  }, [energy])

  const lockProximity = useMemo(() => {
    if (energy <= 3) {
      // In danger zone: show how close to full lock
      const sensoryCount = [sensory.water, sensory.light, sensory.noise].filter(Boolean).length
      return sensoryCount / 3  // 1 = safe (all met), 0 = about to lock
    }
    return 1  // Safe zone
  }, [sensory, energy])

  const isLocked = useMemo(() => {
    // Critical energy always locks (fail-safe)
    if (energy <= 2) return true
    // Otherwise, check if enough sensory checks are met
    const sensoryCount = [sensory.water, sensory.light, sensory.noise].filter(Boolean).length
    return sensoryCount < sensoryRequired
  }, [sensory, energy, sensoryRequired])

  const isProtected = useMemo(() => energy <= 3, [energy])

  const setEnergy = (newEnergy: number) => {
    setEnergyState(newEnergy)
  }

  const setSensory = (newSensory: Partial<SensoryState>) => {
    setSensoryState(prev => ({ ...prev, ...newSensory }))
  }

  return (
    <SystemContext.Provider
      value={{
        energy,
        sensory,
        isLocked,
        isProtected,
        isLoaded,
        isSyncing,
        isFooterVisible,
        systemBarNode,
        footerNode,
        sensoryRequired,
        lockProximity,
        setEnergy,
        setSensory,
        setSyncing,
        setFooterVisible,
        setSystemBarNode,
        setFooterNode
      }}
    >
      {children}
    </SystemContext.Provider>
  )
}

export function useSystem() {
  const context = useContext(SystemContext)
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider')
  }
  return context
}
