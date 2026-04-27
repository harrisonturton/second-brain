import { observer } from 'mobx-react-lite'
import { makePage } from '@/base/page/Page'
import type { SessionPresenter } from '@/base/session/SessionPresenter'
import type { SessionStore } from '@/base/session/SessionStore'
import type { ThemeStore } from '@/base/theme/ThemeStore'
import type { WindowStore } from '@/base/window/WindowStore'
import { AppPage } from './AppPage'
import {
  BreadcrumbBar,
  type BreadcrumbCrumb,
} from './breadcrumbs/BreadcrumbBar'
import { ChatFrame } from './chat/ChatFrame'
import { BrowsePanel } from './library/BrowsePanel'
import { LibraryPresenter } from './library/LibraryPresenter'
import { LibraryStore } from './library/LibraryStore'
import { PlusIcon } from '@/base/icons/PlusIcon'
import { ActivityBar } from './navigation/ActivityBar'
import { NavigationPresenter } from './navigation/NavigationPresenter'
import {
  NavigationStore,
  type WorkspaceSection,
} from './navigation/NavigationStore'
import { Sidebar, type SidebarLeadingAction } from './navigation/Sidebar'
import {
  CommandPalette,
  type CommandAction,
} from './palette/CommandPalette'
import { CommandPalettePresenter } from './palette/CommandPalettePresenter'
import { CommandPaletteStore } from './palette/CommandPaletteStore'
import { SearchPanel } from './search/SearchPanel'
import { SearchPresenter } from './search/SearchPresenter'
import { SearchStore } from './search/SearchStore'
import { AppearanceSettings } from './settings/AppearanceSettings'
import { DeveloperSettings } from './settings/DeveloperSettings'
import { SettingsPanel } from './settings/SettingsPanel'
import { SettingsPresenter } from './settings/SettingsPresenter'
import { SettingsStore } from './settings/SettingsStore'
import { UserSettings } from './settings/UserSettings'
import { TabBar } from './tabs/TabBar'
import { TabsPresenter } from './tabs/TabsPresenter'
import { TabsStore } from './tabs/TabsStore'

const sectionTitles: Record<WorkspaceSection, string> = {
  search: 'Search',
  sessions: 'Sessions',
  library: 'Library',
  agents: 'Agents',
  settings: 'Settings',
}

/**
 * AppPage install (rendered when sessionStore.status === 'logged-in').
 *
 * Receives the global stores (theme, window, session) + session
 * presenter via props. Builds page-local stores + presenters,
 * kicks off initial loads, and binds each stateless component to its
 * store/presenter via inline `observer(...)` wrappers.
 *
 * Profile no longer has its own store on this page — the session
 * holds the hydrated profile, and the avatar reads it directly.
 */
export default makePage<{
  themeStore: ThemeStore
  windowStore: WindowStore
  sessionStore: SessionStore
  sessionPresenter: SessionPresenter
}>(
  (
    { themeStore, windowStore, sessionStore, sessionPresenter },
    { services },
  ) => {
    const navigationStore = new NavigationStore()
    const tabsStore = new TabsStore()
    const settingsStore = new SettingsStore()
    const libraryStore = new LibraryStore()
    const searchStore = new SearchStore()
    const paletteStore = new CommandPaletteStore()

    const navigationPresenter = new NavigationPresenter(
      navigationStore,
      services.sessionService,
      services.libraryService,
      services.agentsService,
      services.searchService,
    )
    const tabsPresenter = new TabsPresenter(tabsStore, services.sessionService)
    const settingsPresenter = new SettingsPresenter(
      settingsStore,
      services.httpService,
    )
    const libraryPresenter = new LibraryPresenter(
      libraryStore,
      services.libraryService,
    )
    const searchPresenter = new SearchPresenter(
      searchStore,
      services.searchService,
    )
    const palettePresenter = new CommandPalettePresenter(paletteStore)

    settingsPresenter.applyToServices()

    // Cmd/Ctrl+K toggles the palette. Esc-to-close lives in the
    // palette component itself (it owns the focused input).
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        palettePresenter.toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    void navigationPresenter.loadSidebarItems()
    void tabsPresenter.load()
    void libraryPresenter.loadDocuments()
    void searchPresenter.loadHistory()

    /** Activity-bar Search button: always opens an empty new search. */
    const handleOpenNewSearch = () => {
      searchPresenter.reset()
      navigationPresenter.openNewSearch()
    }

    const ActivityBarView = observer(() => (
      <ActivityBar
        activeSection={navigationStore.activeSection}
        themeMode={themeStore.mode}
        topInset={windowStore.topInset}
        avatarInitials={sessionStore.profile?.initials ?? ''}
        avatarTitle={sessionStore.profile?.name ?? 'Profile'}
        onSelectSection={navigationPresenter.selectSection}
        onToggleTheme={() => themeStore.toggle()}
        onProfileClick={() => navigationPresenter.openSettingsItem('user')}
        onOpenNewSearch={handleOpenNewSearch}
      />
    ))

    const SidebarView = observer(() => {
      const section = navigationStore.activeSection
      let leadingAction: SidebarLeadingAction | undefined
      let itemsHeader: string | undefined
      if (section === 'sessions') {
        leadingAction = {
          label: 'New session',
          icon: <PlusIcon />,
          onClick: navigationPresenter.openNewSession,
        }
        itemsHeader = 'Recents'
      } else if (section === 'agents') {
        leadingAction = {
          label: 'Spawn agent',
          icon: <PlusIcon />,
          onClick: navigationPresenter.spawnAgent,
        }
        itemsHeader = 'Current team'
      } else if (section === 'library') {
        leadingAction = {
          label: 'Add document',
          icon: <PlusIcon />,
          onClick: navigationPresenter.addDocument,
        }
        itemsHeader = 'Recently viewed'
      } else if (section === 'search') {
        leadingAction = {
          label: 'New search',
          icon: <PlusIcon />,
          onClick: () => {
            searchPresenter.reset()
            navigationPresenter.clearSidebarSelection()
          },
        }
        itemsHeader = 'Recents'
      }
      return (
        <Sidebar
          title={sectionTitles[section]}
          items={navigationStore.sidebarItems}
          selectedItemId={navigationStore.selectedSidebarItemId}
          loading={navigationStore.sidebarLoading}
          collapsed={navigationStore.sidebarCollapsed}
          topInset={windowStore.topInset}
          width={navigationStore.sidebarWidth}
          resizing={navigationStore.sidebarResizing}
          onSelectItem={navigationPresenter.selectSidebarItem}
          onToggleSidebar={navigationPresenter.toggleSidebar}
          onResizeStart={navigationPresenter.startSidebarResize}
          leadingAction={leadingAction}
          itemsHeader={itemsHeader}
        />
      )
    })

    const TabBarView = observer(() => {
      if (!windowStore.isDesktop) return null
      return (
        <TabBar
          tabs={tabsStore.tabs}
          activeTabId={tabsStore.activeTabId}
          fullScreen={windowStore.isDesktopFullScreen}
          onSelectTab={tabsPresenter.selectTab}
          onCloseTab={tabsPresenter.closeTab}
          onMoveTab={tabsPresenter.moveTab}
          onNewTab={tabsPresenter.newTab}
        />
      )
    })

    const BreadcrumbBarView = observer(() => {
      const section = navigationStore.activeSection
      const selectedId = navigationStore.selectedSidebarItemId
      const selectedItem = navigationStore.sidebarItems.find(
        (i) => i.id === selectedId,
      )
      const crumbs: BreadcrumbCrumb[] = [
        {
          id: `section:${section}`,
          label: sectionTitles[section],
          onClick: () => navigationPresenter.selectSection(section),
        },
      ]
      if (selectedItem) {
        crumbs.push({
          id: `item:${selectedItem.id}`,
          label: selectedItem.label,
          onClick: () => navigationPresenter.selectSidebarItem(selectedItem.id),
        })
      }
      return <BreadcrumbBar crumbs={crumbs} />
    })

    const ChatFrameView = observer(() => (
      <ChatFrame
        sidebarCollapsed={navigationStore.sidebarCollapsed}
        topInset={windowStore.topInset}
        sidebarWidth={navigationStore.sidebarWidth}
        resizing={navigationStore.sidebarResizing}
        breadcrumbBar={<BreadcrumbBarView />}
      />
    ))

    const DeveloperSettingsView = observer(() => (
      <DeveloperSettings
        developerMode={settingsStore.developerMode}
        fakeNetworkDelayMs={settingsStore.fakeNetworkDelayMs}
        onDeveloperModeChange={settingsPresenter.setDeveloperMode}
        onFakeNetworkDelayChange={settingsPresenter.setFakeNetworkDelayMs}
      />
    ))

    const AppearanceSettingsView = observer(() => (
      <AppearanceSettings
        lightAccent={themeStore.lightAccent}
        lightPageTint={themeStore.lightPageTint}
        onLightAccentChange={(hex) => themeStore.setLightAccent(hex)}
        onLightPageTintChange={(hex) => themeStore.setLightPageTint(hex)}
      />
    ))

    const SettingsPanelView = observer(() => (
      <SettingsPanel
        selectedItemId={navigationStore.selectedSidebarItemId}
        sidebarCollapsed={navigationStore.sidebarCollapsed}
        topInset={windowStore.topInset}
        sidebarWidth={navigationStore.sidebarWidth}
        resizing={navigationStore.sidebarResizing}
        userSettings={<UserSettings onLogout={sessionPresenter.logout} />}
        appearanceSettings={<AppearanceSettingsView />}
        developerSettings={<DeveloperSettingsView />}
        breadcrumbBar={<BreadcrumbBarView />}
      />
    ))

    const BrowsePanelView = observer(() => (
      <BrowsePanel
        documents={libraryStore.documents}
        loading={libraryStore.documentsLoading}
        sidebarCollapsed={navigationStore.sidebarCollapsed}
        topInset={windowStore.topInset}
        sidebarWidth={navigationStore.sidebarWidth}
        resizing={navigationStore.sidebarResizing}
        breadcrumbBar={<BreadcrumbBarView />}
      />
    ))

    const SearchPanelView = observer(() => (
      <SearchPanel
        query={searchStore.query}
        results={searchStore.results}
        searching={searchStore.searching}
        sidebarCollapsed={navigationStore.sidebarCollapsed}
        topInset={windowStore.topInset}
        sidebarWidth={navigationStore.sidebarWidth}
        resizing={navigationStore.sidebarResizing}
        onQueryChange={searchPresenter.setQuery}
        onSubmit={searchPresenter.runSearch}
        breadcrumbBar={<BreadcrumbBarView />}
      />
    ))

    const paletteActions: CommandAction[] = [
      {
        id: 'new-session',
        label: 'New session',
        hint: 'Sessions',
        run: navigationPresenter.openNewSession,
      },
      {
        id: 'new-search',
        label: 'New search',
        hint: 'Search',
        run: handleOpenNewSearch,
      },
      {
        id: 'spawn-agent',
        label: 'Spawn agent',
        hint: 'Agents',
        run: navigationPresenter.spawnAgent,
      },
      {
        id: 'browse-library',
        label: 'Browse library',
        hint: 'Library',
        run: () => navigationPresenter.selectSection('library'),
      },
      {
        id: 'toggle-theme',
        label: 'Cycle theme (light / sepia / dark)',
        hint: 'Theme',
        run: () => themeStore.toggle(),
      },
      {
        id: 'open-settings',
        label: 'Open settings',
        hint: 'Settings',
        run: () => navigationPresenter.selectSection('settings'),
      },
      {
        id: 'open-appearance',
        label: 'Appearance settings',
        hint: 'Settings',
        run: () => navigationPresenter.openSettingsItem('appearance'),
      },
      {
        id: 'logout',
        label: 'Log out',
        hint: 'Account',
        run: sessionPresenter.logout,
      },
    ]

    const CommandPaletteView = observer(() => {
      if (!paletteStore.open) return null
      return (
        <CommandPalette
          query={paletteStore.query}
          actions={paletteActions}
          onQueryChange={palettePresenter.setQuery}
          onRun={palettePresenter.runAction}
          onClose={palettePresenter.close}
        />
      )
    })

    const MainView = observer(() => {
      if (navigationStore.activeSection === 'settings') {
        return <SettingsPanelView />
      }
      if (navigationStore.activeSection === 'search') {
        return <SearchPanelView />
      }
      if (
        navigationStore.activeSection === 'library' &&
        navigationStore.selectedSidebarItemId === 'browse'
      ) {
        return <BrowsePanelView />
      }
      return <ChatFrameView />
    })

    return () => (
      <AppPage
        ActivityBar={ActivityBarView}
        Sidebar={SidebarView}
        Main={MainView}
        TabBar={TabBarView}
        CommandPalette={CommandPaletteView}
      />
    )
  },
)
