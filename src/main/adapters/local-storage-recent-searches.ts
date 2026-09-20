import type { GetStorage, SetStorage } from '@/data/protocols/cache'
import type { RecentSearches } from '@/presentation/protocols'

const STORAGE_KEY = 'recent-searches'
const MAX_ITEMS = 5

export class LocalStorageRecentSearches implements RecentSearches {
  private readonly getStorage: GetStorage
  private readonly setStorage: SetStorage

  constructor(getStorage: GetStorage, setStorage: SetStorage) {
    this.getStorage = getStorage
    this.setStorage = setStorage
  }

  load(): string[] {
    const stored = this.getStorage.get(STORAGE_KEY)
    return Array.isArray(stored) ? (stored as string[]) : []
  }

  add(username: string): string[] {
    const updated = [username, ...this.load().filter(existing => existing !== username)].slice(0, MAX_ITEMS)
    this.setStorage.set(STORAGE_KEY, updated)
    return updated
  }

  clear(): void {
    this.setStorage.set(STORAGE_KEY, null)
  }
}
