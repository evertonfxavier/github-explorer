import type { GithubUserApiModel } from '@/data/models'

export const mockGithubUserApiModel = (): GithubUserApiModel => ({
  login: `user-${crypto.randomUUID()}`,
  name: `name-${crypto.randomUUID()}`,
  avatar_url: `https://avatars.githubusercontent.com/u/${crypto.randomUUID()}`,
  bio: `bio-${crypto.randomUUID()}`,
  email: `${crypto.randomUUID()}@mail.com`,
  company: `company-${crypto.randomUUID()}`,
  location: `location-${crypto.randomUUID()}`,
  blog: `https://${crypto.randomUUID()}.dev`,
  html_url: `https://github.com/user-${crypto.randomUUID()}`,
  created_at: '2020-01-08T12:00:00Z',
  followers: Math.round(Math.random() * 1000),
  following: Math.round(Math.random() * 1000),
  public_repos: Math.round(Math.random() * 100),
})
