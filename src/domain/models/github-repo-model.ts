export type GithubRepoModel = {
  name: string
  fullName: string
  description: string | null
  stars: number
  language: string | null
  htmlUrl: string
  isPrivate: boolean
  forksCount: number
  openIssuesCount: number
  watchersCount: number
  license: string | null
  defaultBranch: string
  createdAt: string
  updatedAt: string
  sizeKb: number
  cloneUrl: string
}
