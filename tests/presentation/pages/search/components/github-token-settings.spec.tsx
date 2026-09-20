import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GithubTokenSettings } from '@/presentation/pages/search/components/github-token-settings'
import { GithubTokenSpy } from '@/tests/presentation/mocks'

describe('GithubTokenSettings', () => {
  it('should show the call-to-action label and no clear button when no token is saved', () => {
    render(<GithubTokenSettings githubToken={new GithubTokenSpy()} />)

    expect(screen.getByTestId('toggle-github-token')).toHaveTextContent(/adicione um token/i)
    expect(screen.queryByTestId('clear-github-token')).not.toBeInTheDocument()
  })

  it('should show the configured label and a clear button when a token is already saved', () => {
    const githubToken = new GithubTokenSpy()
    githubToken.token = 'any_token'
    render(<GithubTokenSettings githubToken={githubToken} />)

    expect(screen.getByTestId('toggle-github-token')).toHaveTextContent(/token do github configurado/i)
    expect(screen.getByTestId('clear-github-token')).toBeInTheDocument()
  })

  it('should not show the form until the toggle is clicked', () => {
    render(<GithubTokenSettings githubToken={new GithubTokenSpy()} />)

    expect(screen.queryByTestId('github-token-input')).not.toBeInTheDocument()
  })

  it('should save the typed token and switch to the configured label', async () => {
    const githubToken = new GithubTokenSpy()
    render(<GithubTokenSettings githubToken={githubToken} />)

    await userEvent.click(screen.getByTestId('toggle-github-token'))
    await userEvent.type(screen.getByTestId('github-token-input'), 'ghp_123')
    await userEvent.click(screen.getByTestId('save-github-token'))

    expect(githubToken.token).toBe('ghp_123')
    expect(screen.getByTestId('toggle-github-token')).toHaveTextContent(/token do github configurado/i)
    expect(screen.queryByTestId('github-token-input')).not.toBeInTheDocument()
  })

  it('should not save when the input is empty', async () => {
    const githubToken = new GithubTokenSpy()
    render(<GithubTokenSettings githubToken={githubToken} />)

    await userEvent.click(screen.getByTestId('toggle-github-token'))
    await userEvent.click(screen.getByTestId('save-github-token'))

    expect(githubToken.token).toBeUndefined()
  })

  it('should clear a saved token without needing to open the form', async () => {
    const githubToken = new GithubTokenSpy()
    githubToken.token = 'any_token'
    render(<GithubTokenSettings githubToken={githubToken} />)

    await userEvent.click(screen.getByTestId('clear-github-token'))

    expect(githubToken.cleared).toBe(true)
    expect(screen.getByTestId('toggle-github-token')).toHaveTextContent(/adicione um token/i)
  })
})
