import { RemoteLoadGithubRepo } from '@/data/usecases'
import type { GithubRepoApiModel } from '@/data/models'
import type { LoadGithubRepo } from '@/domain/usecases'
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'

export const makeRemoteLoadGithubRepo = (): LoadGithubRepo =>
  new RemoteLoadGithubRepo(makeApiUrl('/repos/:owner/:name'), makeAuthorizeHttpClientDecorator<GithubRepoApiModel>())
