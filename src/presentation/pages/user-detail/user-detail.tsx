import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { LoadGithubRepos } from '@/domain/usecases'
import type { GithubRepoModel } from '@/domain/models'
import { useAsync } from '@/presentation/hooks'
import { Loading } from '@/presentation/components/loading'
import { ErrorMessage } from '@/presentation/components/error'
import { RepoList } from './components/repo-list'
import type { RepoSortOrder } from './components/repo-list'

type Props = {
  loadGithubRepos: LoadGithubRepos
}

const SORT_COMPARATORS: Record<RepoSortOrder, (a: GithubRepoModel, b: GithubRepoModel) => number> = {
  'stars-desc': (a, b) => b.stars - a.stars,
  'stars-asc': (a, b) => a.stars - b.stars,
  'forks-desc': (a, b) => b.forksCount - a.forksCount,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name),
  'updated-desc': (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
}

export function UserDetail({ loadGithubRepos }: Props) {
  const { username = '' } = useParams<{ username: string }>()
  const [sortOrder, setSortOrder] = useState<RepoSortOrder>('stars-desc')
  const [searchQuery, setSearchQuery] = useState('')

  const loadRepos = useCallback(() => loadGithubRepos.loadAll(username), [loadGithubRepos, username])
  const repos = useAsync(loadRepos)

  const visibleRepos = useMemo<GithubRepoModel[]>(() => {
    if (!repos.data) return []

    const query = searchQuery.trim().toLowerCase()
    const filtered = query
      ? repos.data.filter(
          repo => repo.name.toLowerCase().includes(query) || repo.description?.toLowerCase().includes(query),
        )
      : repos.data

    return [...filtered].sort(SORT_COMPARATORS[sortOrder])
  }, [repos.data, sortOrder, searchQuery])

  if (repos.loading) return <Loading />
  if (repos.error) return <ErrorMessage error={repos.error} reload={repos.reload} />

  return (
    <main className="px-4 py-6 tablet:px-8 tablet:py-8">
      <RepoList
        username={username}
        repos={visibleRepos}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </main>
  )
}
