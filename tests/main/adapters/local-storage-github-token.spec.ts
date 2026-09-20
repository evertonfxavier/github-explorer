import { describe, expect, it } from 'vitest'
import { LocalStorageGithubToken } from '@/main/adapters'
import { StorageSpy } from '@/tests/data/mocks'

const makeSut = () => {
  const storageSpy = new StorageSpy()
  const sut = new LocalStorageGithubToken(storageSpy, storageSpy)
  return { sut, storageSpy }
}

describe('LocalStorageGithubToken', () => {
  it('should return undefined when nothing is stored', () => {
    const { sut } = makeSut()

    expect(sut.load()).toBeUndefined()
  })

  it('should save and load the token', () => {
    const { sut } = makeSut()

    sut.save('any_token')

    expect(sut.load()).toBe('any_token')
  })

  it('should overwrite a previously saved token', () => {
    const { sut } = makeSut()
    sut.save('old_token')

    sut.save('new_token')

    expect(sut.load()).toBe('new_token')
  })

  it('should clear the stored token', () => {
    const { sut } = makeSut()
    sut.save('any_token')

    sut.clear()

    expect(sut.load()).toBeUndefined()
  })
})
