import { Search } from '@/presentation/pages/search'
import { makeSearchValidation } from '@/main/factories/validation'

export const makeSearch = () => <Search validation={makeSearchValidation()} />
