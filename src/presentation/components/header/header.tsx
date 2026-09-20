import { FaCompass } from '@react-icons/all-files/fa/FaCompass'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { Link } from '@heroui/react'
import { SearchForm } from '@/presentation/components/search-form'
import type { RecentSearches, Validation } from '@/presentation/protocols'

type Props = {
  validation: Validation
  recentSearches: RecentSearches
}

export function Header({ validation, recentSearches }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const showSearch = location.pathname !== '/'

  function handleSearch(username: string): void {
    recentSearches.add(username)
    navigate(`/user/${username}`)
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-3 py-2 tablet:flex-nowrap tablet:gap-4 tablet:px-4 tablet:py-3">
      <RouterLink to="/" data-testid="home-link" className="flex items-center gap-2 tablet:gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white tablet:h-10 tablet:w-10">
          <FaCompass className="text-[18px] tablet:text-xl" />
        </div>
        <span className="text-sm font-bold whitespace-nowrap tablet:text-base">
          GitHub <span className="text-primary">Explorer</span>
        </span>
      </RouterLink>
      {showSearch && (
        <div className="order-3 w-full tablet:order-0 tablet:w-auto tablet:max-w-md tablet:flex-1">
          <SearchForm validation={validation} onSearch={handleSearch} />
        </div>
      )}
      <Link
        href="https://github.com/evertonfxavier/github-explorer"
        target="_blank"
        rel="noreferrer"
        aria-label="Ver repositório no GitHub"
        data-testid="github-repo-link"
        className="text-gray-500 hover:text-gray-900"
      >
        <FaGithub className="text-xl tablet:text-2xl" />
      </Link>
    </header>
  )
}
