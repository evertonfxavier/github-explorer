import { Link } from 'react-router-dom'
import type { Key } from '@heroui/react'
import { Label, ListBox, Select } from '@heroui/react'
import type { GithubRepoModel } from '@/domain/models'

export type RepoSortOrder = 'stars-desc' | 'stars-asc'

type Props = {
  username: string
  repos: GithubRepoModel[]
  sortOrder: RepoSortOrder
  onSortOrderChange: (order: RepoSortOrder) => void
}

export function RepoList({ username, repos, sortOrder, onSortOrderChange }: Props) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Repositórios</h3>
        <Select
          value={sortOrder}
          onChange={(value: Key | null) => onSortOrderChange(value as RepoSortOrder)}
          className="w-50"
        >
          <Label className="sr-only">Ordenar por estrelas</Label>
          <Select.Trigger data-testid="sort-order">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="stars-desc" textValue="Maior primeiro">
                Maior primeiro
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="stars-asc" textValue="Menor primeiro">
                Menor primeiro
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
      <ul data-testid="repo-list" className="flex flex-col divide-y divide-gray-200">
        {repos.map(repo => (
          <li key={repo.fullName}>
            <Link
              to={`/user/${username}/repo/${repo.name}`}
              data-testid="repo-item"
              className="-mx-3 flex flex-col gap-1 rounded-lg px-3 py-3 hover:bg-gray-50"
            >
              <span className="font-medium">{repo.name}</span>
              {repo.description && <span className="text-sm text-gray-600">{repo.description}</span>}
              <div className="flex gap-3 text-xs text-gray-500">
                <span>★ {repo.stars}</span>
                {repo.language && <span>{repo.language}</span>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
