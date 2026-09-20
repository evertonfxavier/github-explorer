import { Link } from "react-router-dom";
import type { Key } from "@heroui/react";
import { Label, ListBox, Select, SearchField } from "@heroui/react";
import { FaClock } from "@react-icons/all-files/fa/FaClock";
import { FaCodeBranch } from "@react-icons/all-files/fa/FaCodeBranch";
import { FaSortAlphaDown } from "@react-icons/all-files/fa/FaSortAlphaDown";
import { FaSortAlphaUp } from "@react-icons/all-files/fa/FaSortAlphaUp";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import type { GithubRepoModel } from "@/domain/models";

export type RepoSortOrder =
  | "stars-desc"
  | "stars-asc"
  | "forks-desc"
  | "name-asc"
  | "name-desc"
  | "updated-desc";

type Props = {
  username: string;
  repos: GithubRepoModel[];
  sortOrder: RepoSortOrder;
  onSortOrderChange: (order: RepoSortOrder) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export function RepoList({
  username,
  repos,
  sortOrder,
  onSortOrderChange,
  searchQuery,
  onSearchQueryChange,
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
              <SearchField.SearchIcon />
              <SearchField.Input data-testid="repo-search-input" placeholder="Nome ou descrição..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <Select
            value={sortOrder}
            onChange={(value: Key | null) =>
              onSortOrderChange(value as RepoSortOrder)
            }
            className="w-72"
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
                <ListBox.Item id="forks-desc" textValue="Mais forks">
                  <span className="flex items-center gap-2">
                    <FaCodeBranch className="text-gray-400" /> Mais forks
                  </span>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="name-asc" textValue="Nome (A-Z)">
                  <span className="flex items-center gap-2">
                    <FaSortAlphaDown className="text-gray-400" /> Nome (A-Z)
                  </span>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="name-desc" textValue="Nome (Z-A)">
                  <span className="flex items-center gap-2">
                    <FaSortAlphaUp className="text-gray-400" /> Nome (Z-A)
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
      )}
    </section>
  );
}
