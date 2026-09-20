import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInfiniteRepos } from '@/presentation/pages/user-detail/hooks/use-infinite-repos'
import { LoadGithubReposSpy } from '@/tests/presentation/mocks'
import { UnexpectedError } from '@/domain/errors'
import { mockGithubRepoModel, mockGithubReposModel } from '@/tests/domain/mocks'
import type { LoadGithubRepos, LoadGithubReposResult } from '@/domain/usecases'

function InfiniteReposHarness({
  loadGithubRepos,
  username,
}: {
  loadGithubRepos: LoadGithubReposSpy
  username: string
}) {
  const { repos, hasMore, loading, loadingMore, sentinelRef } = useInfiniteRepos({ loadGithubRepos, username })
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="loading-more">{String(loadingMore)}</span>
      <pre data-testid="repos-json">{JSON.stringify(repos)}</pre>
      {hasMore && <div ref={sentinelRef} data-testid="sentinel-harness" />}
    </div>
  )
}

let capturedCallback: IntersectionObserverCallback | null = null

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    capturedCallback = callback
  }

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = (): IntersectionObserverEntry[] => []
}

const triggerIntersection = (): void => {
  capturedCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
}

describe('useInfiniteRepos', () => {
  beforeEach(() => {
    capturedCallback = null
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('should load the first page on mount with the default sort order', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    const { result } = renderHook(() => useInfiniteRepos({ loadGithubRepos, username: 'diego3g' }))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(loadGithubRepos.params).toEqual({
      username: 'diego3g',
      page: 1,
      perPage: 10,
      sortOrder: 'stars-desc',
      search: undefined,
    })
    expect(result.current.repos).toEqual(loadGithubRepos.result.repos)
  })

  it('should expose an error message when the load fails', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    loadGithubRepos.error = new UnexpectedError()
    const { result } = renderHook(() => useInfiniteRepos({ loadGithubRepos, username: 'diego3g' }))

    await waitFor(() => expect(result.current.error).toBe('Algo deu errado. Tente novamente.'))
    expect(result.current.loading).toBe(false)
  })

  it('should immediately fetch page 1 with the new sort order when changeSortOrder is called', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    const { result } = renderHook(() => useInfiniteRepos({ loadGithubRepos, username: 'diego3g' }))
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.changeSortOrder('forks-desc')
    })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(loadGithubRepos.params).toMatchObject({ page: 1, sortOrder: 'forks-desc' })
  })

  it('should debounce changeSearchQuery before fetching, using the searching flag instead of loading', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const loadGithubRepos = new LoadGithubReposSpy()
    const { result } = renderHook(() => useInfiniteRepos({ loadGithubRepos, username: 'diego3g' }))
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.changeSearchQuery('ig')
    })
    act(() => {
      result.current.changeSearchQuery('ignite')
    })

    expect(loadGithubRepos.callCount).toBe(1)
    expect(result.current.loading).toBe(false)

    act(() => {
      vi.advanceTimersByTime(400)
    })

    await vi.waitFor(() => expect(loadGithubRepos.callCount).toBe(2))
    expect(loadGithubRepos.params).toMatchObject({ page: 1, search: 'ignite' })
    expect(result.current.loading).toBe(false)
    await vi.waitFor(() => expect(result.current.searching).toBe(false))
  })

  it('should discard the result of a request superseded by a newer one, using AbortController to cancel it', async () => {
    const resolvers: Array<(result: LoadGithubReposResult) => void> = []
    const loadGithubRepos: LoadGithubRepos = {
      loadAll: (_params, signal) =>
        new Promise(resolve => {
          resolvers.push(resolve)
          signal?.addEventListener('abort', () => {
            expect(signal.aborted).toBe(true)
          })
        }),
    }

    const { result } = renderHook(() => useInfiniteRepos({ loadGithubRepos, username: 'diego3g' }))
    await waitFor(() => expect(resolvers).toHaveLength(1))

    act(() => {
      result.current.changeSortOrder('forks-desc')
    })
    await waitFor(() => expect(resolvers).toHaveLength(2))

    const staleResult = { repos: [mockGithubRepoModel()], hasMore: false, totalCount: 1 }
    const freshResult = { repos: [mockGithubRepoModel()], hasMore: false, totalCount: 1 }

    act(() => {
      resolvers[1](freshResult)
    })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.repos).toEqual(freshResult.repos)

    act(() => {
      resolvers[0](staleResult)
    })

    expect(result.current.repos).toEqual(freshResult.repos)
  })

  it('should load the next page and append results when the sentinel intersects', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    const firstPage = mockGithubReposModel()
    loadGithubRepos.result = { repos: firstPage, hasMore: true, totalCount: 3 }

    render(<InfiniteReposHarness loadGithubRepos={loadGithubRepos} username="diego3g" />)

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))
    await waitFor(() => expect(screen.getByTestId('sentinel-harness')).toBeInTheDocument())

    const secondPage = [firstPage[0]]
    loadGithubRepos.result = { repos: secondPage, hasMore: false, totalCount: 3 }

    act(() => {
      triggerIntersection()
    })

    await waitFor(() => expect(screen.getByTestId('loading-more')).toHaveTextContent('false'))

    expect(JSON.parse(screen.getByTestId('repos-json').textContent ?? '[]')).toEqual([...firstPage, ...secondPage])
    expect(loadGithubRepos.params).toMatchObject({ page: 2 })
  })

  it('should call onTotalCountChange with the unfiltered total on load, but not while a search filter is active', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    loadGithubRepos.result = { repos: mockGithubReposModel(), hasMore: false, totalCount: 42 }
    const onTotalCountChange = vi.fn()
    const { result } = renderHook(() => useInfiniteRepos({ loadGithubRepos, username: 'diego3g', onTotalCountChange }))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(onTotalCountChange).toHaveBeenCalledWith(42)

    onTotalCountChange.mockClear()
    loadGithubRepos.result = { repos: [], hasMore: false, totalCount: 1 }

    act(() => {
      result.current.changeSearchQuery('ignite')
    })

    await waitFor(() => expect(result.current.searching).toBe(false))
    expect(onTotalCountChange).not.toHaveBeenCalled()
  })

  it('should refetch page 1 with current params when retry is called', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    loadGithubRepos.error = new UnexpectedError()
    const { result } = renderHook(() => useInfiniteRepos({ loadGithubRepos, username: 'diego3g' }))
    await waitFor(() => expect(result.current.error).toBeDefined())

    loadGithubRepos.error = undefined

    act(() => {
      result.current.retry()
    })

    await waitFor(() => expect(result.current.error).toBeUndefined())
    expect(result.current.repos).toEqual(loadGithubRepos.result.repos)
  })
})
