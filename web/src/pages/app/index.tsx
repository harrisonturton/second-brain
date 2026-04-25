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
import { ActivityBar } from './navigation/ActivityBar'
import { NavigationPresenter } from './navigation/NavigationPresenter'
import {
  NavigationStore,
  type WorkspaceSection,
} from './navigation/NavigationStore'
import { Sidebar } from './navigation/Sidebar'
import { SearchPanel } from './search/SearchPanel'
import { SearchPresenter } from './search/SearchPresenter'
import { SearchStore } from './search/SearchStore'
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
  minions: 'Minions',
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

    const navigationPresenter = new NavigationPresenter(
      navigationStore,
      services.sessionService,
      services.libraryService,
      services.minionsService,
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

    settingsPresenter.applyToServices()

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

    const SidebarView = observer(() => (
      <Sidebar
        title={sectionTitles[navigationStore.activeSection]}
        items={navigationStore.sidebarItems}
        selectedItemId={navigationStore.selectedSidebarItemId}
        loading={navigationStore.sidebarLoading}
        collapsed={navigationStore.sidebarCollapsed}
        topInset={windowStore.topInset}
        onSelectItem={navigationPresenter.selectSidebarItem}
        onToggleSidebar={navigationPresenter.toggleSidebar}
      />
    ))

    const TabBarView = observer(() => (
      <TabBar
        tabs={tabsStore.tabs}
        activeTabId={tabsStore.activeTabId}
        onSelectTab={tabsPresenter.selectTab}
        onCloseTab={tabsPresenter.closeTab}
        onMoveTab={tabsPresenter.moveTab}
      />
    ))

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
        tabBar={<TabBarView />}
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

    const SettingsPanelView = observer(() => (
      <SettingsPanel
        selectedItemId={navigationStore.selectedSidebarItemId}
        sidebarCollapsed={navigationStore.sidebarCollapsed}
        topInset={windowStore.topInset}
        userSettings={<UserSettings onLogout={sessionPresenter.logout} />}
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
        onQueryChange={searchPresenter.setQuery}
        onSubmit={searchPresenter.runSearch}
        breadcrumbBar={<BreadcrumbBarView />}
      />
    ))

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
      />
    )
  },
)
