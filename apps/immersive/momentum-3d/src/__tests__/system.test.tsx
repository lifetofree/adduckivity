import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SystemProvider, useSystem } from '../lib/system-context'
import React from 'react'

const STORAGE_KEY = 'duckos:system:state'
const LEGACY_STORAGE_KEY = 'st8'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SystemProvider>{children}</SystemProvider>
)

describe('SystemContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  // Regression test for ISSUESTOFIX #11 — first-time visitors must NOT be
  // locked out of the tools.
  it('defaults to unlocked for new users (#11)', () => {
    const { result } = renderHook(() => useSystem(), { wrapper })

    expect(result.current.energy).toBe(5)
    expect(result.current.sensory).toEqual({
      water: true,
      light: true,
      noise: true,
    })
    expect(result.current.isLocked).toBe(false)
    expect(result.current.isProtected).toBe(false)
  })

  it('updates energy and computes isProtected', () => {
    const { result } = renderHook(() => useSystem(), { wrapper })

    act(() => { result.current.setEnergy(2) })
    expect(result.current.energy).toBe(2)
    expect(result.current.isProtected).toBe(true)

    act(() => { result.current.setEnergy(5) })
    expect(result.current.isProtected).toBe(false)
  })

  it('isLocked when sensory below required threshold (gradient model)', () => {
    const { result } = renderHook(() => useSystem(), { wrapper })

    // Default energy=5, sensoryRequired=2. With water=false, still have 2/3 (light, noise)
    // so isLocked should be false
    act(() => { result.current.setSensory({ water: false }) })
    expect(result.current.isLocked).toBe(false)
    expect(result.current.sensoryRequired).toBe(2)

    // Now turn off light too (only 1/3 sensory) - should lock
    act(() => { result.current.setSensory({ light: false }) })
    expect(result.current.isLocked).toBe(true)

    // Restore and verify gradient: at energy=8 (sensoryRequired=1), only 1 needed
    act(() => { result.current.setEnergy(8) })
    act(() => { result.current.setSensory({ water: false, light: true, noise: true }) })
    expect(result.current.isLocked).toBe(false) // 1/3 is enough at high energy
    expect(result.current.sensoryRequired).toBe(1)
  })

  it('critical energy (<=2) always locks regardless of sensory', () => {
    const { result } = renderHook(() => useSystem(), { wrapper })

    // Set energy to critical
    act(() => { result.current.setEnergy(2) })
    // Even with all sensory on, should be locked
    expect(result.current.isLocked).toBe(true)
    expect(result.current.sensoryRequired).toBe(3)
  })

  it('lockProximity reflects how close to lock in danger zone', () => {
    const { result } = renderHook(() => useSystem(), { wrapper })

    // Lower energy to danger zone (<=3) to test lockProximity
    act(() => { result.current.setEnergy(3) })

    // All 3 sensory on = 1.0 (safe)
    expect(result.current.lockProximity).toBe(1)

    // Turn off water (2/3) = 0.67
    act(() => { result.current.setSensory({ water: false }) })
    expect(result.current.lockProximity).toBeCloseTo(0.67, 2)

    // Turn off light (1/3) = 0.33
    act(() => { result.current.setSensory({ light: false }) })
    expect(result.current.lockProximity).toBeCloseTo(0.33, 2)

    // At high energy (>3), lockProximity = 1 (safe zone)
    act(() => { result.current.setEnergy(8) })
    expect(result.current.lockProximity).toBe(1)
  })

  it('persists state under the new storage key (#21)', async () => {
    const { result } = renderHook(() => useSystem(), { wrapper })

    act(() => {
      result.current.setEnergy(8)
      result.current.setSensory({ water: true })
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    expect(stored.energy).toBe(8)
    expect(stored.sensory.water).toBe(true)
  })

  it('migrates from legacy "st8" storage key (#21)', () => {
    const legacyState = { energy: 9, sensory: { water: true, light: true, noise: true } }
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(legacyState))

    const { result } = renderHook(() => useSystem(), { wrapper })

    expect(result.current.energy).toBe(9)
    expect(result.current.sensory.water).toBe(true)
    // Legacy key should have been removed.
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull()
    // Data should now live under the canonical key.
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('exposes isLoaded for hydration gating (#11)', () => {
    const { result } = renderHook(() => useSystem(), { wrapper })
    // After first render the effect has run synchronously in the test environment.
    expect(result.current.isLoaded).toBe(true)
  })
})
