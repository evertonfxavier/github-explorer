import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/presentation/components/footer'

describe('Footer', () => {
  it('should render a link to the author profile', () => {
    render(<Footer />)

    const link = screen.getByRole('link', { name: 'evertonfxavier' })
    expect(link).toHaveAttribute('href', 'https://github.com/evertonfxavier')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
