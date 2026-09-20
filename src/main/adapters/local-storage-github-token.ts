import type { GetStorage, SetStorage } from '@/data/protocols/cache'
import type { GithubToken } from '@/presentation/protocols'

const STORAGE_KEY = 'github-token'

export class LocalStorageGithubToken implements GithubToken {
  private readonly getStorage: GetStorage
  private readonly setStorage: SetStorage

  constructor(getStorage: GetStorage, setStorage: SetStorage) {
    this.getStorage = getStorage
    this.setStorage = setStorage
  }

  load(): string | undefined {
    const stored = this.getStorage.get(STORAGE_KEY) as { token: string } | null
    return stored?.token
  }

  save(token: string): void {
    this.setStorage.set(STORAGE_KEY, { token })
  }

  clear(): void {
    this.setStorage.set(STORAGE_KEY, null)
  }
}
