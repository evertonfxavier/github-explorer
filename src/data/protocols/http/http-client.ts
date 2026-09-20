export type HttpMethod = 'get' | 'post' | 'put' | 'delete'

export type HttpRequest = {
  url: string
  method: HttpMethod
  body?: unknown
  headers?: Record<string, string>
}

export const HttpStatusCode = {
  ok: 200,
  created: 201,
  noContent: 204,
  movedPermanently: 301,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  serverError: 500,
} as const

export type HttpStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode]

export type HttpResponse<T = unknown> = {
  statusCode: HttpStatusCode
  body?: T
}

export interface HttpClient<R = unknown> {
  request: (data: HttpRequest) => Promise<HttpResponse<R>>
}
