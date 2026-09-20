import { useCallback } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Link } from '@heroui/react'
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft'
import type { LoadGithubRepo } from '@/domain/usecases'
import { useAsync } from '@/presentation/hooks'
import { Loading } from '@/presentation/components/loading'
import { ErrorMessage } from '@/presentation/components/error'

type Props = {
  loadGithubRepo: LoadGithubRepo
}

export function RepoDetail({ loadGithubRepo }: Props) {
  const { username = '', name = '' } = useParams<{ username: string; name: string }>()

  const loadRepo = useCallback(() => loadGithubRepo.load(username, name), [loadGithubRepo, username, name])
  const repo = useAsync(loadRepo)

  if (repo.loading) return <Loading />
  if (repo.error) return <ErrorMessage error={repo.error} reload={repo.reload} />
  if (!repo.data) return null

  return (
    <main className="px-4 py-6 tablet:px-8 tablet:py-8">
      <div className="mx-auto mb-4 flex max-w-2xl items-center justify-between">
        <RouterLink
          to={`/user/${username}`}
          data-testid="back-to-list"
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="text-xs" /> Voltar
        </RouterLink>
        <Link
          href={repo.data.htmlUrl}
          target="_blank"
          rel="noreferrer"
          data-testid="repo-external-link"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Ver no GitHub
        </Link>
      </div>
      <div data-testid="repo-detail" className="mx-auto flex max-w-2xl flex-col gap-4">
        <h1 className="text-2xl font-semibold">{repo.data.name}</h1>
        {repo.data.description && <p className="text-gray-600">{repo.data.description}</p>}
        <div className="flex gap-4 text-sm text-gray-700">
          <span>★ {repo.data.stars}</span>
          {repo.data.language && <span>{repo.data.language}</span>}
        </div>
      </div>
    </main>
  )
}
