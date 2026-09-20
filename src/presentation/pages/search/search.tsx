import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/presentation/components/search-form";
import { RecentSearchesPanel } from "./components/recent-searches";
import { GithubTokenSettings } from "./components/github-token-settings";
import type { GithubToken, RecentSearches, Validation } from "@/presentation/protocols";

type Props = {
  validation: Validation;
  recentSearches: RecentSearches;
  githubToken: GithubToken;
};

export function Search({ validation, recentSearches, githubToken }: Props) {
  const navigate = useNavigate();
  const [recent, setRecent] = useState<string[]>(() => recentSearches.load());

  function handleSearch(username: string): void {
    setRecent(recentSearches.add(username));
    navigate(`/user/${username}`);
  }

  function handleClear(): void {
    recentSearches.clear();
    setRecent([]);
  }

  return (
    <main className="flex h-full flex-col items-center justify-center gap-6 px-4 py-10 tablet:py-16">
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <span className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          Explore os repositórios mais populares
        </span>
        <h1 className="font-heading text-4xl leading-tight font-extrabold text-gray-900 tablet:text-5xl">
          Descubra os melhores projetos de qualquer dev
        </h1>
        <p className="max-w-xl text-gray-500">
          Consulte o perfil de qualquer usuário do GitHub, veja seus
          repositórios, podendo ser ordenados por estrelas, podendo também
          entrar no detalhe de cada projeto.
        </p>
        <SearchForm validation={validation} onSearch={handleSearch} />
        <RecentSearchesPanel
          usernames={recent}
          onSelect={handleSearch}
          onClear={handleClear}
        />
        <GithubTokenSettings githubToken={githubToken} />
      </div>
    </main>
  );
}
