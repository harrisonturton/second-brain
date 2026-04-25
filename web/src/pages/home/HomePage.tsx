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
 * each `*View` to its presenter via `observer(...)`. The composed
 * subcomponents are passed to `HomePageView` for layout.
 */
export default makePage((_props, { rootStore, services }) => {
  const { themeStore, windowStore } = rootStore

  // Page-local stores (state only).
  const navigationStore = new NavigationStore()
  const tabsStore = new TabsStore()
  const profileStore = new ProfileStore()

  // Presenters wire stores + services into behaviour the views consume.
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

  // Kick off initial loads. Loading flags on the presenters drive the
  // views' loading states.
  void navigationPresenter.loadSessionCategories()
  void navigationPresenter.loadLibraryCategories()
  void tabsPresenter.load()
  void profilePresenter.load()

  const ActivityBar = observer(() => (
    <ActivityBarView
      activeSection={navigationPresenter.activeSection}
      themeMode={themeStore.mode}
      topInset={windowStore.topInset}
      avatarInitials={profilePresenter.profile?.initials ?? ''}
      avatarTitle={profilePresenter.profile?.name ?? 'Profile'}
      onSelectSection={navigationPresenter.selectSection}
      onToggleTheme={() => themeStore.toggle()}
    />
  ))

  const Sidebar = observer(() => (
    <SidebarView
      title={sectionTitles[navigationPresenter.activeSection]}
      items={navigationPresenter.sidebarItems}
      loading={navigationPresenter.sidebarLoading}
      collapsed={navigationPresenter.sidebarCollapsed}
      topInset={windowStore.topInset}
      onToggleSidebar={navigationPresenter.toggleSidebar}
    />
  ))

  const TabBar = observer(() => (
    <TabBarView
      tabs={tabsPresenter.tabs}
      activeTabId={tabsPresenter.activeTabId}
      onSelectTab={tabsPresenter.selectTab}
      onCloseTab={tabsPresenter.closeTab}
      onMoveTab={tabsPresenter.moveTab}
    />
  ))

  const ChatFrame = observer(() => (
    <ChatFrameView
      sidebarCollapsed={navigationPresenter.sidebarCollapsed}
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
