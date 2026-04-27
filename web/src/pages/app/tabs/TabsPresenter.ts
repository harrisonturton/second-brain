import { action } from 'mobx'
import type { SessionService } from '@/services/session/SessionService'
import type { TabsStore } from './TabsStore'

/**
 * TabsPresenter — orchestrates the open-sessions tab strip.
 *
 * Action-only: exposes load + select/close/move methods. Views read
 * tabs/activeTabId/loading directly from TabsStore.
 */
export class TabsPresenter {
  constructor(
    private store: TabsStore,
    private sessionService: SessionService,
  ) {}

  load = async (): Promise<void> => {
    this.store.setLoading(true)
    try {
      const sessions = await this.sessionService.listOpenSessions()
      this.store.setTabs(sessions.map((s) => ({ id: s.id, label: s.title })))
      if (!this.store.activeTabId && sessions[0]) {
        this.store.setActiveTabId(sessions[0].id)
      }
    } finally {
      this.store.setLoading(false)
    }
  }

  selectTab = (id: string): void => {
    this.store.setActiveTabId(id)
  }

  /** Append a fresh tab and activate it. Real session creation will
   *  flow through SessionService once that lands; for now we just
   *  push a placeholder labelled "New session". */
  newTab = action((): void => {
    const id = `new-${Date.now()}`
    this.store.setTabs([...this.store.tabs, { id, label: 'New session' }])
    this.store.setActiveTabId(id)
  })

  closeTab = action((id: string): void => {
    const idx = this.store.tabs.findIndex((t) => t.id === id)
    if (idx === -1) return
    const next = this.store.tabs.filter((t) => t.id !== id)
    this.store.setTabs(next)
    if (this.store.activeTabId === id) {
      const fallback = next[idx] ?? next[idx - 1] ?? null
      this.store.setActiveTabId(fallback?.id ?? null)
    }
  })

  moveTab = action((draggedId: string, targetId: string): void => {
    if (draggedId === targetId) return
    const tabs = [...this.store.tabs]
    const from = tabs.findIndex((t) => t.id === draggedId)
    const to = tabs.findIndex((t) => t.id === targetId)
    if (from === -1 || to === -1) return
    const [moved] = tabs.splice(from, 1)
    tabs.splice(to, 0, moved)
    this.store.setTabs(tabs)
  })
}
