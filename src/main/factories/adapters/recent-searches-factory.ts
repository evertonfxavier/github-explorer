import { LocalStorageRecentSearches } from '@/main/adapters'
import { makeLocalStorageAdapter } from '@/main/factories/cache'
import type { RecentSearches } from '@/presentation/protocols'

export const makeRecentSearches = (): RecentSearches => {
  const localStorageAdapter = makeLocalStorageAdapter()
  return new LocalStorageRecentSearches(localStorageAdapter, localStorageAdapter)
}
