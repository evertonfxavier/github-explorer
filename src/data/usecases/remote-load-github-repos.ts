import type { LoadGithubRepos } from '@/domain/usecases'
import type { GithubRepoModel } from '@/domain/models'
import type { HttpClient } from '@/data/protocols/http'
import type { GithubRepoApiModel } from '@/data/models'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'

export class RemoteLoadGithubRepos implements LoadGithubRepos {
  private readonly url: string
  private readonly httpClient: HttpClient<GithubRepoApiModel[]>

  constructor(url: string, httpClient: HttpClient<GithubRepoApiModel[]>) {
    this.url = url
    this.httpClient = httpClient
  }

  async loadAll(username: string): Promise<GithubRepoModel[]> {
    const httpResponse = await this.httpClient.request({
      url: this.url.replace(':username', username),
      method: 'get',
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return (httpResponse.body as GithubRepoApiModel[])
          .map(mapGithubRepoApiModelToModel)
          .sort((a, b) => b.stars - a.stars)
      case HttpStatusCode.notFound:
        throw new NotFoundError()
      default:
        throw new UnexpectedError()
    }
  }
}
