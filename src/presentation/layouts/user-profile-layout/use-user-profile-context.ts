import { useOutletContext } from 'react-router-dom'
import type { GithubUserModel } from '@/domain/models'

export type UserProfileContext = {
  user: GithubUserModel
}

export const useUserProfileContext = () => useOutletContext<UserProfileContext>()
