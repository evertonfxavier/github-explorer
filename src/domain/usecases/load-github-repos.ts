import type { GithubRepoModel } from '@/domain/models'

export type RepoSortOrder = 'stars-desc' | 'stars-asc' | 'forks-desc' | 'updated-desc'

export type LoadGithubReposParams = {
  username: string
  page: number
  perPage: number
  sortOrder: RepoSortOrder
  search?: string
}

export type LoadGithubReposResult = {
  repos: GithubRepoModel[]
  hasMore: boolean
  totalCount: number
}

export interface LoadGithubRepos {
  loadAll: (params: LoadGithubReposParams, signal?: AbortSignal) => Promise<LoadGithubReposResult>
}
