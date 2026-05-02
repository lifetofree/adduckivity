import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SystemProvider, useSystem } from '../lib/system-context'
import React from 'react'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('SystemContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('initializes with default values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SystemProvider>{children}</SystemProvider>
    )
    const { result } = renderHook(() => useSystem(), { wrapper })

    expect(result.current.energy).toBe(5)
    expect(result.current.sensory).toEqual({
      water: false,
      light: false,
      noise: false,
    })
    expect(result.current.isLocked).toBe(true) // Default sensory is false, so it should be locked
    expect(result.current.isProtected).toBe(false) // Energy 5 is not <= 3
  })

  it('updates energy and computes isProtected', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SystemProvider>{children}</SystemProvider>
    )
    const { result } = renderHook(() => useSystem(), { wrapper })

    act(() => {
      result.current.setEnergy(2)
    })

    expect(result.current.energy).toBe(2)
    expect(result.current.isProtected).toBe(true)
  })

  it('updates sensory and computes isLocked', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SystemProvider>{children}</SystemProvider>
    )
    const { result } = renderHook(() => useSystem(), { wrapper })

    act(() => {
      result.current.setSensory({ water: true, light: true, noise: true })
    })

    expect(result.current.sensory).toEqual({
      water: true,
      light: true,
      noise: true,
    })
    expect(result.current.isLocked).toBe(false)
  })

  it('persists state to localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SystemProvider>{children}</SystemProvider>
    )
    const { result } = renderHook(() => useSystem(), { wrapper })

    act(() => {
      result.current.setEnergy(8)
      result.current.setSensory({ water: true })
    })

    const stored = JSON.parse(localStorage.getItem('duck_os_system_v1') || '{}')
    expect(stored.energy).toBe(8)
    expect(stored.sensory.water).toBe(true)
  })

  it('loads state from localStorage on initialization', () => {
    const initialState = {
      energy: 9,
      sensory: { water: true, light: true, noise: true },
      lastCheck: new Date().toISOString(),
    }
    localStorage.setItem('duck_os_system_v1', JSON.stringify(initialState))

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SystemProvider>{children}</SystemProvider>
    )
    const { result } = renderHook(() => useSystem(), { wrapper })

    expect(result.current.energy).toBe(9)
    expect(result.current.sensory.water).toBe(true)
    expect(result.current.isLocked).toBe(false)
  })
})
