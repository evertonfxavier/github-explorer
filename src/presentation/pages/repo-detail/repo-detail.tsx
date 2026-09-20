import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from '@heroui/react'
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
    <main
      data-testid="repo-detail"
      className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6 tablet:px-8 tablet:py-8"
    >
      <h1 className="text-2xl font-semibold">{repo.data.name}</h1>
      {repo.data.description && <p className="text-gray-600">{repo.data.description}</p>}
      <div className="flex gap-4 text-sm text-gray-700">
        <span>★ {repo.data.stars}</span>
        {repo.data.language && <span>{repo.data.language}</span>}
      </div>
      <Link
        href={repo.data.htmlUrl}
        target="_blank"
        rel="noreferrer"
        data-testid="repo-external-link"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        Ver no GitHub
      </Link>
    </main>
  )
}
