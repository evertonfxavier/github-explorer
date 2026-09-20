import type { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http'

export class AuthorizeHttpClientDecorator<R = unknown> implements HttpClient<R> {
  private readonly httpClient: HttpClient<R>
  private readonly getToken: () => string | undefined

  constructor(httpClient: HttpClient<R>, getToken: () => string | undefined) {
    this.httpClient = httpClient
    this.getToken = getToken
  }

  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    const token = this.getToken()
    if (!token) return this.httpClient.request(data)

    return this.httpClient.request({
      ...data,
      headers: { ...data.headers, Authorization: `Bearer ${token}` },
    })
  }
}
