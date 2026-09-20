import { useParams } from 'react-router-dom'
import type { LoadGithubRepos } from '@/domain/usecases'
import { Loading } from '@/presentation/components/loading'
import { ErrorMessage } from '@/presentation/components/error'
import { useUserProfileContext } from '@/presentation/layouts/user-profile-layout'
import { RepoList } from './components/repo-list'
import { useInfiniteRepos } from './hooks/use-infinite-repos'

type Props = {
  loadGithubRepos: LoadGithubRepos
}

export function UserDetail({ loadGithubRepos }: Props) {
  const { username = '' } = useParams<{ username: string }>()
  const { setRepoCount } = useUserProfileContext()
  const {
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
  } = useInfiniteRepos({ loadGithubRepos, username, onTotalCountChange: setRepoCount })

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} reload={retry} />

  return (
    <main className="px-4 py-6 tablet:px-8 tablet:py-8">
      <RepoList
        username={username}
        repos={repos}
        sortOrder={sortOrder}
        onSortOrderChange={changeSortOrder}
        searchQuery={searchQuery}
        onSearchQueryChange={changeSearchQuery}
        hasMore={hasMore}
        loadingMore={loadingMore}
        searching={searching}
        sentinelRef={sentinelRef}
      />
    </main>
  )
}
