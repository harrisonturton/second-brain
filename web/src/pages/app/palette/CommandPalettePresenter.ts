import { action } from 'mobx'
import type { CommandPaletteStore } from './CommandPaletteStore'

/**
 * CommandPalettePresenter — opens/closes the palette and resets query
 * when it opens. Action execution itself is owned by the install (each
 * action is just a `() => void`); this presenter only handles the
 * palette's own lifecycle.
 */
export class CommandPalettePresenter {
  constructor(private store: CommandPaletteStore) {}

  open = action((): void => {
    this.store.setQuery('')
    this.store.setOpen(true)
  })

  close = action((): void => {
    this.store.setOpen(false)
  })

  toggle = (): void => {
    if (this.store.open) this.close()
    else this.open()
  }

  setQuery = (value: string): void => {
    this.store.setQuery(value)
  }

  /** Run an action and close the palette. */
  runAction = (run: () => void): void => {
    run()
    this.close()
  }
}
