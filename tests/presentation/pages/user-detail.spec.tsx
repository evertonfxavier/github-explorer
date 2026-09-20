import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserDetail } from '@/presentation/pages/user-detail'
import { LoadGithubReposSpy, renderWithRouter } from '@/tests/presentation/mocks'
import { UnexpectedError } from '@/domain/errors'

describe('UserDetail Page', () => {
  it('should show loading, then the repo list', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    renderWithRouter(<UserDetail loadGithubRepos={loadGithubRepos} />, {
      route: '/users/diego3g',
      path: '/users/:username',
    })

    expect(screen.getByRole('status')).toBeInTheDocument()

    expect(await screen.findAllByTestId('repo-item')).toHaveLength(loadGithubRepos.result.length)
    expect(loadGithubRepos.username).toBe('diego3g')
  })

  it('should show an error when loading the repos fails', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    loadGithubRepos.error = new UnexpectedError()
    renderWithRouter(<UserDetail loadGithubRepos={loadGithubRepos} />, {
      route: '/users/diego3g',
      path: '/users/:username',
    })

    expect(await screen.findByTestId('error-message')).toHaveTextContent('Algo deu errado. Tente novamente.')
  })

  it('should re-sort the repo list when the sort order changes', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    loadGithubRepos.result = [
      { ...loadGithubRepos.result[0], name: 'low', stars: 1 },
      { ...loadGithubRepos.result[1], name: 'high', stars: 100 },
    ]
    renderWithRouter(<UserDetail loadGithubRepos={loadGithubRepos} />, {
      route: '/users/diego3g',
      path: '/users/:username',
    })

    await screen.findAllByTestId('repo-item')
    expect(screen.getAllByTestId('repo-item')[0]).toHaveTextContent('high')

    await userEvent.click(screen.getByTestId('sort-order'))
    await userEvent.click(await screen.findByRole('option', { name: 'Menor primeiro' }))

    expect(screen.getAllByTestId('repo-item')[0]).toHaveTextContent('low')
  })
})
