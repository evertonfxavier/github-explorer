import { useNavigate } from 'react-router-dom'
import { SearchForm } from '@/presentation/components/search-form'
import type { Validation } from '@/presentation/protocols'

type Props = {
  validation: Validation
}

export function Search({ validation }: Props) {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold">GitHub User View</h1>
      <SearchForm validation={validation} onSearch={username => navigate(`/users/${username}`)} />
    </main>
  )
}
