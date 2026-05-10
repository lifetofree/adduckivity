/**
 * In-memory mock of the Cloudflare KV namespace API for local development.
 * Returned by `getMockKV()` when `NODE_ENV === 'development'`.
 * Supports the same `get` / `put` / `delete` / `list` interface as the real KV binding.
 */

interface MockKVEntry {
  value: string
  metadata?: Record<string, unknown>
}

class MockKVNamespace {
  private store: Map<string, MockKVEntry> = new Map()

  /**
   * Retrieves a value by key. Returns `null` if the key does not exist.
   *
   * @param key  - KV key to look up.
   * @param type - Desired return format: `'json'` | `'arrayBuffer'` | `'stream'` | `'text'`.
   */
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
          },
        })
      case 'text':
      case undefined:
      default:
        return entry.value
    }
  }

  /**
   * Stores a value under the given key.
   * Accepts `string`, `ArrayBuffer`, or `ReadableStream`; all are normalised to a string internally.
   *
   * @param key     - KV key.
   * @param value   - Value to store.
   * @param options - Optional metadata (mirrors the real KV `put` options shape).
   */
  async put(key: string, value: string | ReadableStream | ArrayBuffer, options?: unknown): Promise<void> {
    let stringValue: string

    if (typeof value === 'string') {
      stringValue = value
    } else if (value instanceof ArrayBuffer) {
      stringValue = new TextDecoder().decode(value)
    } else if (value instanceof ReadableStream) {
      const chunks: Uint8Array[] = []
      for await (const chunk of value as unknown as AsyncIterable<Uint8Array>) {
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

  /**
   * Removes a key from the store. No-ops if the key does not exist.
   *
   * @param key - KV key to delete.
   */
  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  /**
   * Lists keys in the store, with optional prefix filtering and limit.
   * Always returns `list_complete: true` (pagination not implemented in mock).
   *
   * @param options - `prefix`, `limit`, and `cursor` (cursor is ignored).
   */
  async list(options?: {
    prefix?: string
    limit?: number
    cursor?: string
  }): Promise<{ keys: Array<{ name: string }>; list_complete: boolean; cursor?: string }> {
    let keys = Array.from(this.store.keys())

    if (options?.prefix) {
      keys = keys.filter(key => key.startsWith(options.prefix!))
    }

    if (options?.limit) {
      keys = keys.slice(0, options.limit)
    }

    return { keys: keys.map(name => ({ name })), list_complete: true }
  }
}

// Singleton — reuse the same in-memory store for the full dev session.
let mockKV: MockKVNamespace | null = null

/**
 * Returns the singleton mock KV instance, creating it on first call.
 * Cast to `KVNamespace` so it satisfies Cloudflare type signatures.
 */
export function getMockKV(): KVNamespace {
  if (!mockKV) {
    mockKV = new MockKVNamespace()
  }
  return mockKV as unknown as KVNamespace
}

/**
 * Returns `true` when running in local dev outside Cloudflare Pages.
 * Used to gate features that require real Cloudflare bindings.
 */
export function isLocalDev(): boolean {
  return process.env.NODE_ENV === 'development' && !process.env.CF_PAGES
}
