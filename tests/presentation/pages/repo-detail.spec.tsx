import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { RepoDetail } from '@/presentation/pages/repo-detail'
import { LoadGithubRepoSpy, renderWithRouter } from '@/tests/presentation/mocks'
import { UnexpectedError } from '@/domain/errors'

describe('RepoDetail Page', () => {
  it('should show repo details and an external link on success', async () => {
    const loadGithubRepo = new LoadGithubRepoSpy()
    renderWithRouter(<RepoDetail loadGithubRepo={loadGithubRepo} />, {
      route: '/user/diego3g/repo/ignite',
      path: '/user/:username/repo/:name',
    })

    expect(await screen.findByTestId('repo-detail')).toBeInTheDocument()
    expect(loadGithubRepo.username).toBe('diego3g')
    expect(loadGithubRepo.name).toBe('ignite')
    expect(screen.getByTestId('repo-external-link')).toHaveAttribute('href', loadGithubRepo.result.htmlUrl)
    expect(screen.getByTestId('back-to-list')).toHaveAttribute('href', '/user/diego3g')
  })

  it('should show an error state on failure', async () => {
    const loadGithubRepo = new LoadGithubRepoSpy()
    loadGithubRepo.error = new UnexpectedError()
    renderWithRouter(<RepoDetail loadGithubRepo={loadGithubRepo} />, {
      route: '/user/diego3g/repo/ignite',
      path: '/user/:username/repo/:name',
    })

    expect(await screen.findByTestId('error-message')).toBeInTheDocument()
  })
})
