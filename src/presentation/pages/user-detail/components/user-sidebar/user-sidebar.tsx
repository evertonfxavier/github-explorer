import { Link } from '@heroui/react'
import { FaBook } from '@react-icons/all-files/fa/FaBook'
import { FaBuilding } from '@react-icons/all-files/fa/FaBuilding'
import { FaCalendarAlt } from '@react-icons/all-files/fa/FaCalendarAlt'
import { FaEnvelope } from '@react-icons/all-files/fa/FaEnvelope'
import { FaExternalLinkAlt } from '@react-icons/all-files/fa/FaExternalLinkAlt'
import { FaLink } from '@react-icons/all-files/fa/FaLink'
import { FaMapMarkerAlt } from '@react-icons/all-files/fa/FaMapMarkerAlt'
import { FaUserFriends } from '@react-icons/all-files/fa/FaUserFriends'
import { FaUserPlus } from '@react-icons/all-files/fa/FaUserPlus'
import type { GithubUserModel } from '@/domain/models'
import { formatNumber } from '@/presentation/utils'

type Props = {
  user: GithubUserModel
}

const formatCreatedAt = (isoDate: string): string =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(isoDate))

const withProtocol = (url: string): string => (url.startsWith('http') ? url : `https://${url}`)

export function UserSidebar({ user }: Props) {
  return (
    <aside
      data-testid="user-sidebar"
      className="w-full shrink-0 border-b border-gray-200 bg-white p-4 tablet:h-full tablet:w-80 tablet:overflow-y-auto tablet:border-r tablet:border-b-0 tablet:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img src={user.avatarUrl} alt={user.login} className="h-38 w-32 rounded-xl object-cover" />
        </div>
        <div className="flex min-w-0 flex-col items-start gap-1 pt-1">
          <h1 className="truncate text-lg font-bold text-gray-900">{user.name ?? user.login}</h1>
          <span className="w-fit rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">@{user.login}</span>
          <Link
            href={user.htmlUrl}
            target="_blank"
            rel="noreferrer"
            data-testid="user-github-link"
            className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
          >
            Ver no GitHub <FaExternalLinkAlt className="text-[10px]" />
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 text-sm text-gray-600">
        {user.company && (
          <span className="flex items-center gap-2">
            <FaBuilding className="text-gray-400" /> {user.company}
          </span>
        )}
        {user.bio && <p className="text-gray-700">{user.bio}</p>}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <FaUserFriends /> Seguidores
          </span>
          <span data-testid="followers" className="text-lg font-bold text-gray-900">
            {formatNumber(user.followers)}
          </span>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <FaUserPlus /> Seguindo
          </span>
          <span data-testid="following" className="text-lg font-bold text-gray-900">
            {formatNumber(user.following)}
          </span>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <FaBook /> Repositórios
          </span>
          <span data-testid="public-repos" className="text-lg font-bold text-gray-900">
            {formatNumber(user.publicRepos)}
          </span>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <FaCalendarAlt /> No GitHub desde
          </span>
          <span className="text-sm font-bold text-gray-900">{formatCreatedAt(user.createdAt)}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-gray-100 pt-4 text-xs text-gray-500">
        <span className="flex items-center gap-2">
          <FaEnvelope />
          {user.email ?? 'E-mail não informado publicamente'}
        </span>
        {user.location && (
          <span className="flex items-center gap-2">
            <FaMapMarkerAlt /> {user.location}
          </span>
        )}
        {user.blog && (
          <span className="flex items-center gap-2">
            <FaLink className="shrink-0" />
            <a
              href={withProtocol(user.blog)}
              target="_blank"
              rel="noreferrer"
              className="truncate text-primary hover:underline"
            >
              {user.blog}
            </a>
          </span>
        )}
      </div>
    </aside>
  )
}
