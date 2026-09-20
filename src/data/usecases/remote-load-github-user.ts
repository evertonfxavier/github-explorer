import type { LoadGithubUser } from '@/domain/usecases'
import type { GithubUserModel } from '@/domain/models'
import type { HttpGetClient } from '@/data/protocols/http'
import type { GithubUserApiModel } from '@/data/models'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubUserApiModelToModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'

export class RemoteLoadGithubUser implements LoadGithubUser {
  private readonly url: string
  private readonly httpGetClient: HttpGetClient<GithubUserApiModel>

  constructor(url: string, httpGetClient: HttpGetClient<GithubUserApiModel>) {
    this.url = url
    this.httpGetClient = httpGetClient
  }

  async load(username: string): Promise<GithubUserModel> {
    const httpResponse = await this.httpGetClient.get({
      url: this.url.replace(':username', username),
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return mapGithubUserApiModelToModel(httpResponse.body as GithubUserApiModel)
      case HttpStatusCode.notFound:
        throw new NotFoundError()
      default:
        throw new UnexpectedError()
    }
  }
}
