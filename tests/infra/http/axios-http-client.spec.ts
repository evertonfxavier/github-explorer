import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { AxiosHttpClient } from '@/infra/http'
import { mockAxiosResponse } from '@/tests/infra/mocks'

vi.mock('axios')

const mockedAxios = vi.mocked(axios, true)

const makeSut = (): AxiosHttpClient => new AxiosHttpClient()

describe('AxiosHttpClient', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear()
  })

  it('should call axios.get with correct URL', async () => {
    const sut = makeSut()
    mockedAxios.get.mockResolvedValueOnce(mockAxiosResponse({ any: 'data' }))

    await sut.get({ url: 'any_url' })

    expect(mockedAxios.get).toHaveBeenCalledWith('any_url')
  })

  it('should return correct statusCode and body on success', async () => {
    const sut = makeSut()
    const axiosResponse = mockAxiosResponse({ any: 'data' })
    mockedAxios.get.mockResolvedValueOnce(axiosResponse)

    const httpResponse = await sut.get({ url: 'any_url' })

    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    })
  })

  it('should return correct statusCode and body on failure', async () => {
    const sut = makeSut()
    const axiosError = { response: mockAxiosResponse({ error: 'not found' }, 404) }
    mockedAxios.get.mockRejectedValueOnce(axiosError)

    const httpResponse = await sut.get({ url: 'any_url' })

    expect(httpResponse).toEqual({
      statusCode: axiosError.response.status,
      body: axiosError.response.data,
    })
  })
})
