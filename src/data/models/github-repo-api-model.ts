import type { GithubRepoModel } from '@/domain/models'

export type GithubRepoApiModel = {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  language: string | null
  html_url: string
}

export const mapGithubRepoApiModelToModel = (apiModel: GithubRepoApiModel): GithubRepoModel => ({
  name: apiModel.name,
  fullName: apiModel.full_name,
  description: apiModel.description,
  stars: apiModel.stargazers_count,
  language: apiModel.language,
  htmlUrl: apiModel.html_url,
})
