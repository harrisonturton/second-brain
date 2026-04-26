import { action } from 'mobx'
import type { AgentsService } from '@/services/agents/AgentsService'
import type { LibraryService } from '@/services/library/LibraryService'
import type { SearchService } from '@/services/search/SearchService'
import type { SessionService } from '@/services/session/SessionService'
import type {
  NavigationStore,
  SidebarItem,
  WorkspaceSection,
} from './NavigationStore'

const SETTINGS_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'user', label: 'User' },
  { id: 'appearance', label: 'Appearance' },
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
    private agentsService: AgentsService,
    private searchService: SearchService,
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

  /** Start a fresh session — clears the selected history item so the
   *  chat surface shows an empty state. (Real session creation will
   *  call SessionService once that lands.) */
  openNewSession = action((): void => {
    const sectionChanged = this.store.activeSection !== 'sessions'
    this.store.setActiveSection('sessions')
    this.store.setSidebarCollapsed(false)
    this.store.setSelectedSidebarItemId(null)
    if (sectionChanged) {
      void this.loadSidebarItems()
    }
  })

  /** Start spawning a new agent — clears the selected agent so the
   *  panel shows a fresh state. (Real spawn flow lands later.) */
  spawnAgent = action((): void => {
    const sectionChanged = this.store.activeSection !== 'agents'
    this.store.setActiveSection('agents')
    this.store.setSidebarCollapsed(false)
    this.store.setSelectedSidebarItemId(null)
    if (sectionChanged) {
      void this.loadSidebarItems()
    }
  })

  /** Open a fresh, empty search. Always switches to the search
   *  section, expands the sidebar, and clears any previously selected
   *  history item — clicking the activity bar Search entry should
   *  feel like "new search" every time. */
  openNewSearch = action((): void => {
    const sectionChanged = this.store.activeSection !== 'search'
    this.store.setActiveSection('search')
    this.store.setSidebarCollapsed(false)
    this.store.setSelectedSidebarItemId(null)
    if (sectionChanged) {
      void this.loadSidebarItems()
    }
  })

  /** Jump to a specific item inside the settings section (used e.g.
   *  by the avatar button to open user settings directly). Bypasses
   *  the toggle-collapse behaviour of `selectSection`. */
  openSettingsItem = action((itemId: string): void => {
    const sectionChanged = this.store.activeSection !== 'settings'
    this.store.setActiveSection('settings')
    this.store.setSelectedSidebarItemId(itemId)
    this.store.setSidebarCollapsed(false)
    if (sectionChanged) {
      void this.loadSidebarItems()
    }
  })

  loadSidebarItems = async (): Promise<void> => {
    const token = ++this.loadId
    const section = this.store.activeSection
    this.store.setSidebarItems([])
    this.store.setSidebarLoading(true)
    try {
      const items = await this.fetchItemsFor(section)
      if (token !== this.loadId) return
      this.store.setSidebarItems(items)
      // Search treats "no selection" as a fresh empty search, so we
      // never auto-select an item there. Other sections default the
      // selection to the first item.
      if (
        section !== 'search' &&
        !this.store.selectedSidebarItemId &&
        items[0]
      ) {
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
      case 'search': {
        const history = await this.searchService.listHistory()
        return history.map((h) => ({ id: h.id, label: h.query }))
      }
      case 'sessions':
        return this.sessionService.listCategories()
      case 'library':
        return this.libraryService.listCategories()
      case 'agents':
        return this.agentsService.listAgents()
      case 'settings':
        return SETTINGS_SIDEBAR_ITEMS
    }
  }
}
