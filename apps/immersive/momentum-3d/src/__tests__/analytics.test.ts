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
      get: vi.fn(async (key: string) => {
        const entry = store.get(key)
        return entry ? entry.value : null
      }),
      list: vi.fn(async (options: any) => {
        let keys = Array.from(store.keys())
        if (options?.prefix) {
          keys = keys.filter(k => k.startsWith(options.prefix))
        }
        return { keys: keys.map(name => ({ name })), list_complete: true }
      }),
    }
    ;(getMockKV as any).mockReturnValue(mockKV)
    process.env.NODE_ENV = 'development'
  })

  it('tracks an allowlisted event successfully', async () => {
    const req = new NextRequest('http://localhost/api/track', {
      method: 'POST',
      body: JSON.stringify({ event: 'emergency_start' })
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)

    expect(mockKV.put).toHaveBeenCalledWith(
      expect.stringContaining('stats:hit:emergency_start:'),
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

  // Regression test for ISSUESTOFIX #35 — non-allowlisted events must be rejected.
  it('rejects events not on the allowlist (#35)', async () => {
    const req = new NextRequest('http://localhost/api/track', {
      method: 'POST',
      body: JSON.stringify({ event: 'arbitrary_attacker_payload' })
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(mockKV.put).not.toHaveBeenCalled()
  })

  it('retrieves stats correctly', async () => {
    const now = Date.now()
    // Manually seed KV with recent timestamps so they survive the time-window filter.
    await mockKV.put(`stats:hit:step1:${now}-abc123`, '1')
    await mockKV.put(`stats:hit:step1:${now}-def456`, '1')
    await mockKV.put(`stats:hit:step2:${now}-ghi789`, '1')

    const req = new Request('http://localhost/api/stats', {
      headers: { 'x-admin-key': 'dev-key' },
    }) as unknown as import('next/server').NextRequest
    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()

    expect(data.summary).toEqual({
      step1: 2,
      step2: 1
    })
    expect(data.total_hits).toBe(3)
  })
})
