import type { GithubUserModel } from '@/domain/models'

export const mockGithubUserModel = (): GithubUserModel => ({
  login: `user-${crypto.randomUUID()}`,
  name: `name-${crypto.randomUUID()}`,
  avatarUrl: `https://avatars.githubusercontent.com/u/${crypto.randomUUID()}`,
  bio: `bio-${crypto.randomUUID()}`,
  email: `${crypto.randomUUID()}@mail.com`,
  company: `company-${crypto.randomUUID()}`,
  location: `location-${crypto.randomUUID()}`,
  blog: `https://${crypto.randomUUID()}.dev`,
  htmlUrl: `https://github.com/user-${crypto.randomUUID()}`,
  createdAt: '2020-01-08T12:00:00Z',
  followers: Math.round(Math.random() * 1000),
  following: Math.round(Math.random() * 1000),
  publicRepos: Math.round(Math.random() * 100),
})
