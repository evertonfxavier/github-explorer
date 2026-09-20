import { AuthorizeHttpClientDecorator } from '@/main/decorators'
import { makeAxiosHttpClient } from '@/main/factories/http'
import type { HttpClient } from '@/data/protocols/http'

export const makeAuthorizeHttpClientDecorator = <R = unknown>(): HttpClient<R> =>
  new AuthorizeHttpClientDecorator<R>(makeAxiosHttpClient<R>(), import.meta.env.VITE_GITHUB_API_TOKEN)
