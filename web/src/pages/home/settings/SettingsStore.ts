import { action, makeObservable, observable } from 'mobx'

const DEFAULT_FAKE_NETWORK_DELAY_MS = 300

/**
 * SettingsStore — page-level configuration for the home page. Lives
 * for the lifetime of the home page mount. Today: a developer-mode
 * flag and the artificial network delay applied to the fake HTTP
 * service when developer mode is on.
 */
export class SettingsStore {
  @observable developerMode = false
  @observable fakeNetworkDelayMs: number = DEFAULT_FAKE_NETWORK_DELAY_MS

  constructor() {
    makeObservable(this)
  }

  @action setDeveloperMode(value: boolean) {
    this.developerMode = value
  }

  @action setFakeNetworkDelayMs(value: number) {
    this.fakeNetworkDelayMs = value
  }
}
