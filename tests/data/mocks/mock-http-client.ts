import type { HttpGetClient, HttpGetParams, HttpResponse } from '@/data/protocols/http'
import { HttpStatusCode } from '@/data/protocols/http'

export class HttpGetClientSpy<R = unknown> implements HttpGetClient<R> {
  url?: string
  response: HttpResponse<R> = { statusCode: HttpStatusCode.ok }

  async get(params: HttpGetParams): Promise<HttpResponse<R>> {
    this.url = params.url
    return this.response
  }
}
