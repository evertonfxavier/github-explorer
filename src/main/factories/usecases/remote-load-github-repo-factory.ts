import { RemoteLoadGithubRepo } from '@/data/usecases'
import type { GithubRepoApiModel } from '@/data/models'
import type { LoadGithubRepo } from '@/domain/usecases'
import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http'

export const makeRemoteLoadGithubRepo = (): LoadGithubRepo =>
  new RemoteLoadGithubRepo(makeApiUrl('/repos/:owner/:name'), makeAxiosHttpClient<GithubRepoApiModel>())
