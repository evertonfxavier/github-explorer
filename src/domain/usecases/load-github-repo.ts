import type { GithubRepoModel } from '@/domain/models'

export interface LoadGithubRepo {
  load: (owner: string, name: string) => Promise<GithubRepoModel>
}
