import { useCallback } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Link } from "@heroui/react";
import { FaArrowLeft } from "@react-icons/all-files/fa/FaArrowLeft";
import { FaBalanceScale } from "@react-icons/all-files/fa/FaBalanceScale";
import { FaCalendarAlt } from "@react-icons/all-files/fa/FaCalendarAlt";
import { FaClock } from "@react-icons/all-files/fa/FaClock";
import { FaCodeBranch } from "@react-icons/all-files/fa/FaCodeBranch";
import { FaExclamationCircle } from "@react-icons/all-files/fa/FaExclamationCircle";
import { FaExternalLinkAlt } from "@react-icons/all-files/fa/FaExternalLinkAlt";
import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { FaHdd } from "@react-icons/all-files/fa/FaHdd";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import type { LoadGithubRepo } from "@/domain/usecases";
import { useAsync } from "@/presentation/hooks";
import { Loading } from "@/presentation/components/loading";
import { ErrorMessage } from "@/presentation/components/error";
import { formatNumber } from "@/presentation/utils";

type Props = {
  loadGithubRepo: LoadGithubRepo;
};

const formatDate = (isoDate: string): string =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));

const formatSize = (sizeKb: number): string =>
  sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

export function RepoDetail({ loadGithubRepo }: Props) {
  const { username = "", name = "" } = useParams<{
    username: string;
    name: string;
  }>();

  const loadRepo = useCallback(
    () => loadGithubRepo.load(username, name),
    [loadGithubRepo, username, name],
  );
  const repo = useAsync(loadRepo);

  if (repo.loading) return <Loading />;
  if (repo.error)
    return <ErrorMessage error={repo.error} reload={repo.reload} />;
  if (!repo.data) return null;

  return (
    <main className="px-4 py-6 tablet:px-8 tablet:py-8">
      <div className="mx-auto mb-4 flex items-center justify-between">
        <RouterLink
          to={`/user/${username}`}
          data-testid="back-to-list"
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="text-xs" /> Voltar
        </RouterLink>
        <Link
          href={repo.data.htmlUrl}
          target="_blank"
          rel="noreferrer"
          data-testid="repo-external-link"
          className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Abrir no GitHub <FaExternalLinkAlt className="text-xs" />
        </Link>
      </div>

      <div
        data-testid="repo-detail"
        className="mx-auto flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-sm text-gray-500">
            / <span className="font-bold text-gray-900">{repo.data.name}</span>
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {repo.data.isPrivate ? "Privado" : "Público"}
            </span>
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Descrição do projeto
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            {repo.data.description ?? "Sem descrição disponível."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
          <div className="rounded-xl border border-gray-200 p-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <FaStar className="text-yellow-500" /> Estrelas
            </span>
            <span
              data-testid="repo-stars"
              className="mt-1 block text-xl font-bold text-gray-900"
            >
              {formatNumber(repo.data.stars)}
            </span>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <FaCodeBranch /> Forks
            </span>
            <span className="mt-1 block text-xl font-bold text-gray-900">
              {formatNumber(repo.data.forksCount)}
            </span>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <FaExclamationCircle /> Issues Abertas
            </span>
            <span className="mt-1 block text-xl font-bold text-gray-900">
              {formatNumber(repo.data.openIssuesCount)}
            </span>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <FaEye /> Observadores
            </span>
            <span className="mt-1 block text-xl font-bold text-gray-900">
              {formatNumber(repo.data.watchersCount)}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Especificações e propriedades
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-3 tablet:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="block text-xs text-gray-500">
                Linguagem Principal
              </span>
              <span className="text-sm font-bold text-gray-900">
                {repo.data.language ?? "Não especificada"}
              </span>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <FaBalanceScale /> Licença de Uso
              </span>
              <span
                data-testid="repo-license"
                className="text-sm font-bold text-gray-900"
              >
                {repo.data.license ?? "Sem licença definida"}
              </span>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <FaCodeBranch /> Branch Padrão
              </span>
              <span className="text-sm font-bold text-gray-900">
                {repo.data.defaultBranch}
              </span>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <FaCalendarAlt /> Data de Criação
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatDate(repo.data.createdAt)}
              </span>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <FaClock /> Última Modificação
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatDate(repo.data.updatedAt)}
              </span>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <FaHdd /> Tamanho do Repositório
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatSize(repo.data.sizeKb)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
