import { RepoDetail } from "@/presentation/pages/repo-detail";
import { makeRemoteLoadGithubRepo } from "@/main/factories/usecases";

export const makeRepoDetail = () => (
  <RepoDetail loadGithubRepo={makeRemoteLoadGithubRepo()} />
);
