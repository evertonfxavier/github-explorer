import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '@/presentation/components/header'

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )

describe('Header', () => {
  it('should render the project name', () => {
    renderHeader()

    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Explorer')).toBeInTheDocument()
  })

  it('should link the logo and project name to the home page', () => {
    renderHeader()

    expect(screen.getByTestId('home-link')).toHaveAttribute('href', '/')
  })

  it('should render a link to the repository on GitHub', () => {
    renderHeader()

    const link = screen.getByTestId('github-repo-link')
    expect(link).toHaveAttribute('href', 'https://github.com/evertonfxavier/github-explorer')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
