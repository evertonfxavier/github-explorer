export type GithubUserModel = {
  login: string
  name: string | null
  avatarUrl: string
  bio: string | null
  email: string | null
  followers: number
  following: number
}
