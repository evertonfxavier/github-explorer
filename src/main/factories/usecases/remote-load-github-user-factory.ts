import { RemoteLoadGithubUser } from '@/data/usecases'
import type { GithubUserApiModel } from '@/data/models'
import type { LoadGithubUser } from '@/domain/usecases'
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'

export const makeRemoteLoadGithubUser = (): LoadGithubUser =>
  new RemoteLoadGithubUser(makeApiUrl('/users/:username'), makeAuthorizeHttpClientDecorator<GithubUserApiModel>())
