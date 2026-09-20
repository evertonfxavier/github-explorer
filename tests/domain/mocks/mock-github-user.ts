import type { GithubUserModel } from '@/domain/models'

export const mockGithubUserModel = (): GithubUserModel => ({
  login: `user-${crypto.randomUUID()}`,
  name: `name-${crypto.randomUUID()}`,
  avatarUrl: `https://avatars.githubusercontent.com/u/${crypto.randomUUID()}`,
  bio: `bio-${crypto.randomUUID()}`,
  email: `${crypto.randomUUID()}@mail.com`,
  followers: Math.round(Math.random() * 1000),
  following: Math.round(Math.random() * 1000),
})
