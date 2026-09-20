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
      route: '/user/diego3g',
      path: '/user/:username',
    })

    expect(screen.getByRole('status')).toBeInTheDocument()

    expect(await screen.findAllByTestId('repo-item')).toHaveLength(loadGithubRepos.result.length)
    expect(loadGithubRepos.username).toBe('diego3g')
  })

  it('should show an error when loading the repos fails', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    loadGithubRepos.error = new UnexpectedError()
    renderWithRouter(<UserDetail loadGithubRepos={loadGithubRepos} />, {
      route: '/user/diego3g',
      path: '/user/:username',
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
      route: '/user/diego3g',
      path: '/user/:username',
    })

    await screen.findAllByTestId('repo-item')
    expect(screen.getAllByTestId('repo-item')[0]).toHaveTextContent('high')

    await userEvent.click(screen.getByTestId('sort-order'))
    await userEvent.click(await screen.findByRole('option', { name: 'Menos estrelas (crescente)' }))

    expect(screen.getAllByTestId('repo-item')[0]).toHaveTextContent('low')
  })

  it('should filter the repo list by name or description', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    loadGithubRepos.result = [
      { ...loadGithubRepos.result[0], name: 'ignite-app', description: 'a react app' },
      { ...loadGithubRepos.result[1], name: 'other-repo', description: 'unrelated project' },
    ]
    renderWithRouter(<UserDetail loadGithubRepos={loadGithubRepos} />, {
      route: '/user/diego3g',
      path: '/user/:username',
    })

    await screen.findAllByTestId('repo-item')

    await userEvent.type(screen.getByTestId('repo-search-input'), 'ignite')

    const items = screen.getAllByTestId('repo-item')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('ignite-app')
  })
})
