import type { GithubUserApiModel } from '@/data/models'

export const mockGithubUserApiModel = (): GithubUserApiModel => ({
  login: `user-${crypto.randomUUID()}`,
  name: `name-${crypto.randomUUID()}`,
  avatar_url: `https://avatars.githubusercontent.com/u/${crypto.randomUUID()}`,
  bio: `bio-${crypto.randomUUID()}`,
  email: `${crypto.randomUUID()}@mail.com`,
  followers: Math.round(Math.random() * 1000),
  following: Math.round(Math.random() * 1000),
})
