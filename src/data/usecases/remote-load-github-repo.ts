import type { LoadGithubRepo } from '@/domain/usecases'
import type { GithubRepoModel } from '@/domain/models'
import type { HttpGetClient } from '@/data/protocols/http'
import type { GithubRepoApiModel } from '@/data/models'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'

export class RemoteLoadGithubRepo implements LoadGithubRepo {
  private readonly url: string
  private readonly httpGetClient: HttpGetClient<GithubRepoApiModel>

  constructor(url: string, httpGetClient: HttpGetClient<GithubRepoApiModel>) {
    this.url = url
    this.httpGetClient = httpGetClient
  }

  async load(owner: string, name: string): Promise<GithubRepoModel> {
    const httpResponse = await this.httpGetClient.get({
      url: this.url.replace(':owner', owner).replace(':name', name),
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
