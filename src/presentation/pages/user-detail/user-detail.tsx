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

export function UserDetail({ loadGithubRepos }: Props) {
  const { username = '' } = useParams<{ username: string }>()
  const [sortOrder, setSortOrder] = useState<RepoSortOrder>('stars-desc')

  const loadRepos = useCallback(() => loadGithubRepos.loadAll(username), [loadGithubRepos, username])
  const repos = useAsync(loadRepos)

  const sortedRepos = useMemo<GithubRepoModel[]>(() => {
    if (!repos.data) return []
    const sorted = [...repos.data]
    return sortOrder === 'stars-asc'
      ? sorted.sort((a, b) => a.stars - b.stars)
      : sorted.sort((a, b) => b.stars - a.stars)
  }, [repos.data, sortOrder])

  if (repos.loading) return <Loading />
  if (repos.error) return <ErrorMessage error={repos.error} reload={repos.reload} />

  return (
    <main className="px-4 py-6 tablet:px-8 tablet:py-8">
      <RepoList username={username} repos={sortedRepos} sortOrder={sortOrder} onSortOrderChange={setSortOrder} />
    </main>
  )
}
