import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  isPostLive,
  importGoogleDriveImages,
  postToFacebook,
} from '../lib/posts'
import type { Post } from '../lib/posts'

// ── isPostLive ───────────────────────────────────────────────────────────────────

describe('isPostLive', () => {
  it('returns true for published posts', () => {
    const post: Post = {
      slug: 'test',
      title: 'Test',
      date: '2026-04-30',
      category: 'protocol',
      scene: 'default',
      mood: 'neutral',
      excerpt: 'Test excerpt',
      tags: [],
      featuredImage: '',
      author: 'Adduckivity',
      readingTime: '1 min read',
      status: 'published',
      content: 'Test content',
    }
    expect(isPostLive(post)).toBe(true)
  })

  it('returns false for draft posts', () => {
    const post: Post = {
      slug: 'test',
      title: 'Test',
      date: '2026-04-30',
      category: 'protocol',
      scene: 'default',
      mood: 'neutral',
      excerpt: 'Test excerpt',
      tags: [],
      featuredImage: '',
      author: 'Adduckivity',
      readingTime: '1 min read',
      status: 'draft',
      content: 'Test content',
    }
    expect(isPostLive(post)).toBe(false)
  })

  it('returns false for scheduled posts with future date', () => {
    const future = new Date(Date.now() + 1000 * 60 * 60).toISOString() // 1 hour in future
    const post: Post = {
      slug: 'test',
      title: 'Test',
      date: '2026-04-30',
      category: 'protocol',
      scene: 'default',
      mood: 'neutral',
      excerpt: 'Test excerpt',
      tags: [],
      featuredImage: '',
      author: 'Adduckivity',
      readingTime: '1 min read',
      status: 'scheduled',
      scheduledAt: future,
      content: 'Test content',
    }
    expect(isPostLive(post)).toBe(false)
  })

  it('returns true for scheduled posts with past date', () => {
    const past = new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
    const post: Post = {
      slug: 'test',
      title: 'Test',
      date: '2026-04-30',
      category: 'protocol',
      scene: 'default',
      mood: 'neutral',
      excerpt: 'Test excerpt',
      tags: [],
      featuredImage: '',
      author: 'Adduckivity',
      readingTime: '1 min read',
      status: 'scheduled',
      scheduledAt: past,
      content: 'Test content',
    }
    expect(isPostLive(post)).toBe(true)
  })

  it('returns false for scheduled posts without scheduledAt', () => {
    const post: Post = {
      slug: 'test',
      title: 'Test',
      date: '2026-04-30',
      category: 'protocol',
      scene: 'default',
      mood: 'neutral',
      excerpt: 'Test excerpt',
      tags: [],
      featuredImage: '',
      author: 'Adduckivity',
      readingTime: '1 min read',
      status: 'scheduled',
      content: 'Test content',
    }
    expect(isPostLive(post)).toBe(false)
  })

  it('returns false for scheduled posts with invalid scheduledAt', () => {
    const post: Post = {
      slug: 'test',
      title: 'Test',
      date: '2026-04-30',
      category: 'protocol',
      scene: 'default',
      mood: 'neutral',
      excerpt: 'Test excerpt',
      tags: [],
      featuredImage: '',
      author: 'Adduckivity',
      readingTime: '1 min read',
      status: 'scheduled',
      scheduledAt: 'invalid-date',
      content: 'Test content',
    }
    expect(isPostLive(post)).toBe(false)
  })
})

// ── importGoogleDriveImages ───────────────────────────────────────────────────────

describe('importGoogleDriveImages', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('returns original content when env is undefined', async () => {
    const content = '![alt](https://drive.google.com/file/d/abc123/view)'
    const result = await importGoogleDriveImages(undefined, content)
    expect(result).toBe(content)
  })

  it('returns original content when ASSETS_BUCKET is undefined', async () => {
    const content = '![alt](https://drive.google.com/file/d/abc123/view)'
    const env = {} as any
    const result = await importGoogleDriveImages(env, content)
    expect(result).toBe(content)
  })

  it('returns original content when no Google Drive URLs are found', async () => {
    const content = '![alt](https://example.com/image.jpg)'
    const env = {
      ASSETS_BUCKET: {
        put: vi.fn(),
      },
      SITE_URL: 'https://test.com',
    } as any
    const result = await importGoogleDriveImages(env, content)
    expect(result).toBe(content)
    expect(env.ASSETS_BUCKET.put).not.toHaveBeenCalled()
  })

  it('replaces Google Drive URL with R2 URL on successful import', async () => {
    const content = '![alt](https://drive.google.com/file/d/abc123/view)'
    const env = {
      ASSETS_BUCKET: {
        put: vi.fn().mockResolvedValue(undefined),
      },
      SITE_URL: 'https://test.com',
    } as any

    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      headers: {
        get: vi.fn((name: string) => name === 'content-type' ? 'image/jpeg' : null),
      },
      arrayBuffer: vi.fn(async () => new ArrayBuffer(100)),
    })))

    const result = await importGoogleDriveImages(env, content)

    expect(result).toContain('https://test.com/api/assets/uploads/')
    expect(result).not.toContain('drive.google.com')
    expect(env.ASSETS_BUCKET.put).toHaveBeenCalled()
  })

  it('skips image when fetch fails', async () => {
    const content = '![alt](https://drive.google.com/file/d/abc123/view)'
    const env = {
      ASSETS_BUCKET: {
        put: vi.fn(),
      },
      SITE_URL: 'https://test.com',
    } as any

    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      status: 404,
    })))

    const result = await importGoogleDriveImages(env, content)

    // Should return original content unchanged
    expect(result).toBe(content)
    expect(env.ASSETS_BUCKET.put).not.toHaveBeenCalled()
  })

  it('handles multiple Google Drive images in content', async () => {
    const content = `
![alt1](https://drive.google.com/file/d/abc123/view)
Some text
![alt2](https://drive.google.com/file/d/def456/view)
`
    const env = {
      ASSETS_BUCKET: {
        put: vi.fn().mockResolvedValue(undefined),
      },
      SITE_URL: 'https://test.com',
    } as any

    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      headers: {
        get: vi.fn((name: string) => name === 'content-type' ? 'image/jpeg' : null),
      },
      arrayBuffer: vi.fn(async () => new ArrayBuffer(100)),
    })))

    const result = await importGoogleDriveImages(env, content)

    expect(result).not.toContain('drive.google.com')
    expect(env.ASSETS_BUCKET.put).toHaveBeenCalledTimes(2)
  })

  it('uses correct file extension based on content-type', async () => {
    const content = '![alt](https://drive.google.com/file/d/abc123/view)'
    const env = {
      ASSETS_BUCKET: {
        put: vi.fn().mockResolvedValue(undefined),
      },
      SITE_URL: 'https://test.com',
    } as any

    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      headers: {
        get: vi.fn((name: string) => name === 'content-type' ? 'image/png' : null),
      },
      arrayBuffer: vi.fn(async () => new ArrayBuffer(100)),
    })))

    await importGoogleDriveImages(env, content)

    expect(env.ASSETS_BUCKET.put).toHaveBeenCalledWith(
      expect.stringMatching(/\.png$/),
      expect.any(ArrayBuffer),
      expect.any(Object)
    )
  })

  it('defaults to jpg extension for unknown content-type', async () => {
    const content = '![alt](https://drive.google.com/file/d/abc123/view)'
    const env = {
      ASSETS_BUCKET: {
        put: vi.fn().mockResolvedValue(undefined),
      },
      SITE_URL: 'https://test.com',
    } as any

    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      headers: {
        get: vi.fn((name: string) => name === 'content-type' ? 'image/unknown' : null),
      },
      arrayBuffer: vi.fn(async () => new ArrayBuffer(100)),
    })))

    await importGoogleDriveImages(env, content)

    expect(env.ASSETS_BUCKET.put).toHaveBeenCalledWith(
      expect.stringMatching(/\.jpg$/),
      expect.any(ArrayBuffer),
      expect.any(Object)
    )
  })
})

// ── postToFacebook ───────────────────────────────────────────────────────────────

describe('postToFacebook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('returns ok: false with error when in development mode', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    const env = {
      FACEBOOK_PAGE_ACCESS_TOKEN: 'token',
      FACEBOOK_PAGE_ID: '123',
      SITE_URL: 'https://test.com',
    } as any

    const result = await postToFacebook(env, {
      title: 'Test Post',
      excerpt: 'Test excerpt',
      slug: 'test-post',
    })

    expect(result.ok).toBe(false)
    expect(result.error).toBe('skipped in dev')

    process.env.NODE_ENV = originalEnv
  })

  it('returns ok: false when FACEBOOK_PAGE_ACCESS_TOKEN is missing', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const env = {
      FACEBOOK_PAGE_ID: '123',
      SITE_URL: 'https://test.com',
    } as any

    const result = await postToFacebook(env, {
      title: 'Test Post',
      excerpt: 'Test excerpt',
      slug: 'test-post',
    })

    expect(result.ok).toBe(false)
    expect(result.error).toBe('FACEBOOK_PAGE_ACCESS_TOKEN not set')

    process.env.NODE_ENV = originalEnv
  })

  it('returns ok: false when FACEBOOK_PAGE_ID is missing', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const env = {
      FACEBOOK_PAGE_ACCESS_TOKEN: 'token',
      SITE_URL: 'https://test.com',
    } as any

    const result = await postToFacebook(env, {
      title: 'Test Post',
      excerpt: 'Test excerpt',
      slug: 'test-post',
    })

    expect(result.ok).toBe(false)
    expect(result.error).toBe('FACEBOOK_PAGE_ID not set')

    process.env.NODE_ENV = originalEnv
  })

  it('posts successfully to Facebook with correct parameters', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const env = {
      FACEBOOK_PAGE_ACCESS_TOKEN: 'test-token',
      FACEBOOK_PAGE_ID: '123456',
      SITE_URL: 'https://test.com',
    } as any

    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ id: 'fb-post-123' }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await postToFacebook(env, {
      title: 'Test Post',
      excerpt: 'Test excerpt',
      slug: 'test-post',
      featuredImage: 'https://test.com/image.jpg',
    })

    expect(result.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/123456/feed',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(URLSearchParams),
      })
    )

    const body = fetchMock.mock.calls[0][1].body as URLSearchParams
    expect(body.get('message')).toContain('Test Post')
    expect(body.get('message')).toContain('Test excerpt')
    expect(body.get('link')).toBe('https://test.com/blog/test-post')
    // Note: 'picture' param is no longer sent - Facebook deprecated it
    // OG image is auto-scraped from the page's og:image meta tag
    expect(body.get('access_token')).toBe('test-token')

    process.env.NODE_ENV = originalEnv
  })

  it('returns ok: false when Facebook API returns error', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const env = {
      FACEBOOK_PAGE_ACCESS_TOKEN: 'test-token',
      FACEBOOK_PAGE_ID: '123456',
      SITE_URL: 'https://test.com',
    } as any

    const fetchMock = vi.fn(async () => ({
      ok: false,
      json: async () => ({ error: { message: 'Invalid token' } }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await postToFacebook(env, {
      title: 'Test Post',
      excerpt: 'Test excerpt',
      slug: 'test-post',
    })

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Invalid token')

    process.env.NODE_ENV = originalEnv
  })

  it('returns ok: false when fetch throws error', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const env = {
      FACEBOOK_PAGE_ACCESS_TOKEN: 'test-token',
      FACEBOOK_PAGE_ID: '123456',
      SITE_URL: 'https://test.com',
    } as any

    const fetchMock = vi.fn(async () => {
      throw new Error('Network error')
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await postToFacebook(env, {
      title: 'Test Post',
      excerpt: 'Test excerpt',
      slug: 'test-post',
    })

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Error: Network error')

    process.env.NODE_ENV = originalEnv
  })

  it('includes hashtags in the message', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const env = {
      FACEBOOK_PAGE_ACCESS_TOKEN: 'test-token',
      FACEBOOK_PAGE_ID: '123456',
      SITE_URL: 'https://test.com',
    } as any

    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ id: 'fb-post-123' }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    await postToFacebook(env, {
      title: 'Test Post',
      excerpt: 'Test excerpt',
      slug: 'test-post',
    })

    const body = fetchMock.mock.calls[0][1].body as URLSearchParams
    expect(body.get('message')).toContain('#DuckOS')
    expect(body.get('message')).toContain('#Productivity')
    expect(body.get('message')).toContain('#ADHD')
    expect(body.get('message')).toContain('#Neurodivergent')

    process.env.NODE_ENV = originalEnv
  })

  it('does not include picture parameter when featuredImage is not HTTP URL', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const env = {
      FACEBOOK_PAGE_ACCESS_TOKEN: 'test-token',
      FACEBOOK_PAGE_ID: '123456',
      SITE_URL: 'https://test.com',
    } as any

    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ id: 'fb-post-123' }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    await postToFacebook(env, {
      title: 'Test Post',
      excerpt: 'Test excerpt',
      slug: 'test-post',
      featuredImage: '/relative/path.jpg',
    })

    const body = fetchMock.mock.calls[0][1].body as URLSearchParams
    expect(body.get('picture')).toBeNull()

    process.env.NODE_ENV = originalEnv
  })
})
