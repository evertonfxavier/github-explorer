import { useCallback, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import type { LoadGithubUser } from '@/domain/usecases'
import { useAsync } from '@/presentation/hooks'
import { Loading } from '@/presentation/components/loading'
import { ErrorMessage } from '@/presentation/components/error'
import { UserSidebar } from '@/presentation/components/user-sidebar'
import type { UserProfileContext } from './use-user-profile-context'

type Props = {
  loadGithubUser: LoadGithubUser
}

export function UserProfileLayout({ loadGithubUser }: Props) {
  const { username = '' } = useParams<{ username: string }>()
  const [repoCount, setRepoCount] = useState<number>()

  const loadUser = useCallback(() => loadGithubUser.load(username), [loadGithubUser, username])
  const user = useAsync(loadUser)

  if (user.loading) return <Loading />
  if (user.error) return <ErrorMessage error={user.error} reload={user.reload} />
  if (!user.data) return null

  return (
    <div className="flex h-full flex-col tablet:flex-row tablet:overflow-hidden">
      <UserSidebar user={user.data} repoCount={repoCount ?? user.data.publicRepos} />
      <div className="flex-1 tablet:overflow-y-auto">
        <Outlet context={{ user: user.data, setRepoCount } satisfies UserProfileContext} />
      </div>
    </div>
  )
}
