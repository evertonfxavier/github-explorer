import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserDetail } from '@/presentation/pages/user-detail'
import { LoadGithubReposSpy, LoadGithubUserSpy, renderWithRouter } from '@/tests/presentation/mocks'
import { UnexpectedError } from '@/domain/errors'

describe('UserDetail Page', () => {
  it('should show loading, then user info and the repo list', async () => {
    const loadGithubUser = new LoadGithubUserSpy()
    const loadGithubRepos = new LoadGithubReposSpy()
    renderWithRouter(<UserDetail loadGithubUser={loadGithubUser} loadGithubRepos={loadGithubRepos} />, {
      route: '/users/diego3g',
      path: '/users/:username',
    })

    expect(screen.getByRole('status')).toBeInTheDocument()

    expect(await screen.findByTestId('user-sidebar')).toBeInTheDocument()
    expect(loadGithubUser.username).toBe('diego3g')
    expect(loadGithubRepos.username).toBe('diego3g')
    expect(screen.getAllByTestId('repo-item')).toHaveLength(loadGithubRepos.result.length)
  })

  it('should show an error when loading the user fails', async () => {
    const loadGithubUser = new LoadGithubUserSpy()
    loadGithubUser.error = new UnexpectedError()
    const loadGithubRepos = new LoadGithubReposSpy()
    renderWithRouter(<UserDetail loadGithubUser={loadGithubUser} loadGithubRepos={loadGithubRepos} />, {
      route: '/users/diego3g',
      path: '/users/:username',
    })

    expect(await screen.findByTestId('error-message')).toHaveTextContent('Algo deu errado. Tente novamente.')
  })

  it('should re-sort the repo list when the sort order changes', async () => {
    const loadGithubUser = new LoadGithubUserSpy()
    const loadGithubRepos = new LoadGithubReposSpy()
    loadGithubRepos.result = [
      { ...loadGithubRepos.result[0], name: 'low', stars: 1 },
      { ...loadGithubRepos.result[1], name: 'high', stars: 100 },
    ]
    renderWithRouter(<UserDetail loadGithubUser={loadGithubUser} loadGithubRepos={loadGithubRepos} />, {
      route: '/users/diego3g',
      path: '/users/:username',
    })

    await screen.findByTestId('user-sidebar')
    expect(screen.getAllByTestId('repo-item')[0]).toHaveTextContent('high')

    await userEvent.click(screen.getByTestId('sort-order'))
    await userEvent.click(await screen.findByRole('option', { name: 'Menor primeiro' }))

    expect(screen.getAllByTestId('repo-item')[0]).toHaveTextContent('low')
  })
})
