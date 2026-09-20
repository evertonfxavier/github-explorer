import { UserDetail } from '@/presentation/pages/user-detail'
import { makeRemoteLoadGithubRepos } from '@/main/factories/usecases'

export const makeUserDetail = () => <UserDetail loadGithubRepos={makeRemoteLoadGithubRepos()} />
