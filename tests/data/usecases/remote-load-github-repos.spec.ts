import { describe, expect, it } from 'vitest'
import { RemoteLoadGithubRepos } from '@/data/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import type { GithubRepoApiModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'
import { HttpClientSpy, mockGithubReposApiModel } from '@/tests/data/mocks'

const makeSut = (url = 'https://api.github.com/users/:username/repos') => {
  const httpClientSpy = new HttpClientSpy<GithubRepoApiModel[]>()
  const sut = new RemoteLoadGithubRepos(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteLoadGithubRepos', () => {
  it('should call HttpClient with a GET request to the correct URL, replacing the username placeholder', async () => {
    const { sut, httpClientSpy } = makeSut('https://api.github.com/users/:username/repos')
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubReposApiModel() }

    await sut.loadAll('diego3g')

    expect(httpClientSpy.url).toBe('https://api.github.com/users/diego3g/repos')
    expect(httpClientSpy.method).toBe('get')
  })

  it('should return repos mapped and sorted by stars descending', async () => {
    const { sut, httpClientSpy } = makeSut()
    const apiModels = mockGithubReposApiModel()
    apiModels[0].stargazers_count = 10
    apiModels[1].stargazers_count = 100
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: apiModels }

    const repos = await sut.loadAll('any_username')

    expect(repos).toEqual([
      mapGithubRepoApiModelToModel(apiModels[1]),
      mapGithubRepoApiModelToModel(apiModels[0]),
    ])
  })

  it('should throw NotFoundError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.notFound }

    await expect(sut.loadAll('any_username')).rejects.toThrow(new NotFoundError())
  })

  it('should throw UnexpectedError if HttpClient returns any other status', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.serverError }

    await expect(sut.loadAll('any_username')).rejects.toThrow(new UnexpectedError())
  })
})
