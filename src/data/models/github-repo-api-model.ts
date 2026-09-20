import type { GithubRepoModel } from '@/domain/models'

export type GithubRepoApiModel = {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  language: string | null
  html_url: string
  private: boolean
  forks_count: number
  open_issues_count: number
  watchers_count: number
  license: { name: string } | null
  default_branch: string
  created_at: string
  updated_at: string
  size: number
  clone_url: string
}

export const mapGithubRepoApiModelToModel = (apiModel: GithubRepoApiModel): GithubRepoModel => ({
  name: apiModel.name,
  fullName: apiModel.full_name,
  description: apiModel.description,
  stars: apiModel.stargazers_count,
  language: apiModel.language,
  htmlUrl: apiModel.html_url,
  isPrivate: apiModel.private,
  forksCount: apiModel.forks_count,
  openIssuesCount: apiModel.open_issues_count,
  watchersCount: apiModel.watchers_count,
  license: apiModel.license?.name ?? null,
  defaultBranch: apiModel.default_branch,
  createdAt: apiModel.created_at,
  updatedAt: apiModel.updated_at,
  sizeKb: apiModel.size,
  cloneUrl: apiModel.clone_url,
})
