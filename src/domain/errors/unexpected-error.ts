export class UnexpectedError extends Error {
  constructor() {
    super('Something went wrong. Try again.')
    this.name = 'UnexpectedError'
  }
}
