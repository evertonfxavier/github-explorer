import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { Header } from '@/presentation/components/header'
import { RecentSearchesSpy, ValidationSpy, renderWithRouter } from '@/tests/presentation/mocks'

const makeSut = (recentSearches = new RecentSearchesSpy()) => (
  <Header validation={new ValidationSpy()} recentSearches={recentSearches} />
)

const renderWithNavigation = (recentSearches: RecentSearchesSpy, route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Header validation={new ValidationSpy()} recentSearches={recentSearches} />
      <Routes>
        <Route path="/user/:username" element={<div data-testid="user-detail-probe" />} />
        <Route path="*" element={null} />
      </Routes>
    </MemoryRouter>,
  )

describe('Header', () => {
  it('should render the project name', () => {
    renderWithRouter(makeSut())

    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Explorer')).toBeInTheDocument()
  })

  it('should link the logo and project name to the home page', () => {
    renderWithRouter(makeSut())

    expect(screen.getByTestId('home-link')).toHaveAttribute('href', '/')
  })

  it('should render a link to the repository on GitHub', () => {
    renderWithRouter(makeSut())

    const link = screen.getByTestId('github-repo-link')
    expect(link).toHaveAttribute('href', 'https://github.com/evertonfxavier/github-explorer')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('should not render the search field on the home route', () => {
    renderWithRouter(makeSut(), { route: '/', path: '/' })

    expect(screen.queryByTestId('username-input')).not.toBeInTheDocument()
  })

  it('should render the search field on any other route', () => {
    renderWithRouter(makeSut(), { route: '/user/diego3g', path: '/user/:username' })

    expect(screen.getByTestId('username-input')).toBeInTheDocument()
  })

  it('should navigate to the user detail route on a valid search', async () => {
    renderWithNavigation(new RecentSearchesSpy(), '/user/someone/repo/x')

    expect(screen.queryByTestId('user-detail-probe')).not.toBeInTheDocument()

    await userEvent.type(screen.getByTestId('username-input'), 'diego3g')
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }))

    expect(await screen.findByTestId('user-detail-probe')).toBeInTheDocument()
  })

  it('should add the searched username to recent searches on a valid search', async () => {
    const recentSearches = new RecentSearchesSpy()
    renderWithNavigation(recentSearches, '/user/someone/repo/x')

    await userEvent.type(screen.getByTestId('username-input'), 'diego3g')
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }))

    expect(recentSearches.items).toEqual(['diego3g'])
  })
})
