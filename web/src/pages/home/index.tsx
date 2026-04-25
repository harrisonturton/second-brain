import { observer } from 'mobx-react-lite'
import { makePage } from '@/base/page/Page'
import type { ThemeStore } from '@/base/theme/ThemeStore'
import type { WindowStore } from '@/base/window/WindowStore'
import { HomePage } from './HomePage'
import { ChatFrame } from './chat/ChatFrame'
import { ActivityBar } from './navigation/ActivityBar'
import { NavigationPresenter } from './navigation/NavigationPresenter'
import {
  NavigationStore,
  type WorkspaceSection,
} from './navigation/NavigationStore'
import { Sidebar } from './navigation/Sidebar'
import { ProfilePresenter } from './profile/ProfilePresenter'
import { ProfileStore } from './profile/ProfileStore'
import { DeveloperSettings } from './settings/DeveloperSettings'
import { SettingsPanel } from './settings/SettingsPanel'
import { SettingsPresenter } from './settings/SettingsPresenter'
import { SettingsStore } from './settings/SettingsStore'
import { UserSettings } from './settings/UserSettings'
import { TabBar } from './tabs/TabBar'
import { TabsPresenter } from './tabs/TabsPresenter'
import { TabsStore } from './tabs/TabsStore'

const sectionTitles: Record<WorkspaceSection, string> = {
  sessions: 'Sessions',
  library: 'Library',
  settings: 'Settings',
}

/**
 * HomePage install. Setup runs once on mount: it builds the page-local
 * stores + presenters, kicks off initial loads, and binds each
 * stateless component to its store/presenter via inline
 * `observer(() => <Component ... />)` wrappers.
 *
 * The global theme + window stores arrive as page props (the root page
 * owns and passes them).
 */
export default makePage<{ themeStore: ThemeStore; windowStore: WindowStore }>(
  ({ themeStore, windowStore }, { services }) => {
    const navigationStore = new NavigationStore()
    const tabsStore = new TabsStore()
    const profileStore = new ProfileStore()
    const settingsStore = new SettingsStore()

    const navigationPresenter = new NavigationPresenter(
      navigationStore,
      services.sessionService,
      services.libraryService,
    )
    const tabsPresenter = new TabsPresenter(tabsStore, services.sessionService)
    const profilePresenter = new ProfilePresenter(
      profileStore,
      services.profileService,
    )
    const settingsPresenter = new SettingsPresenter(
      settingsStore,
      services.httpService,
    )

    // If developer mode is on at load (from persisted settings, when we
    // wire that up), make sure the runtime services match.
    settingsPresenter.applyToServices()

    void navigationPresenter.loadSidebarItems()
    void tabsPresenter.load()
    void profilePresenter.load()

    const handleLogout = () => {
      // TODO: wire when session state lands.
    }

    const ActivityBarView = observer(() => (
      <ActivityBar
        activeSection={navigationStore.activeSection}
        themeMode={themeStore.mode}
        topInset={windowStore.topInset}
        avatarInitials={profileStore.profile?.initials ?? ''}
        avatarTitle={profileStore.profile?.name ?? 'Profile'}
        onSelectSection={navigationPresenter.selectSection}
        onToggleTheme={() => themeStore.toggle()}
        onProfileClick={() => navigationPresenter.openSettingsItem('user')}
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

    const ChatFrameView = observer(() => (
      <ChatFrame
        sidebarCollapsed={navigationStore.sidebarCollapsed}
        topInset={windowStore.topInset}
        tabBar={<TabBarView />}
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
        userSettings={<UserSettings onLogout={handleLogout} />}
        developerSettings={<DeveloperSettingsView />}
      />
    ))

    const MainView = observer(() =>
      navigationStore.activeSection === 'settings' ? (
        <SettingsPanelView />
      ) : (
        <ChatFrameView />
      ),
    )

    return () => (
      <HomePage
        ActivityBar={ActivityBarView}
        Sidebar={SidebarView}
        Main={MainView}
      />
    )
  },
)
