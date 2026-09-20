import type { AxiosResponse } from 'axios'

export const mockAxiosResponse = <T>(data: T, status = 200): AxiosResponse<T> =>
  ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  }) as unknown as AxiosResponse<T>
