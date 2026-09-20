import { RemoteLoadGithubRepos } from '@/data/usecases'
import type { GithubRepoApiModel } from '@/data/models'
import type { LoadGithubRepos } from '@/domain/usecases'
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'

export const makeRemoteLoadGithubRepos = (): LoadGithubRepos =>
  new RemoteLoadGithubRepos(makeApiUrl('/users/:username/repos'), makeAuthorizeHttpClientDecorator<GithubRepoApiModel[]>())
