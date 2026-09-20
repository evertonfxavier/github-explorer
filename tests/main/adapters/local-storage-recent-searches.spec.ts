import { describe, expect, it } from 'vitest'
import { LocalStorageRecentSearches } from '@/main/adapters'
import { StorageSpy } from '@/tests/data/mocks'

const makeSut = () => {
  const storageSpy = new StorageSpy()
  const sut = new LocalStorageRecentSearches(storageSpy, storageSpy)
  return { sut, storageSpy }
}

describe('LocalStorageRecentSearches', () => {
  it('should return an empty list when nothing is stored', () => {
    const { sut } = makeSut()

    expect(sut.load()).toEqual([])
  })

  it('should add usernames to the front of the list, most recent first', () => {
    const { sut } = makeSut()

    sut.add('diego3g')
    sut.add('torvalds')

    expect(sut.load()).toEqual(['torvalds', 'diego3g'])
  })

  it('should move an existing username to the front instead of duplicating it', () => {
    const { sut } = makeSut()
    sut.add('diego3g')
    sut.add('torvalds')

    sut.add('diego3g')

    expect(sut.load()).toEqual(['diego3g', 'torvalds'])
  })

  it('should cap the list at 5 items, dropping the oldest', () => {
    const { sut } = makeSut()

    for (const username of ['a', 'b', 'c', 'd', 'e', 'f']) sut.add(username)

    expect(sut.load()).toEqual(['f', 'e', 'd', 'c', 'b'])
  })

  it('should clear the stored list', () => {
    const { sut } = makeSut()
    sut.add('diego3g')

    sut.clear()

    expect(sut.load()).toEqual([])
  })
})
