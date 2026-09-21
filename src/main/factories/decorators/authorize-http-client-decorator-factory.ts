import { AuthorizeHttpClientDecorator } from '@/main/decorators'
import { makeAxiosHttpClient } from '@/main/factories/http'
import { makeGithubToken } from '@/main/factories/adapters'
import type { HttpClient } from '@/data/protocols/http'

export const makeAuthorizeHttpClientDecorator = <R = unknown>(): HttpClient<R> => {
  const githubToken = makeGithubToken()
  return new AuthorizeHttpClientDecorator<R>(makeAxiosHttpClient<R>(), () => githubToken.load())
}
