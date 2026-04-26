import { action, computed, makeObservable, observable } from 'mobx'
import { getElectronApi } from '@/electronApi'
import { PLATFORM_LAYOUT } from '@/base/theme/platformLayout'

/**
 * WindowStore — observable view of the host window: are we in Electron,
 * are we fullscreen, and the resulting top inset for the floating panels.
 *
 * Subscribes to the preload's `onWindowStateChange` once at construction.
 * No effects in the React tree, no manual init — instantiate it once and
 * read the observables.
 */
export class WindowStore {
  @observable isDesktop = false
  @observable isDesktopFullScreen = false

  constructor() {
    makeObservable(this)

    const electronApi = getElectronApi()
    this.isDesktop = Boolean(electronApi)
    if (!electronApi) return

    void electronApi.getWindowState?.().then((state) => {
      this.setFullScreen(Boolean(state?.isFullScreen))
    })
    electronApi.onWindowStateChange?.((state) => {
      this.setFullScreen(Boolean(state?.isFullScreen))
    })
  }

  @action setFullScreen(value: boolean) {
    this.isDesktopFullScreen = value
  }

  @computed get topInset(): number {
    if (!this.isDesktop) return 4
    return PLATFORM_LAYOUT.appDesktop.topInset
  }
}
