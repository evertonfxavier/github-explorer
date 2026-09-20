import { AxiosHttpClient } from '@/infra/http'

export const makeAxiosHttpClient = <R = unknown>(): AxiosHttpClient<R> => new AxiosHttpClient<R>()
