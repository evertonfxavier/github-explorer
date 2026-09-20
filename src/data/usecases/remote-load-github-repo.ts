import type { LoadGithubRepo } from '@/domain/usecases'
import type { GithubRepoModel } from '@/domain/models'
import type { HttpClient } from '@/data/protocols/http'
import type { GithubRepoApiModel } from '@/data/models'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'

export class RemoteLoadGithubRepo implements LoadGithubRepo {
  private readonly url: string
  private readonly httpClient: HttpClient<GithubRepoApiModel>

  constructor(url: string, httpClient: HttpClient<GithubRepoApiModel>) {
    this.url = url
    this.httpClient = httpClient
  }

  async load(owner: string, name: string): Promise<GithubRepoModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url.replace(':owner', owner).replace(':name', name),
      method: 'get',
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return mapGithubRepoApiModelToModel(httpResponse.body as GithubRepoApiModel)
      case HttpStatusCode.notFound:
        throw new NotFoundError()
      default:
        throw new UnexpectedError()
    }
  }
}
