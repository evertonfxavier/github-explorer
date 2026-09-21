import type { RefObject } from "react";
import { Link } from "react-router-dom";
import type { Key } from "@heroui/react";
import { Label, ListBox, Select, SearchField, Spinner } from "@heroui/react";
import { FaClock } from "@react-icons/all-files/fa/FaClock";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import type { GithubRepoModel } from "@/domain/models";
import type { RepoSortOrder } from "@/domain/usecases";

type Props = {
  username: string;
  repos: GithubRepoModel[];
  sortOrder: RepoSortOrder;
  onSortOrderChange: (order: RepoSortOrder) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  hasMore: boolean;
  loadingMore: boolean;
  searching: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
};

export function RepoList({
  username,
  repos,
  sortOrder,
  onSortOrderChange,
  searchQuery,
  onSearchQueryChange,
  hasMore,
  loadingMore,
  searching,
  sentinelRef,
}: Props) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Repositórios</h3>
        <div className="flex flex-wrap items-center gap-2">
          <SearchField
            value={searchQuery}
            onChange={onSearchQueryChange}
            aria-label="Buscar por nome ou descrição"
            className="w-full tablet:w-56"
          >
            <SearchField.Group>
              {searching ? (
                <Spinner
                  size="sm"
                  data-testid="repo-search-spinner"
                  className="ms-3 me-0 shrink-0 text-field-placeholder"
                />
              ) : (
                <SearchField.SearchIcon />
              )}
              <SearchField.Input
                data-testid="repo-search-input"
                placeholder="Nome ou descrição..."
                className="min-w-0"
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <Select
            value={sortOrder}
            onChange={(value: Key | null) =>
              onSortOrderChange(value as RepoSortOrder)
            }
            className="w-full tablet:w-72"
          >
            <Label className="sr-only">Ordenar repositórios</Label>
            <Select.Trigger
              data-testid="sort-order"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Select.Value className="truncate" />
              <Select.Indicator className="shrink-0" />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item
                  id="stars-desc"
                  textValue="Mais estrelas (decrescente)"
                >
                  <span className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" /> Mais estrelas
                    (decrescente)
                  </span>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item
                  id="stars-asc"
                  textValue="Menos estrelas (crescente)"
                >
                  <span className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" /> Menos estrelas
                    (crescente)
                  </span>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item
                  id="updated-desc"
                  textValue="Atualizados recentemente"
                >
                  <span className="flex items-center gap-2">
                    <FaClock className="text-gray-400" /> Atualizados
                    recentemente
                  </span>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
      {repos.length === 0 ? (
        <p
          data-testid="repo-list-empty"
          className="py-6 text-center text-sm text-gray-400"
        >
          Nenhum repositório encontrado.
        </p>
      ) : (
        <>
          <ul
            data-testid="repo-list"
            className="flex flex-col divide-y divide-gray-200"
          >
            {repos.map((repo) => (
              <li key={repo.fullName}>
                <Link
                  to={`/user/${username}/repo/${repo.name}`}
                  data-testid="repo-item"
                  className="-mx-3 flex flex-col gap-1 rounded-lg px-3 py-3 hover:bg-gray-50"
                >
                  <span className="font-medium">
                    /{repo.name}
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {repo.isPrivate ? "Privado" : "Público"}
                    </span>
                  </span>
                  {repo.description && (
                    <span className="text-sm text-gray-600">
                      {repo.description}
                    </span>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" /> {repo.stars}
                    </span>
                    {repo.language && <span>{repo.language}</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div
              ref={sentinelRef}
              data-testid="repo-list-sentinel"
              className="flex items-center justify-center gap-2 py-4"
            >
              {loadingMore && (
                <>
                  <Spinner size="sm" />
                  <span className="text-xs text-gray-400">
                    Carregando mais repositórios...
                  </span>
                </>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
