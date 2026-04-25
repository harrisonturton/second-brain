import { observer } from 'mobx-react-lite'
import { makePage } from '@/base/page/Page'
import { HomePageView } from './HomePageView'
import { ChatFrameView } from './chat/ChatFrameView'
import { ActivityBarView } from './navigation/ActivityBarView'
import { NavigationPresenter } from './navigation/NavigationPresenter'
import {
  NavigationStore,
  type WorkspaceSection,
} from './navigation/NavigationStore'
import { SidebarView } from './navigation/SidebarView'
import { ProfilePresenter } from './profile/ProfilePresenter'
import { ProfileStore } from './profile/ProfileStore'
import { TabBarView } from './tabs/TabBarView'
import { TabsPresenter } from './tabs/TabsPresenter'
import { TabsStore } from './tabs/TabsStore'

const sectionTitles: Record<WorkspaceSection, string> = {
  sessions: 'Sessions',
  library: 'Library',
}

/**
 * HomePage — page install. Setup runs once on mount: it builds the
 * page-local stores + presenters, kicks off initial loads, and binds
 * each `*View` to its store/presenter via `observer(...)`.
 *
 * Bindings read **state from stores** and **actions from presenters**.
 * Presenters intentionally don't expose state getters — they write into
 * the store, and views read the store directly.
 */
export default makePage((_props, { rootStore, services }) => {
  const { themeStore, windowStore } = rootStore

  const navigationStore = new NavigationStore()
  const tabsStore = new TabsStore()
  const profileStore = new ProfileStore()

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

  void navigationPresenter.loadSidebarItems()
  void tabsPresenter.load()
  void profilePresenter.load()

  const ActivityBar = observer(() => (
    <ActivityBarView
      activeSection={navigationStore.activeSection}
      themeMode={themeStore.mode}
      topInset={windowStore.topInset}
      avatarInitials={profileStore.profile?.initials ?? ''}
      avatarTitle={profileStore.profile?.name ?? 'Profile'}
      onSelectSection={navigationPresenter.selectSection}
      onToggleTheme={() => themeStore.toggle()}
    />
  ))

  const Sidebar = observer(() => (
    <SidebarView
      title={sectionTitles[navigationStore.activeSection]}
      items={navigationStore.sidebarItems}
      loading={navigationStore.sidebarLoading}
      collapsed={navigationStore.sidebarCollapsed}
      topInset={windowStore.topInset}
      onToggleSidebar={navigationPresenter.toggleSidebar}
    />
  ))

  const TabBar = observer(() => (
    <TabBarView
      tabs={tabsStore.tabs}
      activeTabId={tabsStore.activeTabId}
      onSelectTab={tabsPresenter.selectTab}
      onCloseTab={tabsPresenter.closeTab}
      onMoveTab={tabsPresenter.moveTab}
    />
  ))

  const ChatFrame = observer(() => (
    <ChatFrameView
      sidebarCollapsed={navigationStore.sidebarCollapsed}
      topInset={windowStore.topInset}
      tabBar={<TabBar />}
    />
  ))

  return () => (
    <HomePageView
      ActivityBar={ActivityBar}
      Sidebar={Sidebar}
      ChatFrame={ChatFrame}
    />
  )
})
