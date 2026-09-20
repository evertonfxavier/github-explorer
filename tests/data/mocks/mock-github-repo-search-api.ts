import type { GithubRepoSearchApiModel } from '@/data/models'
import { mockGithubReposApiModel } from './mock-github-repo-api'

export const mockGithubRepoSearchApiModel = (totalCount?: number): GithubRepoSearchApiModel => {
  const items = mockGithubReposApiModel()

  return {
    total_count: totalCount ?? items.length,
    incomplete_results: false,
    items,
  }
}
