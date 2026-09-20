import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { RepoList } from '@/presentation/pages/user-detail/components/repo-list'
import { mockGithubReposModel } from '@/tests/domain/mocks'

const renderRepoList = (props: Partial<Parameters<typeof RepoList>[0]> = {}) =>
  render(
    <MemoryRouter>
      <RepoList
        username="diego3g"
        repos={mockGithubReposModel()}
        sortOrder="stars-desc"
        onSortOrderChange={() => {}}
        searchQuery=""
        onSearchQueryChange={() => {}}
        hasMore={false}
        loadingMore={false}
        searching={false}
        sentinelRef={createRef<HTMLDivElement>()}
        {...props}
      />
    </MemoryRouter>,
  )

describe('RepoList', () => {
  it('should render one item per repo, linking to its detail route', () => {
    const repos = mockGithubReposModel()
    renderRepoList({ repos })

    const items = screen.getAllByTestId('repo-item')
    expect(items).toHaveLength(repos.length)
    expect(items[0]).toHaveAttribute('href', `/user/diego3g/repo/${repos[0].name}`)
  })

  it('should show an empty state when there are no repos to show', () => {
    renderRepoList({ repos: [] })

    expect(screen.getByTestId('repo-list-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('repo-item')).not.toBeInTheDocument()
  })

  it('should show the sentinel when hasMore is true, with a loading indicator when loadingMore', () => {
    renderRepoList({ hasMore: true, loadingMore: true })

    expect(screen.getByTestId('repo-list-sentinel')).toBeInTheDocument()
    expect(screen.getByText('Carregando mais repositórios...')).toBeInTheDocument()
  })

  it('should not show the sentinel when hasMore is false', () => {
    renderRepoList({ hasMore: false })

    expect(screen.queryByTestId('repo-list-sentinel')).not.toBeInTheDocument()
  })

  it('should call onSortOrderChange when a sort option is picked', async () => {
    const onSortOrderChange = vi.fn()
    renderRepoList({ onSortOrderChange })

    await userEvent.click(screen.getByTestId('sort-order'))
    await userEvent.click(await screen.findByRole('option', { name: 'Menos estrelas (crescente)' }))

    expect(onSortOrderChange).toHaveBeenCalledWith('stars-asc')
  })

  it('should call onSearchQueryChange when typing in the search input', async () => {
    const onSearchQueryChange = vi.fn()
    renderRepoList({ onSearchQueryChange })

    await userEvent.type(screen.getByTestId('repo-search-input'), 'ignite')

    expect(onSearchQueryChange).toHaveBeenCalled()
  })

  it('should show a spinner in the search field while searching, without removing the input', () => {
    renderRepoList({ searching: true })

    expect(screen.getByTestId('repo-search-spinner')).toBeInTheDocument()
    expect(screen.getByTestId('repo-search-input')).toBeInTheDocument()
  })

  it('should not show the search spinner when not searching', () => {
    renderRepoList({ searching: false })

    expect(screen.queryByTestId('repo-search-spinner')).not.toBeInTheDocument()
  })
})
