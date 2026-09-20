import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserInfo } from '@/presentation/components/user-info'
import { mockGithubUserModel } from '@/tests/domain/mocks'

describe('UserInfo', () => {
  it('should render user name, followers and following', () => {
    const user = mockGithubUserModel()
    render(<UserInfo user={user} />)

    expect(screen.getByText(user.name as string)).toBeInTheDocument()
    expect(screen.getByTestId('followers')).toHaveTextContent(String(user.followers))
    expect(screen.getByTestId('following')).toHaveTextContent(String(user.following))
  })
})
