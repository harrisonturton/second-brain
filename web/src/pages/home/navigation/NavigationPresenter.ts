import { action } from 'mobx'
import type { LibraryService } from '@/services/library/LibraryService'
import type { SessionService } from '@/services/session/SessionService'
import type {
  NavigationStore,
  SidebarItem,
  WorkspaceSection,
} from './NavigationStore'

const SETTINGS_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'user', label: 'User' },
  { id: 'developer', label: 'Developer' },
]

/**
 * NavigationPresenter — orchestrates the activity bar + sidebar.
 *
 * Exposes only action methods; views read state directly from
 * NavigationStore. When the section changes, the presenter populates
 * `store.sidebarItems` from the right source (services for sessions /
 * library, hardcoded for settings) and auto-selects the first item if
 * none is selected. A monotonic load token guards against rapid
 * section switches resolving in the wrong order.
 */
export class NavigationPresenter {
  private loadId = 0

  constructor(
    private store: NavigationStore,
    private sessionService: SessionService,
    private libraryService: LibraryService,
  ) {}

  selectSection = action((section: WorkspaceSection): void => {
    if (this.store.activeSection === section && !this.store.sidebarCollapsed) {
      this.store.setSidebarCollapsed(true)
      return
    }
    const sectionChanged = this.store.activeSection !== section
    this.store.setActiveSection(section)
    this.store.setSidebarCollapsed(false)
    if (sectionChanged) {
      this.store.setSelectedSidebarItemId(null)
      void this.loadSidebarItems()
    }
  })

  toggleSidebar = (): void => {
    this.store.setSidebarCollapsed(!this.store.sidebarCollapsed)
  }

  selectSidebarItem = (id: string): void => {
    this.store.setSelectedSidebarItemId(id)
  }

  loadSidebarItems = async (): Promise<void> => {
    const token = ++this.loadId
    const section = this.store.activeSection
    this.store.setSidebarItems([])
    this.store.setSidebarLoading(true)
    try {
      const items = await this.fetchItemsFor(section)
      if (token !== this.loadId) return
      this.store.setSidebarItems(items)
      if (!this.store.selectedSidebarItemId && items[0]) {
        this.store.setSelectedSidebarItemId(items[0].id)
      }
    } finally {
      if (token === this.loadId) {
        this.store.setSidebarLoading(false)
      }
    }
  }

  private async fetchItemsFor(
    section: WorkspaceSection,
  ): Promise<SidebarItem[]> {
    switch (section) {
      case 'sessions':
        return this.sessionService.listCategories()
      case 'library':
        return this.libraryService.listCategories()
      case 'settings':
        return SETTINGS_SIDEBAR_ITEMS
    }
  }
}
