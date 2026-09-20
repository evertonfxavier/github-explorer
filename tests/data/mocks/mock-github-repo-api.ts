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
    private: false,
    forks_count: Math.round(Math.random() * 100),
    open_issues_count: Math.round(Math.random() * 20),
    watchers_count: Math.round(Math.random() * 1000),
    license: { name: 'MIT License' },
    default_branch: 'main',
    created_at: '2021-08-05T12:00:00Z',
    updated_at: '2021-08-15T12:00:00Z',
    size: 233,
    clone_url: `https://github.com/owner/repo-${uuid}.git`,
  }
}

export const mockGithubReposApiModel = (): GithubRepoApiModel[] => [
  mockGithubRepoApiModel(),
  mockGithubRepoApiModel(),
]
