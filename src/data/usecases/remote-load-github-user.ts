import type { LoadGithubUser } from '@/domain/usecases'
import type { GithubUserModel } from '@/domain/models'
import type { HttpClient } from '@/data/protocols/http'
import type { GithubUserApiModel } from '@/data/models'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubUserApiModelToModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'

export class RemoteLoadGithubUser implements LoadGithubUser {
  private readonly url: string
  private readonly httpClient: HttpClient<GithubUserApiModel>

  constructor(url: string, httpClient: HttpClient<GithubUserApiModel>) {
    this.url = url
    this.httpClient = httpClient
  }

  async load(username: string): Promise<GithubUserModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url.replace(':username', username),
      method: 'get',
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
