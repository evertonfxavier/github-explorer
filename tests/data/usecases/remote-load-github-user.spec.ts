import { describe, expect, it } from 'vitest'
import { RemoteLoadGithubUser } from '@/data/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubUserApiModelToModel } from '@/data/models'
import type { GithubUserApiModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'
import { HttpGetClientSpy, mockGithubUserApiModel } from '@/tests/data/mocks'

const makeSut = (url = 'https://api.github.com/users/:username') => {
  const httpGetClientSpy = new HttpGetClientSpy<GithubUserApiModel>()
  const sut = new RemoteLoadGithubUser(url, httpGetClientSpy)
  return { sut, httpGetClientSpy }
}

describe('RemoteLoadGithubUser', () => {
  it('should call HttpGetClient with correct URL, replacing the username placeholder', async () => {
    const { sut, httpGetClientSpy } = makeSut('https://api.github.com/users/:username')
    httpGetClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubUserApiModel() }

    await sut.load('diego3g')

    expect(httpGetClientSpy.url).toBe('https://api.github.com/users/diego3g')
  })

  it('should return a GithubUserModel mapped from the api response on success', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const apiModel = mockGithubUserApiModel()
    httpGetClientSpy.response = { statusCode: HttpStatusCode.ok, body: apiModel }

    const user = await sut.load('any_username')

    expect(user).toEqual(mapGithubUserApiModelToModel(apiModel))
  })

  it('should throw NotFoundError if HttpGetClient returns 404', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = { statusCode: HttpStatusCode.notFound }

    await expect(sut.load('any_username')).rejects.toThrow(new NotFoundError())
  })

  it('should throw UnexpectedError if HttpGetClient returns any other status', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = { statusCode: HttpStatusCode.serverError }

    await expect(sut.load('any_username')).rejects.toThrow(new UnexpectedError())
  })
})
