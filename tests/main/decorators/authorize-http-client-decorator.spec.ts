import { describe, expect, it } from 'vitest'
import { AuthorizeHttpClientDecorator } from '@/main/decorators'
import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy } from '@/tests/data/mocks'

const makeSut = (token?: string) => {
  const httpClientSpy = new HttpClientSpy()
  const sut = new AuthorizeHttpClientDecorator(httpClientSpy, token)
  return { sut, httpClientSpy }
}

describe('AuthorizeHttpClientDecorator', () => {
  it('should call the decoratee with the same request and no extra headers when no token is provided', async () => {
    const { sut, httpClientSpy } = makeSut()

    await sut.request({ url: 'any_url', method: 'get' })

    expect(httpClientSpy.url).toBe('any_url')
    expect(httpClientSpy.headers).toBeUndefined()
  })

  it('should add an Authorization header with the token when one is provided', async () => {
    const { sut, httpClientSpy } = makeSut('any_token')

    await sut.request({ url: 'any_url', method: 'get' })

    expect(httpClientSpy.headers).toEqual({ Authorization: 'Bearer any_token' })
  })

  it('should preserve existing headers when adding the Authorization header', async () => {
    const { sut, httpClientSpy } = makeSut('any_token')

    await sut.request({ url: 'any_url', method: 'get', headers: { 'X-Custom': 'value' } })

    expect(httpClientSpy.headers).toEqual({ 'X-Custom': 'value', Authorization: 'Bearer any_token' })
  })

  it('should return the same response as the decoratee', async () => {
    const { sut, httpClientSpy } = makeSut('any_token')
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: { any: 'data' } }

    const response = await sut.request({ url: 'any_url', method: 'get' })

    expect(response).toEqual(httpClientSpy.response)
  })
})
