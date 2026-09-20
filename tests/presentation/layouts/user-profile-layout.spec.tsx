import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Link, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { UserProfileLayout } from '@/presentation/layouts/user-profile-layout'
import { LoadGithubUserSpy, renderWithRouter } from '@/tests/presentation/mocks'
import { UnexpectedError } from '@/domain/errors'

describe('UserProfileLayout', () => {
  it('should show loading, then the user sidebar and the outlet content', async () => {
    const loadGithubUser = new LoadGithubUserSpy()
    renderWithRouter(<UserProfileLayout loadGithubUser={loadGithubUser} />, {
      route: '/user/diego3g',
      path: '/user/:username',
      children: <Route index element={<div data-testid="outlet-child" />} />,
    })

    expect(screen.getByRole('status')).toBeInTheDocument()

    expect(await screen.findByTestId('user-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('outlet-child')).toBeInTheDocument()
    expect(loadGithubUser.username).toBe('diego3g')
  })

  it('should show an error when loading the user fails', async () => {
    const loadGithubUser = new LoadGithubUserSpy()
    loadGithubUser.error = new UnexpectedError()
    renderWithRouter(<UserProfileLayout loadGithubUser={loadGithubUser} />, {
      route: '/user/diego3g',
      path: '/user/:username',
      children: <Route index element={<div data-testid="outlet-child" />} />,
    })

    expect(await screen.findByTestId('error-message')).toBeInTheDocument()
  })

  it('should keep the sidebar mounted and not reload the user when navigating between nested routes', async () => {
    const loadGithubUser = new LoadGithubUserSpy()
    renderWithRouter(<UserProfileLayout loadGithubUser={loadGithubUser} />, {
      route: '/user/diego3g',
      path: '/user/:username',
      children: (
        <>
          <Route
            index
            element={
              <Link to="repo/ignite" data-testid="go-to-repo">
                go
              </Link>
            }
          />
          <Route path="repo/:name" element={<div data-testid="repo-child" />} />
        </>
      ),
    })

    await screen.findByTestId('user-sidebar')
    expect(loadGithubUser.username).toBe('diego3g')

    await userEvent.click(screen.getByTestId('go-to-repo'))

    expect(await screen.findByTestId('repo-child')).toBeInTheDocument()
    expect(screen.getByTestId('user-sidebar')).toBeInTheDocument()
  })
})
