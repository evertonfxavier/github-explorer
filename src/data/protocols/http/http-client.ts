export const HttpStatusCode = {
  ok: 200,
  notFound: 404,
  serverError: 500,
} as const

export type HttpStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode]

export type HttpResponse<T = unknown> = {
  statusCode: HttpStatusCode
  body?: T
}

export type HttpGetParams = {
  url: string
}

export interface HttpGetClient<R = unknown> {
  get: (params: HttpGetParams) => Promise<HttpResponse<R>>
}
