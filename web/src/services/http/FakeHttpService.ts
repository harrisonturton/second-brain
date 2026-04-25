import type { HttpService } from './HttpService'

/**
 * FakeHttpService — sleeps for a configurable delay then resolves.
 *
 * The fake doesn't return real data: each Fake*Service holds its own
 * dummy data and uses HttpService only to "feel" like a network call,
 * so the UI exercises the same loading paths it will when the real
 * backend lands. Tweak `delayMs` to test loading states.
 */
export class FakeHttpService implements HttpService {
  delayMs: number

  constructor(delayMs: number = 300) {
    this.delayMs = delayMs
  }

  async request<T>(): Promise<T> {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, this.delayMs)
    })
    // The Fake*Service callers discard this — they return their own
    // dummy data. A real HttpService implementation would parse and
    // return the response body here.
    return undefined as T
  }
}
