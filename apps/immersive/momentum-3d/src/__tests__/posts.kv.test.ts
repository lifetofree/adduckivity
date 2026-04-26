import { describe, it, expect, beforeEach } from 'vitest'
import {
  savePost,
  getPostBySlug,
  getAllPosts,
  getPublishedPosts,
  updatePost,
  deletePost,
  slugExists,
} from '../lib/posts'
import type { Post } from '../lib/posts'

// In-memory KV stub — mirrors the Cloudflare Workers KV API surface we use
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

const baseInput = {
  slug: 'test-post',
  title: 'Test Post',
  content: 'Hello world content',
  status: 'published' as const,
}

describe('savePost', () => {
  it('creates a new post with defaults filled in', async () => {
    const kv = makeKV()
    const post = await savePost(kv, baseInput)

    expect(post.slug).toBe('test-post')
    expect(post.title).toBe('Test Post')
    expect(post.category).toBe('uncategorized')
    expect(post.author).toBe('Adduckivity')
    expect(post.status).toBe('published')
    expect(post.readingTime).toBeTruthy()
  })

  it('persists the post so getPostBySlug retrieves it', async () => {
    const kv = makeKV()
    await savePost(kv, baseInput)
    const fetched = await getPostBySlug(kv, 'test-post')
    expect(fetched?.title).toBe('Test Post')
  })

  it('overwrites an existing post on re-save', async () => {
    const kv = makeKV()
    await savePost(kv, baseInput)
    await savePost(kv, { ...baseInput, title: 'Updated Title' })
    const post = await getPostBySlug(kv, 'test-post')
    expect(post?.title).toBe('Updated Title')
  })
})

describe('getPostBySlug', () => {
  it('returns null for a missing slug', async () => {
    const kv = makeKV()
    const post = await getPostBySlug(kv, 'does-not-exist')
    expect(post).toBeNull()
  })
})

describe('getAllPosts', () => {
  it('returns all saved posts sorted newest-first', async () => {
    const kv = makeKV()
    await savePost(kv, { slug: 'old', title: 'Old', content: 'x', date: '2024-01-01', status: 'published' })
    await savePost(kv, { slug: 'new', title: 'New', content: 'x', date: '2025-06-01', status: 'published' })

    const posts = await getAllPosts(kv)
    expect(posts[0].slug).toBe('new')
    expect(posts[1].slug).toBe('old')
  })

  it('returns empty array when KV is empty', async () => {
    const kv = makeKV()
    expect(await getAllPosts(kv)).toEqual([])
  })
})

describe('getPublishedPosts', () => {
  it('filters out draft posts', async () => {
    const kv = makeKV()
    await savePost(kv, { slug: 'pub', title: 'Pub', content: 'x', status: 'published' })
    await savePost(kv, { slug: 'drft', title: 'Draft', content: 'x', status: 'draft' })

    const published = await getPublishedPosts(kv)
    expect(published).toHaveLength(1)
    expect(published[0].slug).toBe('pub')
  })
})

describe('updatePost', () => {
  it('updates fields on an existing post', async () => {
    const kv = makeKV()
    await savePost(kv, baseInput)

    const updated = await updatePost(kv, 'test-post', { title: 'New Title' })
    expect(updated?.title).toBe('New Title')
    expect(updated?.content).toBe(baseInput.content) // unchanged
  })

  it('returns null when post does not exist', async () => {
    const kv = makeKV()
    const result = await updatePost(kv, 'ghost', { title: 'X' })
    expect(result).toBeNull()
  })

  it('moves to new slug when slug is changed', async () => {
    const kv = makeKV()
    await savePost(kv, baseInput)
    await updatePost(kv, 'test-post', { slug: 'renamed-post' })

    expect(await getPostBySlug(kv, 'test-post')).toBeNull()
    expect(await getPostBySlug(kv, 'renamed-post')).not.toBeNull()
  })
})

describe('deletePost', () => {
  it('removes an existing post and returns true', async () => {
    const kv = makeKV()
    await savePost(kv, baseInput)

    const deleted = await deletePost(kv, 'test-post')
    expect(deleted).toBe(true)
    expect(await getPostBySlug(kv, 'test-post')).toBeNull()
  })

  it('returns false when post does not exist', async () => {
    const kv = makeKV()
    expect(await deletePost(kv, 'ghost')).toBe(false)
  })
})

describe('slugExists', () => {
  it('returns true for an existing slug', async () => {
    const kv = makeKV()
    await savePost(kv, baseInput)
    expect(await slugExists(kv, 'test-post')).toBe(true)
  })

  it('returns false for a missing slug', async () => {
    const kv = makeKV()
    expect(await slugExists(kv, 'nope')).toBe(false)
  })
})
