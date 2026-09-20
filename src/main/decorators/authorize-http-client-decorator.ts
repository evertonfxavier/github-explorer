import type { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http'

export class AuthorizeHttpClientDecorator<R = unknown> implements HttpClient<R> {
  private readonly httpClient: HttpClient<R>
  private readonly token?: string

  constructor(httpClient: HttpClient<R>, token?: string) {
    this.httpClient = httpClient
    this.token = token
  }

  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    if (!this.token) return this.httpClient.request(data)

    return this.httpClient.request({
      ...data,
      headers: { ...data.headers, Authorization: `Bearer ${this.token}` },
    })
  }
}
