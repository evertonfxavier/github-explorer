import { useCallback, useEffect, useRef, useState } from 'react'
import type { GithubRepoModel } from '@/domain/models'
import type { LoadGithubRepos, LoadGithubReposParams, RepoSortOrder } from '@/domain/usecases'

const PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 400
const DEFAULT_SORT_ORDER: RepoSortOrder = 'stars-desc'

type Params = {
  loadGithubRepos: LoadGithubRepos
  username: string
  onTotalCountChange?: (totalCount: number) => void
}

export function useInfiniteRepos({ loadGithubRepos, username, onTotalCountChange }: Params) {
  const [repos, setRepos] = useState<GithubRepoModel[]>([])
  const [sortOrder, setSortOrderState] = useState<RepoSortOrder>(DEFAULT_SORT_ORDER)
  const [searchQuery, setSearchQueryState] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string>()

  const pageRef = useRef(1)
  const loadingMoreRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchPage = useCallback(
    (page: number, order: RepoSortOrder, search: string, onSettled?: () => void) => {
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      const params: LoadGithubReposParams = {
        username,
        page,
        perPage: PER_PAGE,
        sortOrder: order,
        search: search.trim() || undefined,
      }

      return loadGithubRepos
        .loadAll(params, controller.signal)
        .then(result => {
          if (controller.signal.aborted) return
          pageRef.current = page
          setRepos(prev => (page === 1 ? result.repos : [...prev, ...result.repos]))
          setHasMore(result.hasMore)
          setError(undefined)
          if (!search.trim()) onTotalCountChange?.(result.totalCount)
        })
        .catch((err: Error) => {
          if (controller.signal.aborted) return
          setError(err.message)
        })
        .finally(() => {
          if (!controller.signal.aborted) onSettled?.()
        })
    },
    [loadGithubRepos, username, onTotalCountChange],
  )

  useEffect(() => {
    fetchPage(1, DEFAULT_SORT_ORDER, '', () => setLoading(false))
  }, [fetchPage])

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      abortControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && !loadingMoreRef.current) {
          loadingMoreRef.current = true
          setLoadingMore(true)
          fetchPage(pageRef.current + 1, sortOrder, searchQuery).finally(() => {
            loadingMoreRef.current = false
            setLoadingMore(false)
          })
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchPage, sortOrder, searchQuery, hasMore])

  const changeSortOrder = useCallback(
    (order: RepoSortOrder) => {
      setSortOrderState(order)
      setLoading(true)
      setRepos([])
      fetchPage(1, order, searchQuery, () => setLoading(false))
    },
    [fetchPage, searchQuery],
  )

  const changeSearchQuery = useCallback(
    (query: string) => {
      setSearchQueryState(query)
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = setTimeout(() => {
        setSearching(true)
        fetchPage(1, sortOrder, query, () => setSearching(false))
      }, SEARCH_DEBOUNCE_MS)
    },
    [fetchPage, sortOrder],
  )

  const retry = useCallback(() => {
    setLoading(true)
    fetchPage(1, sortOrder, searchQuery, () => setLoading(false))
  }, [fetchPage, sortOrder, searchQuery])

  return {
    repos,
    sortOrder,
    searchQuery,
    hasMore,
    loading,
    loadingMore,
    searching,
    error,
    sentinelRef,
    changeSortOrder,
    changeSearchQuery,
    retry,
  }
}
