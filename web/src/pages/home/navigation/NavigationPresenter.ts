import { action } from 'mobx'
import type { LibraryService } from '@/services/library/LibraryService'
import type { SessionService } from '@/services/session/SessionService'
import type {
  NavigationStore,
  SidebarItem,
  WorkspaceSection,
} from './NavigationStore'

/**
 * NavigationPresenter — orchestrates the activity bar + sidebar.
 *
 *  - Owns the "select-or-collapse" toggle for sections.
 *  - Loads sidebar categories per section through the relevant service,
 *    flipping loading flags so the view can render skeletons.
 *  - Exposes `sidebarItems` / `sidebarLoading` derived from the active
 *    section so the view doesn't have to branch on it itself.
 */
export class NavigationPresenter {
  constructor(
    private store: NavigationStore,
    private sessionService: SessionService,
    private libraryService: LibraryService,
  ) {}

  get activeSection(): WorkspaceSection {
    return this.store.activeSection
  }

  get sidebarCollapsed(): boolean {
    return this.store.sidebarCollapsed
  }

  get sidebarItems(): SidebarItem[] {
    return this.store.activeSection === 'sessions'
      ? this.store.sessionCategories
      : this.store.libraryCategories
  }

  get sidebarLoading(): boolean {
    return this.store.activeSection === 'sessions'
      ? this.store.loadingSessionCategories
      : this.store.loadingLibraryCategories
  }

  loadSessionCategories = async (): Promise<void> => {
    this.store.setLoadingSessionCategories(true)
    try {
      const cats = await this.sessionService.listCategories()
      this.store.setSessionCategories(cats)
    } finally {
      this.store.setLoadingSessionCategories(false)
    }
  }

  loadLibraryCategories = async (): Promise<void> => {
    this.store.setLoadingLibraryCategories(true)
    try {
      const cats = await this.libraryService.listCategories()
      this.store.setLibraryCategories(cats)
    } finally {
      this.store.setLoadingLibraryCategories(false)
    }
  }

  selectSection = action((section: WorkspaceSection): void => {
    if (this.store.activeSection === section && !this.store.sidebarCollapsed) {
      this.store.setSidebarCollapsed(true)
      return
    }
    this.store.setActiveSection(section)
    this.store.setSidebarCollapsed(false)
  })

  toggleSidebar = (): void => {
    this.store.setSidebarCollapsed(!this.store.sidebarCollapsed)
  }
}
