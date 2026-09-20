export interface GithubToken {
  load: () => string | undefined
  save: (token: string) => void
  clear: () => void
}
