import type { GithubRepoModel } from '@/domain/models'

export const mockGithubRepoModel = (): GithubRepoModel => {
  const uuid = crypto.randomUUID()

  return {
    name: `repo-${uuid}`,
    fullName: `owner/repo-${uuid}`,
    description: `description-${uuid}`,
    stars: Math.round(Math.random() * 1000),
    language: 'TypeScript',
    htmlUrl: `https://github.com/owner/repo-${uuid}`,
  }
}

export const mockGithubReposModel = (): GithubRepoModel[] => [mockGithubRepoModel(), mockGithubRepoModel()]
