import { describe, expect, it } from 'vitest'
import { RemoteLoadGithubRepo } from '@/data/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import type { GithubRepoApiModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'
import { HttpGetClientSpy, mockGithubRepoApiModel } from '@/tests/data/mocks'

const makeSut = (url = 'https://api.github.com/repos/:owner/:name') => {
  const httpGetClientSpy = new HttpGetClientSpy<GithubRepoApiModel>()
  const sut = new RemoteLoadGithubRepo(url, httpGetClientSpy)
  return { sut, httpGetClientSpy }
}

describe('RemoteLoadGithubRepo', () => {
  it('should call HttpGetClient with correct URL, replacing owner and name placeholders', async () => {
    const { sut, httpGetClientSpy } = makeSut('https://api.github.com/repos/:owner/:name')
    httpGetClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubRepoApiModel() }

    await sut.load('diego3g', 'ignite')

    expect(httpGetClientSpy.url).toBe('https://api.github.com/repos/diego3g/ignite')
  })

  it('should return a GithubRepoModel mapped from the api response on success', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const apiModel = mockGithubRepoApiModel()
    httpGetClientSpy.response = { statusCode: HttpStatusCode.ok, body: apiModel }

    const repo = await sut.load('any_owner', 'any_name')

    expect(repo).toEqual(mapGithubRepoApiModelToModel(apiModel))
  })

  it('should throw NotFoundError if HttpGetClient returns 404', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = { statusCode: HttpStatusCode.notFound }

    await expect(sut.load('any_owner', 'any_name')).rejects.toThrow(new NotFoundError())
  })

  it('should throw UnexpectedError if HttpGetClient returns any other status', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = { statusCode: HttpStatusCode.serverError }

    await expect(sut.load('any_owner', 'any_name')).rejects.toThrow(new UnexpectedError())
  })
})
