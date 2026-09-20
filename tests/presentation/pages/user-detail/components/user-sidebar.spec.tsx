import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserSidebar } from '@/presentation/pages/user-detail/components/user-sidebar'
import { mockGithubUserModel } from '@/tests/domain/mocks'
import { formatNumber } from '@/presentation/utils'

describe('UserSidebar', () => {
  it('should render name, followers, following and public repos count', () => {
    const user = mockGithubUserModel()
    render(<UserSidebar user={user} />)

    expect(screen.getByText(user.name as string)).toBeInTheDocument()
    expect(screen.getByTestId('followers')).toHaveTextContent(formatNumber(user.followers))
    expect(screen.getByTestId('following')).toHaveTextContent(formatNumber(user.following))
    expect(screen.getByTestId('public-repos')).toHaveTextContent(formatNumber(user.publicRepos))
  })

  it('should format large follower/following/repo counts with thousands separators', () => {
    const user = { ...mockGithubUserModel(), followers: 12345, following: 6789, publicRepos: 1000 }
    render(<UserSidebar user={user} />)

    expect(screen.getByTestId('followers')).toHaveTextContent('12.345')
    expect(screen.getByTestId('following')).toHaveTextContent('6.789')
    expect(screen.getByTestId('public-repos')).toHaveTextContent('1.000')
  })

  it('should link to the user profile on GitHub', () => {
    const user = mockGithubUserModel()
    render(<UserSidebar user={user} />)

    expect(screen.getByTestId('user-github-link')).toHaveAttribute('href', user.htmlUrl)
  })

  it('should show a fallback message when there is no public email', () => {
    const user = { ...mockGithubUserModel(), email: null }
    render(<UserSidebar user={user} />)

    expect(screen.getByText('E-mail não informado publicamente')).toBeInTheDocument()
  })

  it('should render the company and location when present', () => {
    const user = mockGithubUserModel()
    render(<UserSidebar user={user} />)

    expect(screen.getByText(user.company as string)).toBeInTheDocument()
    expect(screen.getByText(user.location as string)).toBeInTheDocument()
  })
})
