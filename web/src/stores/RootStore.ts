import { createContext, useContext } from 'react'
import { action, makeObservable, observable } from 'mobx'

export interface Tab {
  id: string
  label: string
}

export class RootStore {
  @observable query = ''
  @observable sidebarCollapsed = false
  @observable tabs: Tab[] = [
    { id: 't1', label: 'The shape of meaning' },
    { id: 't2', label: 'Embeddings primer' },
  ]
  @observable activeTabId: string = 't1'

  constructor() {
    makeObservable(this)
  }

  @action setQuery(value: string) {
    this.query = value
  }

  @action toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed
  }

  @action setActiveTab(id: string) {
    this.activeTabId = id
  }

  @action closeTab(id: string) {
    const idx = this.tabs.findIndex((t) => t.id === id)
    if (idx === -1) return
    this.tabs.splice(idx, 1)
    if (this.activeTabId === id) {
      const next = this.tabs[idx] ?? this.tabs[idx - 1]
      this.activeTabId = next?.id ?? ''
    }
  }

  @action moveTab(draggedId: string, targetId: string) {
    if (draggedId === targetId) return
    const from = this.tabs.findIndex((t) => t.id === draggedId)
    const to = this.tabs.findIndex((t) => t.id === targetId)
    if (from === -1 || to === -1) return
    const [moved] = this.tabs.splice(from, 1)
    this.tabs.splice(to, 0, moved)
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
