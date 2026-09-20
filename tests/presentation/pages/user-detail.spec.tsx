import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserDetail } from '@/presentation/pages/user-detail'
import { LoadGithubReposSpy, renderWithRouter } from '@/tests/presentation/mocks'
import { UnexpectedError } from '@/domain/errors'

describe('UserDetail Page', () => {
  it('should show loading, then the repo list, requesting the first page for the routed username', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    renderWithRouter(<UserDetail loadGithubRepos={loadGithubRepos} />, {
      route: '/user/diego3g',
      path: '/user/:username',
    })

    expect(screen.getByRole('status')).toBeInTheDocument()

    expect(await screen.findAllByTestId('repo-item')).toHaveLength(loadGithubRepos.result.repos.length)
    expect(loadGithubRepos.params).toMatchObject({ username: 'diego3g', page: 1, sortOrder: 'stars-desc' })
  })

  it('should show an error when loading the repos fails, with a retry button wired to the reload', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    loadGithubRepos.error = new UnexpectedError()
    renderWithRouter(<UserDetail loadGithubRepos={loadGithubRepos} />, {
      route: '/user/diego3g',
      path: '/user/:username',
    })

    expect(await screen.findByTestId('error-message')).toHaveTextContent('Algo deu errado. Tente novamente.')

    loadGithubRepos.error = undefined
    await userEvent.click(screen.getByRole('button', { name: /tentar novamente/i }))

    expect(await screen.findAllByTestId('repo-item')).toHaveLength(loadGithubRepos.result.repos.length)
  })

  it('should request the new sort order when the sort option changes', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    renderWithRouter(<UserDetail loadGithubRepos={loadGithubRepos} />, {
      route: '/user/diego3g',
      path: '/user/:username',
    })

    await screen.findAllByTestId('repo-item')

    await userEvent.click(screen.getByTestId('sort-order'))
    await userEvent.click(await screen.findByRole('option', { name: 'Menos estrelas (crescente)' }))

    await screen.findAllByTestId('repo-item')
    expect(loadGithubRepos.params).toMatchObject({ page: 1, sortOrder: 'stars-asc' })
  })

  it('should eventually request the typed search term after the debounce', async () => {
    const loadGithubRepos = new LoadGithubReposSpy()
    renderWithRouter(<UserDetail loadGithubRepos={loadGithubRepos} />, {
      route: '/user/diego3g',
      path: '/user/:username',
    })

    await screen.findAllByTestId('repo-item')

    await userEvent.type(screen.getByTestId('repo-search-input'), 'ignite')

    await waitFor(() => expect(loadGithubRepos.params?.search).toBe('ignite'), { timeout: 2000 })
  }, 3000)
})
