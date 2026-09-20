import { AxiosHttpClient } from '@/infra/http'
import type { HttpClient } from '@/data/protocols/http'
import { AuthorizeHttpClientDecorator } from '@/main/decorators'

export const makeAxiosHttpClient = <R = unknown>(): HttpClient<R> =>
  new AuthorizeHttpClientDecorator<R>(new AxiosHttpClient<R>(), import.meta.env.VITE_GITHUB_API_TOKEN)
