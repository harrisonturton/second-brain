import type { HttpService } from '@/services/http/HttpService'
import { FakeHttpService } from '@/services/http/FakeHttpService'
import type { SettingsStore } from './SettingsStore'

/**
 * SettingsPresenter — applies SettingsStore changes to runtime
 * services. Today the only side effect is keeping FakeHttpService's
 * delay in sync with the developer-mode setting; in real builds
 * (where the http service isn't a FakeHttpService) the
 * `instanceof` checks no-op.
 */
export class SettingsPresenter {
  constructor(
    private store: SettingsStore,
    private httpService: HttpService,
  ) {}

  /** Push the current settings into the runtime fake services. Call
   *  once at home-page load and again when developer mode toggles. */
  applyToServices = (): void => {
    if (!(this.httpService instanceof FakeHttpService)) return
    this.httpService.delayMs = this.store.developerMode
      ? this.store.fakeNetworkDelayMs
      : 0
  }

  setDeveloperMode = (value: boolean): void => {
    this.store.setDeveloperMode(value)
    this.applyToServices()
  }

  setFakeNetworkDelayMs = (value: number): void => {
    this.store.setFakeNetworkDelayMs(value)
    this.applyToServices()
  }
}
