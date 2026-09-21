import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserSidebar } from '@/presentation/components/user-sidebar'
import { mockGithubUserModel } from '@/tests/domain/mocks'
import { formatNumber } from '@/presentation/utils'

describe('UserSidebar', () => {
  it('should render name, followers, following and repo count', () => {
    const user = mockGithubUserModel()
    render(<UserSidebar user={user} repoCount={user.publicRepos} repoCountLoading={false} />)

    expect(screen.getByText(user.name as string)).toBeInTheDocument()
    expect(screen.getByTestId('followers')).toHaveTextContent(formatNumber(user.followers))
    expect(screen.getByTestId('following')).toHaveTextContent(formatNumber(user.following))
    expect(screen.getByTestId('public-repos')).toHaveTextContent(formatNumber(user.publicRepos))
  })

  it('should format large follower/following/repo counts with thousands separators', () => {
    const user = { ...mockGithubUserModel(), followers: 12345, following: 6789 }
    render(<UserSidebar user={user} repoCount={1000} repoCountLoading={false} />)

    expect(screen.getByTestId('followers')).toHaveTextContent('12.345')
    expect(screen.getByTestId('following')).toHaveTextContent('6.789')
    expect(screen.getByTestId('public-repos')).toHaveTextContent('1.000')
  })

  it('should render the repo count from the repoCount prop, not the user model', () => {
    const user = { ...mockGithubUserModel(), publicRepos: 5 }
    render(<UserSidebar user={user} repoCount={123} repoCountLoading={false} />)

    expect(screen.getByTestId('public-repos')).toHaveTextContent('123')
  })

  it('should link to the user profile on GitHub', () => {
    const user = mockGithubUserModel()
    render(<UserSidebar user={user} repoCount={user.publicRepos} repoCountLoading={false} />)

    expect(screen.getByTestId('user-github-link')).toHaveAttribute('href', user.htmlUrl)
  })

  it('should show a fallback message when there is no public email', () => {
    const user = { ...mockGithubUserModel(), email: null }
    render(<UserSidebar user={user} repoCount={user.publicRepos} repoCountLoading={false} />)

    expect(screen.getByText('E-mail não informado publicamente')).toBeInTheDocument()
  })

  it('should render the company and location when present', () => {
    const user = mockGithubUserModel()
    render(<UserSidebar user={user} repoCount={user.publicRepos} repoCountLoading={false} />)

    expect(screen.getByText(user.company as string)).toBeInTheDocument()
    expect(screen.getByText(user.location as string)).toBeInTheDocument()
  })

  it('should show skeletons instead of the stat values while repoCountLoading is true', () => {
    const user = mockGithubUserModel()
    render(<UserSidebar user={user} repoCount={user.publicRepos} repoCountLoading />)

    expect(screen.queryByTestId('followers')).not.toBeInTheDocument()
    expect(screen.queryByTestId('following')).not.toBeInTheDocument()
    expect(screen.queryByTestId('public-repos')).not.toBeInTheDocument()
  })

  it('should show the real stat values once repoCountLoading is false', () => {
    const user = mockGithubUserModel()
    render(<UserSidebar user={user} repoCount={user.publicRepos} repoCountLoading={false} />)

    expect(screen.getByTestId('followers')).toBeInTheDocument()
    expect(screen.getByTestId('following')).toBeInTheDocument()
    expect(screen.getByTestId('public-repos')).toBeInTheDocument()
  })
})
