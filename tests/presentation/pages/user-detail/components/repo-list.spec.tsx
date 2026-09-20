import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { RepoList } from '@/presentation/pages/user-detail/components/repo-list'
import { mockGithubReposModel } from '@/tests/domain/mocks'

describe('RepoList', () => {
  it('should render one item per repo, linking to its detail route', () => {
    const repos = mockGithubReposModel()
    render(
      <MemoryRouter>
        <RepoList username="diego3g" repos={repos} sortOrder="stars-desc" onSortOrderChange={() => {}} />
      </MemoryRouter>,
    )

    const items = screen.getAllByTestId('repo-item')
    expect(items).toHaveLength(repos.length)
    expect(items[0]).toHaveAttribute('href', `/users/diego3g/repos/${repos[0].name}`)
  })

  it('should call onSortOrderChange when a sort option is picked', async () => {
    const onSortOrderChange = vi.fn()
    render(
      <MemoryRouter>
        <RepoList
          username="diego3g"
          repos={mockGithubReposModel()}
          sortOrder="stars-desc"
          onSortOrderChange={onSortOrderChange}
        />
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByTestId('sort-order'))
    await userEvent.click(await screen.findByRole('option', { name: 'Menor primeiro' }))

    expect(onSortOrderChange).toHaveBeenCalledWith('stars-asc')
  })
})
