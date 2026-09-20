import { Header } from '@/presentation/components/header'
import { makeSearchValidation } from '@/main/factories/validation'
import { makeRecentSearches } from '@/main/factories/adapters'

export const makeHeader = () => (
  <Header validation={makeSearchValidation()} recentSearches={makeRecentSearches()} />
)
