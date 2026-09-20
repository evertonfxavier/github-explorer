import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Search } from '@/presentation/pages/search'
import { GithubTokenSpy, RecentSearchesSpy, ValidationSpy, renderWithRouter } from '@/tests/presentation/mocks'

const makeSut = (recentSearches = new RecentSearchesSpy(), githubToken = new GithubTokenSpy()) => (
  <Search validation={new ValidationSpy()} recentSearches={recentSearches} githubToken={githubToken} />
)

describe('Search Page', () => {
  it('should navigate to the user detail route on a valid search', async () => {
    renderWithRouter(makeSut(), {
      probes: { '/user/:username': <div data-testid="user-detail-probe" /> },
    })

    await userEvent.type(screen.getByTestId('username-input'), 'diego3g')
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }))

    expect(await screen.findByTestId('user-detail-probe')).toBeInTheDocument()
  })

  it('should load recent searches on mount', async () => {
    const recentSearches = new RecentSearchesSpy()
    recentSearches.items = ['diego3g', 'torvalds']

    renderWithRouter(makeSut(recentSearches))

    const items = await screen.findAllByTestId('recent-search-item')
    expect(items).toHaveLength(2)
  })

  it('should add the searched username to recent searches on a valid search', async () => {
    const recentSearches = new RecentSearchesSpy()
    renderWithRouter(makeSut(recentSearches), {
      probes: { '/user/:username': <div data-testid="user-detail-probe" /> },
    })

    await userEvent.type(screen.getByTestId('username-input'), 'diego3g')
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }))

    expect(recentSearches.items).toEqual(['diego3g'])
  })

  it('should navigate and bump the username to the front of recent searches when a recent item is selected', async () => {
    const recentSearches = new RecentSearchesSpy()
    recentSearches.items = ['diego3g']

    renderWithRouter(makeSut(recentSearches), {
      probes: { '/user/:username': <div data-testid="user-detail-probe" /> },
    })

    await userEvent.click(screen.getByTestId('recent-search-item'))

    expect(await screen.findByTestId('user-detail-probe')).toBeInTheDocument()
    expect(recentSearches.items).toEqual(['diego3g'])
  })

  it('should clear recent searches when the clear button is clicked', async () => {
    const recentSearches = new RecentSearchesSpy()
    recentSearches.items = ['diego3g']

    renderWithRouter(makeSut(recentSearches))

    await screen.findByTestId('recent-search-item')
    await userEvent.click(screen.getByTestId('clear-recent-searches'))

    expect(recentSearches.cleared).toBe(true)
    expect(screen.queryByTestId('recent-search-item')).not.toBeInTheDocument()
  })

  it('should render the github token settings, wired to the given githubToken', () => {
    const githubToken = new GithubTokenSpy()
    githubToken.token = 'any_token'

    renderWithRouter(makeSut(undefined, githubToken))

    expect(screen.getByTestId('toggle-github-token')).toHaveTextContent(/token do github configurado/i)
  })
})
