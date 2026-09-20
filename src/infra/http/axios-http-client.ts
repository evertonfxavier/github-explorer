import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { HttpClient, HttpRequest, HttpResponse, HttpStatusCode } from '@/data/protocols/http'

export class AxiosHttpClient<R = unknown> implements HttpClient<R> {
  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    let axiosResponse: AxiosResponse<R>

    try {
      axiosResponse = await axios.request<R>({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers,
      })
    } catch (error) {
      axiosResponse = (error as { response: AxiosResponse<R> }).response
    }

    return {
      statusCode: axiosResponse.status as HttpStatusCode,
      body: axiosResponse.data,
    }
  }
}
