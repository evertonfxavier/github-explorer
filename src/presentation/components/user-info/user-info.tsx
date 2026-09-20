import { Avatar } from '@heroui/react'
import type { GithubUserModel } from '@/domain/models'

type Props = {
  user: GithubUserModel
}

export function UserInfo({ user }: Props) {
  return (
    <section
      data-testid="user-info"
      className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-left"
    >
      <Avatar size="lg" className="h-24 w-24">
        <Avatar.Image src={user.avatarUrl} alt={user.login} />
        <Avatar.Fallback>{user.login.slice(0, 2).toUpperCase()}</Avatar.Fallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{user.name ?? user.login}</h2>
        <span className="text-sm text-gray-500">@{user.login}</span>
        {user.bio && <p className="text-sm">{user.bio}</p>}
        {user.email && <p className="text-sm">{user.email}</p>}
        <div className="flex gap-4 text-sm text-gray-600">
          <span data-testid="followers">{user.followers} seguidores</span>
          <span data-testid="following">{user.following} seguindo</span>
        </div>
      </div>
    </section>
  )
}
