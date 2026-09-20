import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Test setup', () => {
  it('should render with jsdom and jest-dom matchers available', () => {
    render(<div data-testid="sanity">ok</div>)

    expect(screen.getByTestId('sanity')).toBeInTheDocument()
  })
})
