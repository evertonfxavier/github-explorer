import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Loading } from '@/presentation/components/loading'

describe('Loading', () => {
  it('should render a status role', () => {
    render(<Loading />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
