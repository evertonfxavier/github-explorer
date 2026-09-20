export type GithubUserModel = {
  login: string
  name: string | null
  avatarUrl: string
  bio: string | null
  email: string | null
  company: string | null
  location: string | null
  blog: string | null
  htmlUrl: string
  createdAt: string
  followers: number
  following: number
  publicRepos: number
}
