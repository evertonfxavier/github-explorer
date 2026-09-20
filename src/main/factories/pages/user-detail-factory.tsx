import { UserDetail } from "@/presentation/pages/user-detail";
import {
  makeRemoteLoadGithubRepos,
  makeRemoteLoadGithubUser,
} from "@/main/factories/usecases";

export const makeUserDetail = () => (
  <UserDetail
    loadGithubUser={makeRemoteLoadGithubUser()}
    loadGithubRepos={makeRemoteLoadGithubRepos()}
  />
);
