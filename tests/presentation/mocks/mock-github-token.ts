import type { GithubToken } from '@/presentation/protocols'

export class GithubTokenSpy implements GithubToken {
  token?: string
  cleared = false

  load(): string | undefined {
    return this.token
  }

  save(token: string): void {
    this.token = token
  }

  clear(): void {
    this.token = undefined
    this.cleared = true
  }
}
