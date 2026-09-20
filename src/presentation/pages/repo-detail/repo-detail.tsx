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

  const load = useCallback(() => loadGithubRepo.load(username, name), [loadGithubRepo, username, name])
  const { data: repo, loading, error, reload } = useAsync(load)

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} reload={reload} />
  if (!repo) return null

  return (
    <main data-testid="repo-detail" className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-10">
      <h1 className="text-2xl font-semibold">{repo.name}</h1>
      {repo.description && <p className="text-gray-600">{repo.description}</p>}
      <div className="flex gap-4 text-sm text-gray-700">
        <span>★ {repo.stars}</span>
        {repo.language && <span>{repo.language}</span>}
      </div>
      <Link
        href={repo.htmlUrl}
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
