import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { RepoDetail } from '@/presentation/pages/repo-detail'
import { LoadGithubRepoSpy, renderWithRouter } from '@/tests/presentation/mocks'
import { UnexpectedError } from '@/domain/errors'

const renderRepoDetail = (loadGithubRepo: LoadGithubRepoSpy) =>
  renderWithRouter(<RepoDetail loadGithubRepo={loadGithubRepo} />, {
    route: '/user/diego3g/repo/ignite',
    path: '/user/:username/repo/:name',
  })

describe('RepoDetail Page', () => {
  it('should show repo details and an external link on success', async () => {
    const loadGithubRepo = new LoadGithubRepoSpy()
    renderRepoDetail(loadGithubRepo)

    expect(await screen.findByTestId('repo-detail')).toBeInTheDocument()
    expect(loadGithubRepo.username).toBe('diego3g')
    expect(loadGithubRepo.name).toBe('ignite')
    expect(screen.getByTestId('repo-external-link')).toHaveAttribute('href', loadGithubRepo.result.htmlUrl)
    expect(screen.getByTestId('back-to-list')).toHaveAttribute('href', '/user/diego3g')
  })

  it('should show a fallback when the repo has no description or license', async () => {
    const loadGithubRepo = new LoadGithubRepoSpy()
    loadGithubRepo.result = { ...loadGithubRepo.result, description: null, license: null }
    renderRepoDetail(loadGithubRepo)

    expect(await screen.findByText('Sem descrição disponível.')).toBeInTheDocument()
    expect(screen.getByTestId('repo-license')).toHaveTextContent('Sem licença definida')
  })

  it('should show an error state on failure', async () => {
    const loadGithubRepo = new LoadGithubRepoSpy()
    loadGithubRepo.error = new UnexpectedError()
    renderRepoDetail(loadGithubRepo)

    expect(await screen.findByTestId('error-message')).toBeInTheDocument()
  })
})
