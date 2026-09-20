import type { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http'
import { HttpStatusCode } from '@/data/protocols/http'

export class HttpClientSpy<R = unknown> implements HttpClient<R> {
  url?: string
  method?: HttpRequest['method']
  headers?: Record<string, string>
  response: HttpResponse<R> = { statusCode: HttpStatusCode.ok }

  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    this.url = data.url
    this.method = data.method
    this.headers = data.headers
    return this.response
  }
}
