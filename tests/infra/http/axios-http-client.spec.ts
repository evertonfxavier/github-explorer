import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { AxiosHttpClient } from '@/infra/http'
import { mockAxiosResponse } from '@/tests/infra/mocks'

vi.mock('axios')

const mockedAxios = vi.mocked(axios, true)

const makeSut = (): AxiosHttpClient => new AxiosHttpClient()

describe('AxiosHttpClient', () => {
  beforeEach(() => {
    mockedAxios.request.mockClear()
  })

  it('should call axios.request with correct URL, method and headers', async () => {
    const sut = makeSut()
    mockedAxios.request.mockResolvedValueOnce(mockAxiosResponse({ any: 'data' }))

    await sut.request({ url: 'any_url', method: 'get', headers: { Authorization: 'Bearer any_token' } })

    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: 'any_url',
      method: 'get',
      data: undefined,
      headers: { Authorization: 'Bearer any_token' },
      signal: undefined,
    })
  })

  it('should forward the given AbortSignal to axios.request', async () => {
    const sut = makeSut()
    mockedAxios.request.mockResolvedValueOnce(mockAxiosResponse({ any: 'data' }))
    const controller = new AbortController()

    await sut.request({ url: 'any_url', method: 'get', signal: controller.signal })

    expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({ signal: controller.signal }))
  })

  it('should rethrow the error when the request is canceled instead of reading .response', async () => {
    const sut = makeSut()
    const cancelError = new Error('canceled')
    mockedAxios.isCancel.mockReturnValueOnce(true)
    mockedAxios.request.mockRejectedValueOnce(cancelError)

    await expect(sut.request({ url: 'any_url', method: 'get' })).rejects.toThrow(cancelError)
  })

  it('should return correct statusCode and body on success', async () => {
    const sut = makeSut()
    const axiosResponse = mockAxiosResponse({ any: 'data' })
    mockedAxios.request.mockResolvedValueOnce(axiosResponse)

    const httpResponse = await sut.request({ url: 'any_url', method: 'get' })

    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    })
  })

  it('should return correct statusCode and body on failure', async () => {
    const sut = makeSut()
    const axiosError = { response: mockAxiosResponse({ error: 'not found' }, 404) }
    mockedAxios.request.mockRejectedValueOnce(axiosError)

    const httpResponse = await sut.request({ url: 'any_url', method: 'get' })

    expect(httpResponse).toEqual({
      statusCode: axiosError.response.status,
      body: axiosError.response.data,
    })
  })
})
