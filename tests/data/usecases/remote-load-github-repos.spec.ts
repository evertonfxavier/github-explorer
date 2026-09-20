import { describe, expect, it } from 'vitest'
import { RemoteLoadGithubRepos } from '@/data/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import type { GithubRepoSearchApiModel } from '@/data/models'
import type { LoadGithubReposParams } from '@/domain/usecases'
import { NotFoundError, UnexpectedError } from '@/domain/errors'
import { HttpClientSpy, mockGithubRepoSearchApiModel } from '@/tests/data/mocks'

const makeSut = (url = 'https://api.github.com/search/repositories') => {
  const httpClientSpy = new HttpClientSpy<GithubRepoSearchApiModel>()
  const sut = new RemoteLoadGithubRepos(url, httpClientSpy)
  return { sut, httpClientSpy }
}

const makeParams = (overrides: Partial<LoadGithubReposParams> = {}): LoadGithubReposParams => ({
  username: 'diego3g',
  page: 1,
  perPage: 10,
  sortOrder: 'stars-desc',
  ...overrides,
})

describe('RemoteLoadGithubRepos', () => {
  it('should call HttpClient with a GET request including user, sort, order, page and per_page', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubRepoSearchApiModel() }

    await sut.loadAll(makeParams({ page: 2, perPage: 10, sortOrder: 'forks-desc' }))

    expect(httpClientSpy.method).toBe('get')
    const url = new URL(httpClientSpy.url as string)
    expect(url.origin + url.pathname).toBe('https://api.github.com/search/repositories')
    expect(url.searchParams.get('q')).toBe('user:diego3g')
    expect(url.searchParams.get('sort')).toBe('forks')
    expect(url.searchParams.get('order')).toBe('desc')
    expect(url.searchParams.get('page')).toBe('2')
    expect(url.searchParams.get('per_page')).toBe('10')
  })

  it('should include the search term restricted to name and description when provided', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubRepoSearchApiModel() }

    await sut.loadAll(makeParams({ search: 'ignite' }))

    const url = new URL(httpClientSpy.url as string)
    expect(url.searchParams.get('q')).toBe('user:diego3g ignite in:name,description')
  })

  it('should map sort orders to the correct GitHub search sort/order query values', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubRepoSearchApiModel() }

    await sut.loadAll(makeParams({ sortOrder: 'stars-asc' }))

    const url = new URL(httpClientSpy.url as string)
    expect(url.searchParams.get('sort')).toBe('stars')
    expect(url.searchParams.get('order')).toBe('asc')
  })

  it('should return repos mapped from the search response items', async () => {
    const { sut, httpClientSpy } = makeSut()
    const body = mockGithubRepoSearchApiModel()
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body }

    const result = await sut.loadAll(makeParams())

    expect(result.repos).toEqual(body.items.map(mapGithubRepoApiModelToModel))
  })

  it('should return hasMore true when there are more results beyond the current page', async () => {
    const { sut, httpClientSpy } = makeSut()
    const body = mockGithubRepoSearchApiModel(25)
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body }

    const result = await sut.loadAll(makeParams({ page: 1, perPage: 10 }))

    expect(result.hasMore).toBe(true)
  })

  it('should return hasMore false when the current page reaches the total count', async () => {
    const { sut, httpClientSpy } = makeSut()
    const body = mockGithubRepoSearchApiModel(20)
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body }

    const result = await sut.loadAll(makeParams({ page: 2, perPage: 10 }))

    expect(result.hasMore).toBe(false)
  })

  it('should forward the given AbortSignal to the HttpClient', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.ok, body: mockGithubRepoSearchApiModel() }
    const controller = new AbortController()

    await sut.loadAll(makeParams(), controller.signal)

    expect(httpClientSpy.signal).toBe(controller.signal)
  })

  it('should throw NotFoundError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.notFound }

    await expect(sut.loadAll(makeParams())).rejects.toThrow(new NotFoundError())
  })

  it('should throw UnexpectedError if HttpClient returns any other status', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = { statusCode: HttpStatusCode.serverError }

    await expect(sut.loadAll(makeParams())).rejects.toThrow(new UnexpectedError())
  })
})
