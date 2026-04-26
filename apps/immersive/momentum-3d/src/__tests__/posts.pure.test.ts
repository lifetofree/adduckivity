import { describe, it, expect } from 'vitest'
import { readingTime, toSlug } from '../lib/posts'

// ── readingTime ────────────────────────────────────────────────────────────────

describe('readingTime', () => {
  it('returns "< 1 min read" for very short content', () => {
    expect(readingTime('hello world')).toBe('< 1 min read')
  })

  it('calculates 1 min for ~200 words', () => {
    const words = Array(200).fill('word').join(' ')
    expect(readingTime(words)).toBe('1 min read')
  })

  it('calculates 3 min for ~600 words', () => {
    const words = Array(600).fill('word').join(' ')
    expect(readingTime(words)).toBe('3 min read')
  })

  it('strips markdown syntax characters (#, *, `, [, ]) before counting', () => {
    // strips the symbols but not surrounding words — test structural equivalence
    const content = '# Title\n**bold** `code` [label]'
    const plain = 'Title\nbold code label'
    expect(readingTime(content)).toBe(readingTime(plain))
  })

  it('handles empty string', () => {
    expect(readingTime('')).toBe('< 1 min read')
  })
})

// ── toSlug ─────────────────────────────────────────────────────────────────────

describe('toSlug', () => {
  it('lowercases the title', () => {
    expect(toSlug('Hello World')).toBe('hello-world')
  })

  it('replaces spaces with hyphens', () => {
    expect(toSlug('my blog post')).toBe('my-blog-post')
  })

  it('removes special characters', () => {
    expect(toSlug('Hello, World!')).toBe('hello-world')
  })

  it('collapses multiple hyphens', () => {
    expect(toSlug('foo  --  bar')).toBe('foo-bar')
  })

  it('truncates to 60 characters', () => {
    const long = 'a'.repeat(80)
    expect(toSlug(long).length).toBeLessThanOrEqual(60)
  })

  it('handles Thai and non-ASCII by stripping them', () => {
    // Thai chars are not a-z0-9, so they get stripped
    expect(toSlug('สวัสดี world')).toBe('world')
  })

  it('returns empty string for all-special input', () => {
    expect(toSlug('!!! @@@')).toBe('')
  })
})
