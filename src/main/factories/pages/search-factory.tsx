import { Search } from '@/presentation/pages/search'
import { makeSearchValidation } from '@/main/factories/validation'
import { makeGithubToken, makeRecentSearches } from '@/main/factories/adapters'

export const makeSearch = () => (
  <Search
    validation={makeSearchValidation()}
    recentSearches={makeRecentSearches()}
    githubToken={makeGithubToken()}
  />
)
