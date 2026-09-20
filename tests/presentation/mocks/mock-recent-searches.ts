import type { RecentSearches } from '@/presentation/protocols'

export class RecentSearchesSpy implements RecentSearches {
  items: string[] = []
  cleared = false

  load(): string[] {
    return this.items
  }

  add(username: string): string[] {
    this.items = [username, ...this.items.filter(existing => existing !== username)]
    return this.items
  }

  clear(): void {
    this.items = []
    this.cleared = true
  }
}
