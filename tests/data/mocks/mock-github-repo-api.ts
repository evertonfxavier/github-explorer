import type { GithubRepoApiModel } from '@/data/models'

export const mockGithubRepoApiModel = (): GithubRepoApiModel => {
  const uuid = crypto.randomUUID()

  return {
    name: `repo-${uuid}`,
    full_name: `owner/repo-${uuid}`,
    description: `description-${uuid}`,
    stargazers_count: Math.round(Math.random() * 1000),
    language: 'TypeScript',
    html_url: `https://github.com/owner/repo-${uuid}`,
  }
}

export const mockGithubReposApiModel = (): GithubRepoApiModel[] => [
  mockGithubRepoApiModel(),
  mockGithubRepoApiModel(),
]
