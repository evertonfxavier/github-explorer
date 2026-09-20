import type { LoadGithubRepo, LoadGithubRepos, LoadGithubReposParams, LoadGithubReposResult, LoadGithubUser } from '@/domain/usecases'
import type { GithubRepoModel, GithubUserModel } from '@/domain/models'
import { mockGithubRepoModel, mockGithubReposModel, mockGithubUserModel } from '@/tests/domain/mocks'

export class LoadGithubUserSpy implements LoadGithubUser {
  username?: string
  result: GithubUserModel = mockGithubUserModel()
  error?: Error

  async load(username: string): Promise<GithubUserModel> {
    this.username = username
    if (this.error) throw this.error
    return this.result
  }
}

export class LoadGithubReposSpy implements LoadGithubRepos {
  params?: LoadGithubReposParams
  signal?: AbortSignal
  callCount = 0
  result: LoadGithubReposResult = { repos: mockGithubReposModel(), hasMore: false, totalCount: 2 }
  error?: Error

  async loadAll(params: LoadGithubReposParams, signal?: AbortSignal): Promise<LoadGithubReposResult> {
    this.params = params
    this.signal = signal
    this.callCount++
    if (this.error) throw this.error
    return this.result
  }
}

export class LoadGithubRepoSpy implements LoadGithubRepo {
  username?: string
  name?: string
  result: GithubRepoModel = mockGithubRepoModel()
  error?: Error

  async load(username: string, name: string): Promise<GithubRepoModel> {
    this.username = username
    this.name = name
    if (this.error) throw this.error
    return this.result
  }
}
