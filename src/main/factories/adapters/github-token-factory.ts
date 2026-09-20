import { LocalStorageGithubToken } from '@/main/adapters'
import { makeLocalStorageAdapter } from '@/main/factories/cache'
import type { GithubToken } from '@/presentation/protocols'

export const makeGithubToken = (): GithubToken => {
  const localStorageAdapter = makeLocalStorageAdapter()
  return new LocalStorageGithubToken(localStorageAdapter, localStorageAdapter)
}
