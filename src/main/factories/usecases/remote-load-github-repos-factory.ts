import { RemoteLoadGithubRepos } from '@/data/usecases'
import type { GithubRepoSearchApiModel } from '@/data/models'
import type { LoadGithubRepos } from '@/domain/usecases'
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'

export const makeRemoteLoadGithubRepos = (): LoadGithubRepos =>
  new RemoteLoadGithubRepos(
    makeApiUrl('/search/repositories'),
    makeAuthorizeHttpClientDecorator<GithubRepoSearchApiModel>(),
  )
