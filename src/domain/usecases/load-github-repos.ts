import type { GithubRepoModel } from '@/domain/models'

export interface LoadGithubRepos {
  loadAll: (username: string) => Promise<GithubRepoModel[]>
}
