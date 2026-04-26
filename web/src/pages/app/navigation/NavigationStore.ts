import { action, makeObservable, observable } from 'mobx'

export type WorkspaceSection =
  | 'search'
  | 'sessions'
  | 'library'
  | 'agents'
  | 'settings'

export type SidebarItem = {
  id: string
  label: string
}

/**
 * NavigationStore — state for the activity bar + sidebar.
 *
 * Holds the *final* values the views consume: the active section,
 * whether the sidebar is collapsed, the items currently shown in the
 * sidebar, the currently selected sidebar item, and the loading flag.
 * Selecting a section doesn't change the shape of the state — the
 * items field is the same array of `SidebarItem` regardless of which
 * section is active. The presenter populates it (from sessions /
 * library / settings) when the section changes.
 */
export const SIDEBAR_MIN_WIDTH = 180
export const SIDEBAR_MAX_WIDTH = 420
export const SIDEBAR_DEFAULT_WIDTH = 220

export class NavigationStore {
  @observable activeSection: WorkspaceSection = 'sessions'
  @observable sidebarCollapsed = false
  @observable sidebarItems: SidebarItem[] = []
  @observable selectedSidebarItemId: string | null = null
  @observable sidebarLoading = false
  @observable sidebarWidth = SIDEBAR_DEFAULT_WIDTH
  @observable sidebarResizing = false

  constructor() {
    makeObservable(this)
  }

  @action setActiveSection(section: WorkspaceSection) {
    this.activeSection = section
  }

  @action setSidebarCollapsed(value: boolean) {
    this.sidebarCollapsed = value
  }

  @action setSidebarItems(items: SidebarItem[]) {
    this.sidebarItems = items
  }

  @action setSelectedSidebarItemId(id: string | null) {
    this.selectedSidebarItemId = id
  }

  @action setSidebarLoading(value: boolean) {
    this.sidebarLoading = value
  }

  @action setSidebarWidth(value: number) {
    this.sidebarWidth = Math.max(
      SIDEBAR_MIN_WIDTH,
      Math.min(SIDEBAR_MAX_WIDTH, Math.round(value)),
    )
  }

  @action setSidebarResizing(value: boolean) {
    this.sidebarResizing = value
  }
}
