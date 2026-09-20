import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Search } from '@/presentation/pages/search'
import { RecentSearchesSpy, ValidationSpy, renderWithRouter } from '@/tests/presentation/mocks'

describe('Search Page', () => {
  it('should navigate to the user detail route on a valid search', async () => {
    renderWithRouter(<Search validation={new ValidationSpy()} recentSearches={new RecentSearchesSpy()} />, {
      probes: { '/user/:username': <div data-testid="user-detail-probe" /> },
    })

    await userEvent.type(screen.getByTestId('username-input'), 'diego3g')
    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByTestId('user-detail-probe')).toBeInTheDocument()
  })

  it('should load recent searches on mount', async () => {
    const recentSearches = new RecentSearchesSpy()
    recentSearches.items = ['diego3g', 'torvalds']

    renderWithRouter(<Search validation={new ValidationSpy()} recentSearches={recentSearches} />)

    const items = await screen.findAllByTestId('recent-search-item')
    expect(items).toHaveLength(2)
  })

  it('should add the searched username to recent searches on a valid search', async () => {
    const recentSearches = new RecentSearchesSpy()
    renderWithRouter(<Search validation={new ValidationSpy()} recentSearches={recentSearches} />, {
      probes: { '/user/:username': <div data-testid="user-detail-probe" /> },
    })

    await userEvent.type(screen.getByTestId('username-input'), 'diego3g')
    await userEvent.click(screen.getByRole('button'))

    expect(recentSearches.items).toEqual(['diego3g'])
  })

  it('should clear recent searches when the clear button is clicked', async () => {
    const recentSearches = new RecentSearchesSpy()
    recentSearches.items = ['diego3g']

    renderWithRouter(<Search validation={new ValidationSpy()} recentSearches={recentSearches} />)

    await screen.findByTestId('recent-search-item')
    await userEvent.click(screen.getByTestId('clear-recent-searches'))

    expect(recentSearches.cleared).toBe(true)
    expect(screen.queryByTestId('recent-search-item')).not.toBeInTheDocument()
  })
})
