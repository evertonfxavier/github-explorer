import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { HttpGetClient, HttpGetParams, HttpResponse, HttpStatusCode } from '@/data/protocols/http'

export class AxiosHttpClient<R = unknown> implements HttpGetClient<R> {
  async get(params: HttpGetParams): Promise<HttpResponse<R>> {
    let axiosResponse: AxiosResponse<R>

    try {
      axiosResponse = await axios.get<R>(params.url)
    } catch (error) {
      axiosResponse = (error as { response: AxiosResponse<R> }).response
    }

    return {
      statusCode: axiosResponse.status as HttpStatusCode,
      body: axiosResponse.data,
    }
  }
}
