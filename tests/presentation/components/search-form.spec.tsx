import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchForm } from '@/presentation/components/search-form'
import { ValidationSpy } from '@/tests/presentation/mocks'

describe('SearchForm', () => {
  it('should call onSearch with the typed username when validation passes', async () => {
    const validationSpy = new ValidationSpy()
    const onSearch = vi.fn()
    render(<SearchForm validation={validationSpy} onSearch={onSearch} />)

    await userEvent.type(screen.getByTestId('username-input'), 'diego3g')
    await userEvent.click(screen.getByRole('button'))

    expect(onSearch).toHaveBeenCalledWith('diego3g')
    expect(validationSpy.fieldName).toBe('username')
    expect(validationSpy.fieldValue).toBe('diego3g')
  })

  it('should show the validation error and not call onSearch when validation fails', async () => {
    const validationSpy = new ValidationSpy()
    validationSpy.errorMessage = 'Campo obrigatório'
    const onSearch = vi.fn()
    render(<SearchForm validation={validationSpy} onSearch={onSearch} />)

    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByTestId('username-error')).toHaveTextContent('Campo obrigatório')
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('should allow submitting again after fixing a validation error', async () => {
    const validationSpy = new ValidationSpy()
    validationSpy.errorMessage = 'Campo obrigatório'
    const onSearch = vi.fn()
    render(<SearchForm validation={validationSpy} onSearch={onSearch} />)

    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('username-error')).toHaveTextContent('Campo obrigatório')

    validationSpy.errorMessage = ''
    await userEvent.type(screen.getByTestId('username-input'), 'diego3g')
    await userEvent.click(screen.getByRole('button'))

    expect(onSearch).toHaveBeenCalledWith('diego3g')
  })
})
