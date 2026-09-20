import { RemoteLoadGithubUser } from '@/data/usecases'
import type { GithubUserApiModel } from '@/data/models'
import type { LoadGithubUser } from '@/domain/usecases'
import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http'

export const makeRemoteLoadGithubUser = (): LoadGithubUser =>
  new RemoteLoadGithubUser(makeApiUrl('/users/:username'), makeAxiosHttpClient<GithubUserApiModel>())
