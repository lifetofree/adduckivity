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
  setEnergy: (energy: number) => void
  setSensory: (sensory: Partial<SensoryState>) => void
}

const SystemContext = createContext<SystemContextType | undefined>(undefined)

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [energy, setEnergyState] = useState(5)
  const [sensory, setSensoryState] = useState<SensoryState>({
    water: false,
    light: false,
    noise: false,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('st8')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (typeof parsed.energy === 'number') setEnergyState(parsed.energy)
        if (parsed.sensory) setSensoryState(parsed.sensory)
      } catch (e) {
        console.error('Failed to parse system state', e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('st8', JSON.stringify({ 
        energy, 
        sensory,
        lastCheck: new Date().toISOString()
      }))
    }
  }, [energy, sensory, isLoaded])

  const isLocked = useMemo(() => !sensory.water || !sensory.light || !sensory.noise, [sensory])
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
        setEnergy, 
        setSensory 
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
