/**
 * HttpService — the transport boundary between services and the network.
 * Service implementations (real or fake) take an HttpService in their
 * constructor; presenters never see HttpService directly. Today there's
 * only a fake; a real impl will live alongside this file when the
 * backend lands.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type HttpRequest = {
  method: HttpMethod
  path: string
  body?: unknown
}

export interface HttpService {
  request<T>(req: HttpRequest): Promise<T>
}
