import { action, makeObservable, observable } from 'mobx'

/**
 * CommandPaletteStore — observable state for the Cmd+K quick-action
 * palette. Holds whether it's open and the current query string. The
 * available actions are static and live in the page install.
 */
export class CommandPaletteStore {
  @observable open = false
  @observable query = ''

  constructor() {
    makeObservable(this)
  }

  @action setOpen(value: boolean) {
    this.open = value
  }

  @action setQuery(value: string) {
    this.query = value
  }
}
