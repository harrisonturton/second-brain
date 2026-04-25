import { action, computed, makeObservable, observable } from 'mobx'
import { themesByMode, type Theme, type ThemeMode } from './themes'

/**
 * ThemeStore — global UI state for light/dark mode. Stupid by design:
 * one observable + one setter + one toggle. Resolution to a Theme token
 * object is a computed so consumers can read either `mode` or `theme`.
 */
export class ThemeStore {
  @observable mode: ThemeMode = 'light'

  constructor() {
    makeObservable(this)
  }

  @computed get theme(): Theme {
    return themesByMode[this.mode]
  }

  @action setMode(mode: ThemeMode) {
    this.mode = mode
  }

  @action toggle() {
    const cycle: ThemeMode[] = ['light', 'sepia', 'dark']
    const next = (cycle.indexOf(this.mode) + 1) % cycle.length
    this.mode = cycle[next]
  }
}
