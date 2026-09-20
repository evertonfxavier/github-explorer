import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { LoadGithubRepos, LoadGithubUser } from '@/domain/usecases'
import type { GithubRepoModel } from '@/domain/models'
import { useAsync } from '@/presentation/hooks'
import { Loading } from '@/presentation/components/loading'
import { ErrorMessage } from '@/presentation/components/error'
import { UserSidebar } from './components/user-sidebar'
import { RepoList } from './components/repo-list'
import type { RepoSortOrder } from './components/repo-list'

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
    <div className="flex h-full flex-col tablet:flex-row tablet:overflow-hidden">
      <UserSidebar user={user.data} />
      <div className="flex-1 px-4 py-6 tablet:overflow-y-auto tablet:px-8 tablet:py-8">
        <RepoList username={username} repos={sortedRepos} sortOrder={sortOrder} onSortOrderChange={setSortOrder} />
      </div>
    </div>
  )
}
