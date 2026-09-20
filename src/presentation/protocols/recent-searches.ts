export interface RecentSearches {
  load: () => string[]
  add: (username: string) => string[]
  clear: () => void
}
