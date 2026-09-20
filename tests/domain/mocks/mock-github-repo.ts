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
    isPrivate: false,
    forksCount: Math.round(Math.random() * 100),
    openIssuesCount: Math.round(Math.random() * 20),
    watchersCount: Math.round(Math.random() * 1000),
    license: 'MIT License',
    defaultBranch: 'main',
    createdAt: '2021-08-05T12:00:00Z',
    updatedAt: '2021-08-15T12:00:00Z',
    sizeKb: 233,
    cloneUrl: `https://github.com/owner/repo-${uuid}.git`,
  }
}

export const mockGithubReposModel = (): GithubRepoModel[] => [mockGithubRepoModel(), mockGithubRepoModel()]
