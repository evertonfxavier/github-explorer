import type { LoadGithubRepos, LoadGithubReposParams, LoadGithubReposResult, RepoSortOrder } from '@/domain/usecases'
import type { HttpClient } from '@/data/protocols/http'
import type { GithubRepoSearchApiModel } from '@/data/models'
import { HttpStatusCode } from '@/data/protocols/http'
import { mapGithubRepoApiModelToModel } from '@/data/models'
import { NotFoundError, UnexpectedError } from '@/domain/errors'

const SORT_QUERY_PARAMS: Record<RepoSortOrder, { sort: string; order: string }> = {
  'stars-desc': { sort: 'stars', order: 'desc' },
  'stars-asc': { sort: 'stars', order: 'asc' },
  'updated-desc': { sort: 'updated', order: 'desc' },
}

export class RemoteLoadGithubRepos implements LoadGithubRepos {
  private readonly url: string
  private readonly httpClient: HttpClient<GithubRepoSearchApiModel>

  constructor(url: string, httpClient: HttpClient<GithubRepoSearchApiModel>) {
    this.url = url
    this.httpClient = httpClient
  }

  async loadAll(params: LoadGithubReposParams, signal?: AbortSignal): Promise<LoadGithubReposResult> {
    const { username, page, perPage, sortOrder, search } = params
    const { sort, order } = SORT_QUERY_PARAMS[sortOrder]

    const searchTerms = [`user:${username}`]
    if (search) searchTerms.push(`${search} in:name,description`)

    const query = new URLSearchParams({
      q: searchTerms.join(' '),
      sort,
      order,
      page: String(page),
      per_page: String(perPage),
    })

    const httpResponse = await this.httpClient.request({
      url: `${this.url}?${query.toString()}`,
      method: 'get',
      signal,
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: {
        const body = httpResponse.body as GithubRepoSearchApiModel
        return {
          repos: body.items.map(mapGithubRepoApiModelToModel),
          hasMore: page * perPage < body.total_count,
          totalCount: body.total_count,
        }
      }
      case HttpStatusCode.notFound:
        throw new NotFoundError()
      default:
        throw new UnexpectedError()
    }
  }
}
