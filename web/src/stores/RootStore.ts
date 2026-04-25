import { createContext, useContext } from 'react'
import { action, computed, makeObservable, observable } from 'mobx'
import { getElectronApi } from '../electronApi'
import { PLATFORM_LAYOUT } from '../theme/platformLayout'

export interface Tab {
  id: string
  label: string
}

export type SidebarView = 'sessions' | 'library'

export class RootStore {
  @observable query = ''
  @observable sidebarCollapsed = false
  @observable activeSidebarView: SidebarView = 'sessions'
  @observable tabs: Tab[] = [
    { id: 't1', label: 'The shape of meaning' },
    { id: 't2', label: 'Embeddings primer' },
  ]
  @observable activeTabId: string = 't1'
  @observable isDesktop = false
  @observable isDesktopFullScreen = false

  constructor() {
    makeObservable(this)

    const electronApi = getElectronApi()
    this.isDesktop = Boolean(electronApi)
    if (!electronApi) return

    void electronApi.getWindowState?.().then((state) => {
      this.setDesktopFullScreen(Boolean(state?.isFullScreen))
    })
    electronApi.onWindowStateChange?.((state) => {
      this.setDesktopFullScreen(Boolean(state?.isFullScreen))
    })
  }

  @computed get topInset(): number {
    if (!this.isDesktop) return 4
    return this.isDesktopFullScreen
      ? PLATFORM_LAYOUT.appDesktop.topInsetWhenFullScreen
      : PLATFORM_LAYOUT.appDesktop.topInset
  }

  @action setDesktopFullScreen(value: boolean) {
    this.isDesktopFullScreen = value
  }

  @action setQuery(value: string) {
    this.query = value
  }

  @action toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed
  }

  @action selectSidebarView(view: SidebarView) {
    if (this.activeSidebarView === view && !this.sidebarCollapsed) {
      this.sidebarCollapsed = true
      return
    }
    this.activeSidebarView = view
    this.sidebarCollapsed = false
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
