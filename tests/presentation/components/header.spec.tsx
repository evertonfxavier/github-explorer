import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/presentation/components/header'

describe('Header', () => {
  it('should render the project name', () => {
    render(<Header />)

    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Explorer')).toBeInTheDocument()
  })

  it('should render a link to the repository on GitHub', () => {
    render(<Header />)

    const link = screen.getByTestId('github-repo-link')
    expect(link).toHaveAttribute('href', 'https://github.com/evertonfxavier/github-explorer')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
