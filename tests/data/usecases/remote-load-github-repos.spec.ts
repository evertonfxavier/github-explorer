import { describe, expect, it } from 'vitest'
import { RemoteLoadGithubRepos } from '@/data/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import type { GithubRepoApiModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'
import { HttpGetClientSpy, mockGithubReposApiModel } from '@/tests/data/mocks'

const makeSut = (url = 'https://api.github.com/users/:username/repos') => {
  const httpGetClientSpy = new HttpGetClientSpy<GithubRepoApiModel[]>()
  const sut = new RemoteLoadGithubRepos(url, httpGetClientSpy)
  return { sut, httpGetClientSpy }
}

describe('RemoteLoadGithubRepos', () => {
  it('should call HttpGetClient with correct URL, replacing the username placeholder', async () => {
    const { sut, httpGetClientSpy } = makeSut('https://api.github.com/users/:username/repos')
    httpGetClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubReposApiModel() }

    await sut.loadAll('diego3g')

    expect(httpGetClientSpy.url).toBe('https://api.github.com/users/diego3g/repos')
  })

  it('should return repos mapped and sorted by stars descending', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const apiModels = mockGithubReposApiModel()
    apiModels[0].stargazers_count = 10
    apiModels[1].stargazers_count = 100
    httpGetClientSpy.response = { statusCode: HttpStatusCode.ok, body: apiModels }

    const repos = await sut.loadAll('any_username')

    expect(repos).toEqual([
      mapGithubRepoApiModelToModel(apiModels[1]),
      mapGithubRepoApiModelToModel(apiModels[0]),
    ])
  })

  it('should throw NotFoundError if HttpGetClient returns 404', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = { statusCode: HttpStatusCode.notFound }

    await expect(sut.loadAll('any_username')).rejects.toThrow(new NotFoundError())
  })

  it('should throw UnexpectedError if HttpGetClient returns any other status', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = { statusCode: HttpStatusCode.serverError }

    await expect(sut.loadAll('any_username')).rejects.toThrow(new UnexpectedError())
  })
})
