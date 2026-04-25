import { describe, it, expect } from 'vitest'
import { toSlug, readingTime } from './posts'

describe('posts library', () => {
  describe('toSlug', () => {
    it('converts basic title to slug', () => {
      expect(toSlug('Hello World')).toBe('hello-world')
    })

    it('handles special characters', () => {
      expect(toSlug('Hello World!!! 2026')).toBe('hello-world-2026')
    })

    it('handles multiple spaces', () => {
      expect(toSlug('Hello   World')).toBe('hello-world')
    })

    it('trims leading and trailing whitespace/dashes', () => {
      // This is expected to fail with the current implementation
      expect(toSlug('  Hello World  ')).toBe('hello-world')
    })
  })

  describe('readingTime', () => {
    it('returns < 1 min read for empty content', () => {
      expect(readingTime('')).toBe('< 1 min read')
    })

    it('returns 1 min read for small number of words', () => {
      expect(readingTime('Hello world')).toBe('1 min read')
    })
  })
})
