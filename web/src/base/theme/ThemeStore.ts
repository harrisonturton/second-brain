import { action, computed, makeObservable, observable } from 'mobx'
import {
  buildLightTheme,
  darkTheme,
  DEFAULT_LIGHT_ACCENT,
  DEFAULT_LIGHT_PAGE_TINT,
  sepiaTheme,
  type Theme,
  type ThemeMode,
} from './themes'

/**
 * ThemeStore — global UI state for theme mode + light-theme accents.
 * Holds the active mode and the user's chosen highlight + page-tint
 * values for the light theme; the resolved Theme is computed from
 * those each render.
 */
export class ThemeStore {
  @observable mode: ThemeMode = 'light'
  @observable lightAccent: string = DEFAULT_LIGHT_ACCENT
  @observable lightPageTint: string = DEFAULT_LIGHT_PAGE_TINT

  constructor() {
    makeObservable(this)
  }

  @computed get theme(): Theme {
    if (this.mode === 'sepia') return sepiaTheme
    if (this.mode === 'dark') return darkTheme
    return buildLightTheme(this.lightAccent, this.lightPageTint)
  }

  @action setMode(mode: ThemeMode) {
    this.mode = mode
  }

  @action setLightAccent(hex: string) {
    this.lightAccent = hex
  }

  @action setLightPageTint(hex: string) {
    this.lightPageTint = hex
  }

  @action toggle() {
    const cycle: ThemeMode[] = ['light', 'sepia', 'dark']
    const next = (cycle.indexOf(this.mode) + 1) % cycle.length
    this.mode = cycle[next]
  }
}
