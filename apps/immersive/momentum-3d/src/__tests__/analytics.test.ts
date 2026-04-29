import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../app/api/track/route'
import { GET } from '../app/api/stats/route'
import { NextRequest } from 'next/server'

// Mock Cloudflare request context and KV
vi.mock('@cloudflare/next-on-pages', () => ({
  getRequestContext: vi.fn()
}))

vi.mock('@/lib/dev-kv', () => ({
  getMockKV: vi.fn()
}))

import { getMockKV } from '@/lib/dev-kv'

describe('Analytics API', () => {
  let mockKV: any

  beforeEach(() => {
    vi.clearAllMocks()
    const store = new Map()
    mockKV = {
      store,
      put: vi.fn(async (key: string, value: string) => {
        store.set(key, value)
      }),
      list: vi.fn(async (options: any) => {
        let keys = Array.from(store.keys())
        if (options?.prefix) {
          keys = keys.filter(k => k.startsWith(options.prefix))
        }
        return { keys: keys.map(name => ({ name })), list_complete: true }
      })
    }
    ;(getMockKV as any).mockReturnValue(mockKV)
    process.env.NODE_ENV = 'development'
  })

  it('tracks an event successfully', async () => {
    const req = new NextRequest('http://localhost/api/track', {
      method: 'POST',
      body: JSON.stringify({ event: 'test_event' })
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)

    expect(mockKV.put).toHaveBeenCalledWith(
      expect.stringContaining('stats:hit:test_event:'),
      expect.any(String)
    )
  })

  it('fails if event name is missing', async () => {
    const req = new NextRequest('http://localhost/api/track', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('retrieves stats correctly', async () => {
    // Manually seed KV
    await mockKV.put('stats:hit:step1:123', '1')
    await mockKV.put('stats:hit:step1:456', '1')
    await mockKV.put('stats:hit:step2:789', '1')

    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()

    expect(data.summary).toEqual({
      step1: 2,
      step2: 1
    })
    expect(data.total_hits).toBe(3)
  })
})
