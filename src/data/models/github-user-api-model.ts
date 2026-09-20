import type { GithubUserModel } from '@/domain/models'

export type GithubUserApiModel = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  email: string | null
  followers: number
  following: number
}

export const mapGithubUserApiModelToModel = (apiModel: GithubUserApiModel): GithubUserModel => ({
  login: apiModel.login,
  name: apiModel.name,
  avatarUrl: apiModel.avatar_url,
  bio: apiModel.bio,
  email: apiModel.email,
  followers: apiModel.followers,
  following: apiModel.following,
})
