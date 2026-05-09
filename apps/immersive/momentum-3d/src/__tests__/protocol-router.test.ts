import { describe, it, expect } from 'vitest'
import { getRecommendation } from '../lib/protocol-router'

describe('getRecommendation', () => {
  describe('energy 1-3 (Crash / Critical)', () => {
    it('energy=1 → System Critical → /momentum', () => {
      const r = getRecommendation({ energy: 1, isLocked: false })
      expect(r.label).toBe('System Critical')
      expect(r.route).toBe('/momentum')
      expect(r.colorHex).toBe('#ff4444')
    })

    it('energy=2 → System Critical → /momentum', () => {
      const r = getRecommendation({ energy: 2, isLocked: false })
      expect(r.label).toBe('System Critical')
      expect(r.route).toBe('/momentum')
    })

    it('energy=3 → Crash State → /momentum', () => {
      const r = getRecommendation({ energy: 3, isLocked: false })
      expect(r.label).toBe('Crash State')
      expect(r.route).toBe('/momentum')
    })

    it('energy=3 + isLocked → still Crash State (energy wins)', () => {
      const r = getRecommendation({ energy: 3, isLocked: true })
      expect(r.route).toBe('/momentum')
    })
  })

  describe('energy 4-6', () => {
    it('energy=4, not locked → Low Fuel → /atomizer', () => {
      const r = getRecommendation({ energy: 4, isLocked: false })
      expect(r.label).toBe('Low Fuel')
      expect(r.route).toBe('/atomizer')
      expect(r.colorHex).toBe('#f59e0b')
    })

    it('energy=6, not locked → Low Fuel → /atomizer', () => {
      const r = getRecommendation({ energy: 6, isLocked: false })
      expect(r.label).toBe('Low Fuel')
      expect(r.route).toBe('/atomizer')
    })

    it('energy=4, isLocked → Biological Lock → /momentum', () => {
      const r = getRecommendation({ energy: 4, isLocked: true })
      expect(r.label).toBe('Biological Lock')
      expect(r.route).toBe('/momentum')
      expect(r.colorHex).toBe('#ff4444')
    })

    it('energy=6, isLocked → Biological Lock → /momentum', () => {
      const r = getRecommendation({ energy: 6, isLocked: true })
      expect(r.label).toBe('Biological Lock')
      expect(r.route).toBe('/momentum')
    })
  })

  describe('energy 7-10 (Flight Ready)', () => {
    it('energy=7, not locked → Flight Ready → /ignition', () => {
      const r = getRecommendation({ energy: 7, isLocked: false })
      expect(r.label).toBe('Flight Ready')
      expect(r.route).toBe('/ignition')
      expect(r.colorHex).toBe('#00E5FF')
    })

    it('energy=10, not locked → Flight Ready → /ignition', () => {
      const r = getRecommendation({ energy: 10, isLocked: false })
      expect(r.label).toBe('Flight Ready')
      expect(r.route).toBe('/ignition')
    })

    it('energy=7, isLocked → Low Fuel → /atomizer (downgrade, not emergency)', () => {
      const r = getRecommendation({ energy: 7, isLocked: true })
      expect(r.label).toBe('Low Fuel')
      expect(r.route).toBe('/atomizer')
    })

    it('energy=10, isLocked → Low Fuel → /atomizer', () => {
      const r = getRecommendation({ energy: 10, isLocked: true })
      expect(r.label).toBe('Low Fuel')
      expect(r.route).toBe('/atomizer')
    })
  })

  describe('all recommendations have required fields', () => {
    const cases = [1, 3, 4, 6, 7, 10].flatMap(energy =>
      [false, true].map(isLocked => ({ energy, isLocked }))
    )
    it.each(cases)('energy=$energy isLocked=$isLocked has label/route/toolName/colorHex/tagline', ({ energy, isLocked }) => {
      const r = getRecommendation({ energy, isLocked })
      expect(r.label).toBeTruthy()
      expect(r.route).toMatch(/^\//)
      expect(r.toolName).toBeTruthy()
      expect(r.colorHex).toMatch(/^#/)
      expect(r.tagline).toBeTruthy()
    })
  })
})
