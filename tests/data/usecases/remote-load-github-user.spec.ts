import { describe, expect, it } from 'vitest'
import { RemoteLoadGithubUser } from '@/data/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubUserApiModelToModel } from '@/data/models'
import type { GithubUserApiModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'
import { HttpClientSpy, mockGithubUserApiModel } from '@/tests/data/mocks'

const makeSut = (url = 'https://api.github.com/users/:username') => {
  const httpClientSpy = new HttpClientSpy<GithubUserApiModel>()
  const sut = new RemoteLoadGithubUser(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteLoadGithubUser', () => {
  it('should call HttpClient with a GET request to the correct URL, replacing the username placeholder', async () => {
    const { sut, httpClientSpy } = makeSut('https://api.github.com/users/:username')
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubUserApiModel() }

    await sut.load('diego3g')

    expect(httpClientSpy.url).toBe('https://api.github.com/users/diego3g')
    expect(httpClientSpy.method).toBe('get')
  })

  it('should return a GithubUserModel mapped from the api response on success', async () => {
    const { sut, httpClientSpy } = makeSut()
    const apiModel = mockGithubUserApiModel()
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: apiModel }

    const user = await sut.load('any_username')

    expect(user).toEqual(mapGithubUserApiModelToModel(apiModel))
  })

  it('should throw NotFoundError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.notFound }

    await expect(sut.load('any_username')).rejects.toThrow(new NotFoundError())
  })

  it('should throw UnexpectedError if HttpClient returns any other status', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.serverError }

    await expect(sut.load('any_username')).rejects.toThrow(new UnexpectedError())
  })
})
