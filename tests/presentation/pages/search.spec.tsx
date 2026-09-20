import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Search } from '@/presentation/pages/search'
import { ValidationSpy, renderWithRouter } from '@/tests/presentation/mocks'

describe('Search Page', () => {
  it('should navigate to the user detail route on a valid search', async () => {
    renderWithRouter(<Search validation={new ValidationSpy()} />, {
      probes: { '/users/:username': <div data-testid="user-detail-probe" /> },
    })

    await userEvent.type(screen.getByTestId('username-input'), 'diego3g')
    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByTestId('user-detail-probe')).toBeInTheDocument()
  })
})
