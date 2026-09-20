import { UserProfileLayout } from '@/presentation/layouts/user-profile-layout'
import { makeRemoteLoadGithubUser } from '@/main/factories/usecases'

export const makeUserProfileLayout = () => <UserProfileLayout loadGithubUser={makeRemoteLoadGithubUser()} />
