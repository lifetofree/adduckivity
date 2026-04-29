import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  savePost,
  getPublishedPosts,
  promoteScheduledPosts,
} from '../lib/posts'

// In-memory KV stub
function makeKV() {
  const store = new Map<string, string>()
  return {
    async get(key: string, type: 'json'): Promise<unknown> {
      const raw = store.get(key)
      return raw ? JSON.parse(raw) : null
    },
    async put(key: string, value: string): Promise<void> {
      store.set(key, value)
    },
    async delete(key: string): Promise<void> {
      store.delete(key)
    },
    async list({ prefix }: { prefix: string }): Promise<{ keys: { name: string }[] }> {
      const keys = [...store.keys()]
        .filter(k => k.startsWith(prefix))
        .map(name => ({ name }))
      return { keys }
    },
  } as unknown as KVNamespace
}

describe('Scheduling logic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Reset global fetch mock if any
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ id: '123_456' })
    })))
  })

  it('hides future scheduled posts', async () => {
    const kv = makeKV()
    const future = new Date(Date.now() + 1000 * 60 * 60) // 1 hour in future
    
    await savePost(kv, {
      slug: 'future',
      title: 'Future Post',
      content: 'x',
      status: 'scheduled',
      scheduledAt: future.toISOString()
    })

    const published = await getPublishedPosts(kv)
    expect(published.find(p => p.slug === 'future')).toBeUndefined()
  })

  it('promotes past scheduled posts to published and uses scheduled time as date', async () => {
    const kv = makeKV()
    const past = new Date('2026-01-01T10:00:00Z')
    vi.setSystemTime(new Date('2026-04-29T10:00:00Z')) // it is now April
    
    await savePost(kv, {
      slug: 'past',
      title: 'Past Post',
      content: 'x',
      status: 'scheduled',
      scheduledAt: past.toISOString()
    })

    const published = await getPublishedPosts(kv)
    const post = published.find(p => p.slug === 'past')
    expect(post).toBeDefined()
    expect(post?.status).toBe('published')
    expect(post?.date).toBe('2026-01-01') // Should match scheduledAt date, not system time date
  })

  it('sets facebookPosted flag when env is provided and promotion happens', async () => {
    const kv = makeKV()
    const past = new Date('2026-01-01T10:00:00Z')
    vi.setSystemTime(new Date('2026-04-29T10:00:00Z'))
    
    await savePost(kv, {
      slug: 'social',
      title: 'Social Post',
      content: 'x',
      status: 'scheduled',
      scheduledAt: past.toISOString()
    })

    const env = { 
      FACEBOOK_PAGE_ACCESS_TOKEN: 'token', 
      FACEBOOK_PAGE_ID: 'id',
      SITE_URL: 'https://test.com'
    } as any

    const [post] = await promoteScheduledPosts(kv, [await kv.get('post:social', 'json') as any], env)
    
    expect(post.status).toBe('published')
    expect(post.facebookPosted).toBe(true)
    
    // Check if it was saved to KV with the flag
    const saved = await kv.get('post:social', 'json') as any
    expect(saved.facebookPosted).toBe(true)
  })

  it('prevents multiple Facebook posts using the flag', async () => {
    const kv = makeKV()
    const past = new Date('2026-01-01T10:00:00Z')
    vi.setSystemTime(new Date('2026-04-29T10:00:00Z'))
    
    await savePost(kv, {
      slug: 'double',
      title: 'Double Post',
      content: 'x',
      status: 'scheduled',
      scheduledAt: past.toISOString(),
      facebookPosted: true // already posted!
    })

    const env = { FACEBOOK_PAGE_ACCESS_TOKEN: 't', FACEBOOK_PAGE_ID: 'i' } as any
    const fetchSpy = vi.spyOn(global, 'fetch')

    await promoteScheduledPosts(kv, [await kv.get('post:double', 'json') as any], env)
    
    // Should NOT have called fetch again
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
