import { RemoteLoadGithubRepos } from '@/data/usecases'
import type { GithubRepoApiModel } from '@/data/models'
import type { LoadGithubRepos } from '@/domain/usecases'
import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http'

export const makeRemoteLoadGithubRepos = (): LoadGithubRepos =>
  new RemoteLoadGithubRepos(makeApiUrl('/users/:username/repos'), makeAxiosHttpClient<GithubRepoApiModel[]>())
