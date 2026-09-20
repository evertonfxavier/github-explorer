import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorMessage } from '@/presentation/components/error'

describe('ErrorMessage', () => {
  it('should render the error message', () => {
    render(<ErrorMessage error="any_error" reload={() => {}} />)

    expect(screen.getByTestId('error-message')).toHaveTextContent('any_error')
  })

  it('should call reload when the retry button is clicked', async () => {
    const reload = vi.fn()
    render(<ErrorMessage error="any_error" reload={reload} />)

    await userEvent.click(screen.getByRole('button'))

    expect(reload).toHaveBeenCalledTimes(1)
  })
})
