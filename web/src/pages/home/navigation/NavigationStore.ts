import { action, makeObservable, observable } from 'mobx'

export type WorkspaceSection = 'sessions' | 'library'

export type SidebarItem = {
  id: string
  label: string
}

/**
 * NavigationStore — state for the activity bar + sidebar.
 *
 * Holds the *final* values the views consume: the active section,
 * whether the sidebar is collapsed, the items currently shown in the
 * sidebar, and whether the sidebar is loading. Selecting a section
 * doesn't change the shape of the state — the items field is the same
 * array of `SidebarItem` regardless of which section is active. The
 * presenter is responsible for populating it (from sessions or library)
 * when the section changes.
 */
export class NavigationStore {
  @observable activeSection: WorkspaceSection = 'sessions'
  @observable sidebarCollapsed = false
  @observable sidebarItems: SidebarItem[] = []
  @observable sidebarLoading = false

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

  @action setSidebarLoading(value: boolean) {
    this.sidebarLoading = value
  }
}
