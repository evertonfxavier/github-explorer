import type { GithubUserModel } from '@/domain/models'

export type GithubUserApiModel = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  email: string | null
  company: string | null
  location: string | null
  blog: string | null
  html_url: string
  created_at: string
  followers: number
  following: number
  public_repos: number
}

export const mapGithubUserApiModelToModel = (apiModel: GithubUserApiModel): GithubUserModel => ({
  login: apiModel.login,
  name: apiModel.name,
  avatarUrl: apiModel.avatar_url,
  bio: apiModel.bio,
  email: apiModel.email,
  company: apiModel.company,
  location: apiModel.location,
  blog: apiModel.blog || null,
  htmlUrl: apiModel.html_url,
  createdAt: apiModel.created_at,
  followers: apiModel.followers,
  following: apiModel.following,
  publicRepos: apiModel.public_repos,
})
