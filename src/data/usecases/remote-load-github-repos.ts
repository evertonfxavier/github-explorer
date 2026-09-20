import type { LoadGithubRepos } from '@/domain/usecases'
import type { GithubRepoModel } from '@/domain/models'
import type { HttpGetClient } from '@/data/protocols/http'
import type { GithubRepoApiModel } from '@/data/models'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'

export class RemoteLoadGithubRepos implements LoadGithubRepos {
  private readonly url: string
  private readonly httpGetClient: HttpGetClient<GithubRepoApiModel[]>

  constructor(url: string, httpGetClient: HttpGetClient<GithubRepoApiModel[]>) {
    this.url = url
    this.httpGetClient = httpGetClient
  }

  async loadAll(username: string): Promise<GithubRepoModel[]> {
    const httpResponse = await this.httpGetClient.get({
      url: this.url.replace(':username', username),
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
