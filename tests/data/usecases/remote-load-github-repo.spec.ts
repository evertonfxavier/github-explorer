import { describe, expect, it } from 'vitest'
import { RemoteLoadGithubRepo } from '@/data/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import type { GithubRepoApiModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'
import { HttpClientSpy, mockGithubRepoApiModel } from '@/tests/data/mocks'

const makeSut = (url = 'https://api.github.com/repos/:owner/:name') => {
  const httpClientSpy = new HttpClientSpy<GithubRepoApiModel>()
  const sut = new RemoteLoadGithubRepo(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteLoadGithubRepo', () => {
  it('should call HttpClient with a GET request to the correct URL, replacing owner and name placeholders', async () => {
    const { sut, httpClientSpy } = makeSut('https://api.github.com/repos/:owner/:name')
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubRepoApiModel() }

    await sut.load('diego3g', 'ignite')

    expect(httpClientSpy.url).toBe('https://api.github.com/repos/diego3g/ignite')
    expect(httpClientSpy.method).toBe('get')
  })

  it('should return a GithubRepoModel mapped from the api response on success', async () => {
    const { sut, httpClientSpy } = makeSut()
    const apiModel = mockGithubRepoApiModel()
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: apiModel }

    const repo = await sut.load('any_owner', 'any_name')

    expect(repo).toEqual(mapGithubRepoApiModelToModel(apiModel))
  })

  it('should throw NotFoundError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.notFound }

    await expect(sut.load('any_owner', 'any_name')).rejects.toThrow(new NotFoundError())
  })

  it('should throw UnexpectedError if HttpClient returns any other status', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.serverError }

    await expect(sut.load('any_owner', 'any_name')).rejects.toThrow(new UnexpectedError())
  })
})
