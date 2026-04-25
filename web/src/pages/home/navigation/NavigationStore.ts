import { action, makeObservable, observable } from 'mobx'

export type WorkspaceSection = 'sessions' | 'library'

export type SidebarItem = {
  id: string
  label: string
}

/**
 * NavigationStore — state for the activity bar + sidebar.
 * Only data: which section is active, whether the sidebar is collapsed,
 * the per-section sidebar items, and per-section loading flags.
 * All fetching and orchestration lives in NavigationPresenter.
 */
export class NavigationStore {
  @observable activeSection: WorkspaceSection = 'sessions'
  @observable sidebarCollapsed = false
  @observable sessionCategories: SidebarItem[] = []
  @observable libraryCategories: SidebarItem[] = []
  @observable loadingSessionCategories = false
  @observable loadingLibraryCategories = false

  constructor() {
    makeObservable(this)
  }

  @action setActiveSection(section: WorkspaceSection) {
    this.activeSection = section
  }

  @action setSidebarCollapsed(value: boolean) {
    this.sidebarCollapsed = value
  }

  @action setSessionCategories(items: SidebarItem[]) {
    this.sessionCategories = items
  }

  @action setLibraryCategories(items: SidebarItem[]) {
    this.libraryCategories = items
  }

  @action setLoadingSessionCategories(value: boolean) {
    this.loadingSessionCategories = value
  }

  @action setLoadingLibraryCategories(value: boolean) {
    this.loadingLibraryCategories = value
  }
}
