/**
 * Mock KV namespace for local development
 * This provides an in-memory KV implementation when running outside Cloudflare Pages
 */

interface MockKVEntry {
  value: string
  metadata?: Record<string, unknown>
}

class MockKVNamespace implements KVNamespace {
  private store: Map<string, MockKVEntry> = new Map()

  async get(key: string): Promise<string | null>
  async get(key: string, type: 'text'): Promise<string | null>
  async get(key: string, type: 'json'): Promise<unknown | null>
  async get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>
  async get(key: string, type: 'stream'): Promise<ReadableStream | null>
  async get(key: string, type?: string): Promise<string | ArrayBuffer | ReadableStream | null | unknown> {
    const entry = this.store.get(key)
    if (!entry) return null

    switch (type) {
      case 'json':
        return JSON.parse(entry.value)
      case 'arrayBuffer':
        return new TextEncoder().encode(entry.value).buffer
      case 'stream':
        return new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(entry.value))
            controller.close()
          }
        })
      case 'text':
      default:
        return entry.value
    }
  }

  async put(key: string, value: string | ReadableStream | ArrayBuffer): Promise<void>
  async put(key: string, value: string | ReadableStream | ArrayBuffer, options?: { expiration?: number; expirationTtl?: number; metadata?: Record<string, unknown> }): Promise<void>
  async put(key: string, value: string | ReadableStream | ArrayBuffer, options?: unknown): Promise<void> {
    let stringValue: string

    if (typeof value === 'string') {
      stringValue = value
    } else if (value instanceof ArrayBuffer) {
      stringValue = new TextDecoder().decode(value)
    } else if (value instanceof ReadableStream) {
      const reader = value.getReader()
      const chunks: Uint8Array[] = []
      while (true) {
        const { done, value: chunk } = await reader.read()
        if (done) break
        chunks.push(chunk)
      }
      const combined = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      let offset = 0
      for (const chunk of chunks) {
        combined.set(chunk, offset)
        offset += chunk.length
      }
      stringValue = new TextDecoder().decode(combined)
    } else {
      stringValue = String(value)
    }

    const opts = options as { metadata?: Record<string, unknown> } | undefined
    this.store.set(key, { value: stringValue, metadata: opts?.metadata })
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  async list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: Array<{ name: string }>; list_complete: boolean; cursor?: string }> {
    let keys = Array.from(this.store.keys())

    if (options?.prefix) {
      keys = keys.filter(key => key.startsWith(options.prefix!))
    }

    if (options?.limit) {
      keys = keys.slice(0, options.limit)
    }

    return {
      keys: keys.map(name => ({ name })),
      list_complete: true
    }
  }
}

// Global mock KV instance for development
let mockKV: MockKVNamespace | null = null

export function getMockKV(): KVNamespace {
  if (!mockKV) {
    mockKV = new MockKVNamespace()
  }
  return mockKV
}

export function isLocalDev(): boolean {
  return process.env.NODE_ENV === 'development' && !process.env.CF_PAGES)
}
