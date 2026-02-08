/**
 * This is layer for redis integration
 */

export interface CachePort {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void>
  delete(key: string): Promise<void>
}

export class MemoryCache implements CachePort {
  private readonly store = new Map<string, { value: unknown; expiresAt?: number }>()

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key)
    if (!entry) return null

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    console.log('using cached data: ', key)
    return entry.value as T
  }

  async set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void> {
    const expiresAt = options?.ttl ? Date.now() + options.ttl * 1000 : undefined

    console.log('caching data: ', key)
    this.store.set(key, { value, expiresAt })
  }

  async delete(key: string): Promise<void> {
    console.log('delete cache data: ', key)
    this.store.delete(key)
  }
}
