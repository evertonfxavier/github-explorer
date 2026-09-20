import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { LoadGithubRepos, LoadGithubUser } from '@/domain/usecases'
import type { GithubRepoModel } from '@/domain/models'
import { useAsync } from '@/presentation/hooks'
import { Loading } from '@/presentation/components/loading'
import { ErrorMessage } from '@/presentation/components/error'
import { UserInfo } from '@/presentation/components/user-info'
import { RepoList } from '@/presentation/components/repo-list'
import type { RepoSortOrder } from '@/presentation/components/repo-list'

type Props = {
  loadGithubUser: LoadGithubUser
  loadGithubRepos: LoadGithubRepos
}

export function UserDetail({ loadGithubUser, loadGithubRepos }: Props) {
  const { username = '' } = useParams<{ username: string }>()
  const [sortOrder, setSortOrder] = useState<RepoSortOrder>('stars-desc')

  const loadUser = useCallback(() => loadGithubUser.load(username), [loadGithubUser, username])
  const loadRepos = useCallback(() => loadGithubRepos.loadAll(username), [loadGithubRepos, username])

  const user = useAsync(loadUser)
  const repos = useAsync(loadRepos)

  const sortedRepos = useMemo<GithubRepoModel[]>(() => {
    if (!repos.data) return []
    const sorted = [...repos.data]
    return sortOrder === 'stars-asc'
      ? sorted.sort((a, b) => a.stars - b.stars)
      : sorted.sort((a, b) => b.stars - a.stars)
  }, [repos.data, sortOrder])

  if (user.loading || repos.loading) return <Loading />
  if (user.error) return <ErrorMessage error={user.error} reload={user.reload} />
  if (repos.error) return <ErrorMessage error={repos.error} reload={repos.reload} />
  if (!user.data) return null

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <UserInfo user={user.data} />
      <RepoList username={username} repos={sortedRepos} sortOrder={sortOrder} onSortOrderChange={setSortOrder} />
    </main>
  )
}
