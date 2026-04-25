import { observer } from 'mobx-react-lite'
import { makePage } from '@/base/page/Page'
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
import { TabBar } from './tabs/TabBar'
import { TabsPresenter } from './tabs/TabsPresenter'
import { TabsStore } from './tabs/TabsStore'

const sectionTitles: Record<WorkspaceSection, string> = {
  sessions: 'Sessions',
  library: 'Library',
}

/**
 * HomePage install. Setup runs once on mount: it builds the page-local
 * stores + presenters, kicks off initial loads, and binds each
 * stateless component to its store/presenter via inline
 * `observer(() => <Component ... />)` wrappers.
 *
 * Local convention: the inline wrapped versions get the `View` suffix
 * (`SidebarView` is "the Sidebar bound to a view of the data") since
 * they're temporary, page-scoped values; the canonical exported
 * components keep the plain name (`Sidebar`).
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

  const ActivityBarView = observer(() => (
    <ActivityBar
      activeSection={navigationStore.activeSection}
      themeMode={themeStore.mode}
      topInset={windowStore.topInset}
      avatarInitials={profileStore.profile?.initials ?? ''}
      avatarTitle={profileStore.profile?.name ?? 'Profile'}
      onSelectSection={navigationPresenter.selectSection}
      onToggleTheme={() => themeStore.toggle()}
    />
  ))

  const SidebarView = observer(() => (
    <Sidebar
      title={sectionTitles[navigationStore.activeSection]}
      items={navigationStore.sidebarItems}
      loading={navigationStore.sidebarLoading}
      collapsed={navigationStore.sidebarCollapsed}
      topInset={windowStore.topInset}
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

  return () => (
    <HomePage
      ActivityBar={ActivityBarView}
      Sidebar={SidebarView}
      ChatFrame={ChatFrameView}
    />
  )
})
