import { Search } from '@/presentation/pages/search'
import { makeSearchValidation } from '@/main/factories/validation'
import { makeRecentSearches } from '@/main/factories/adapters'

export const makeSearch = () => (
  <Search validation={makeSearchValidation()} recentSearches={makeRecentSearches()} />
)
