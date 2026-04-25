import { action } from 'mobx'
import type { LibraryService } from '@/services/library/LibraryService'
import type { SessionService } from '@/services/session/SessionService'
import type {
  NavigationStore,
  WorkspaceSection,
} from './NavigationStore'

/**
 * NavigationPresenter — orchestrates the activity bar + sidebar.
 *
 * Exposes only action methods; views read state directly from
 * NavigationStore. When the section changes, the presenter fetches
 * the right service's categories and writes them to
 * `store.sidebarItems` (which is the single source of truth the view
 * reads). A monotonic load token guards against rapid section switches
 * resolving in the wrong order.
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
      void this.loadSidebarItems()
    }
  })

  toggleSidebar = (): void => {
    this.store.setSidebarCollapsed(!this.store.sidebarCollapsed)
  }

  loadSidebarItems = async (): Promise<void> => {
    const token = ++this.loadId
    const section = this.store.activeSection
    this.store.setSidebarItems([])
    this.store.setSidebarLoading(true)
    try {
      const items =
        section === 'sessions'
          ? await this.sessionService.listCategories()
          : await this.libraryService.listCategories()
      if (token !== this.loadId) return
      this.store.setSidebarItems(items)
    } finally {
      if (token === this.loadId) {
        this.store.setSidebarLoading(false)
      }
    }
  }
}
