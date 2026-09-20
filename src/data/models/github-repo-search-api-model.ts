import type { GithubRepoApiModel } from './github-repo-api-model'

export type GithubRepoSearchApiModel = {
  total_count: number
  incomplete_results: boolean
  items: GithubRepoApiModel[]
}
