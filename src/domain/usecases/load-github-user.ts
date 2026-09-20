import type { GithubUserModel } from '@/domain/models'

export interface LoadGithubUser {
  load: (username: string) => Promise<GithubUserModel>
}
