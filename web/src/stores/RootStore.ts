import { createContext, useContext } from 'react'
import { action, makeObservable, observable } from 'mobx'

export class RootStore {
  @observable query = ''
  @observable sidebarCollapsed = false

  constructor() {
    makeObservable(this)
  }

  @action setQuery(value: string) {
    this.query = value
  }

  @action toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed
  }
}

const RootStoreContext = createContext<RootStore | null>(null)

export const RootStoreProvider = RootStoreContext.Provider

export function useRootStore(): RootStore {
  const store = useContext(RootStoreContext)
  if (!store) {
    throw new Error('useRootStore must be used within a RootStoreProvider')
  }
  return store
}
