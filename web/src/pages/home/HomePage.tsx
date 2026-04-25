import { useEffect, useMemo } from 'react'
import { Observer } from 'mobx-react-lite'
import { useServices } from '@/services/ServicesContext'
import { useRootStore } from '@/stores/RootStore'
import { ChatFrame } from './chat/ChatFrame'
import { ActivityBar } from './navigation/ActivityBar'
import { NavigationPresenter } from './navigation/NavigationPresenter'
import { NavigationStore, type WorkspaceSection } from './navigation/NavigationStore'
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
 * HomePage — the install for the home route. Owns the lifetime of the
 * page-local stores + presenters, kicks off their initial loads, and
 * wires their values into stateless views via inline <Observer> blocks.
 *
 * Page-local stores (NavigationStore, TabsStore, ProfileStore) are
 * instantiated here, NOT on RootStore. Global UI state (theme, window)
 * comes from useRootStore(); services come from useServices().
 */
export function HomePage() {
  const { themeStore, windowStore } = useRootStore()
  const { sessionService, libraryService, profileService } = useServices()

  // Page-local stores
  const navigationStore = useMemo(() => new NavigationStore(), [])
  const tabsStore = useMemo(() => new TabsStore(), [])
  const profileStore = useMemo(() => new ProfileStore(), [])

  // Presenters wire stores + services together.
  const navigationPresenter = useMemo(
    () =>
      new NavigationPresenter(navigationStore, sessionService, libraryService),
    [navigationStore, sessionService, libraryService],
  )
  const tabsPresenter = useMemo(
    () => new TabsPresenter(tabsStore, sessionService),
    [tabsStore, sessionService],
  )
  const profilePresenter = useMemo(
    () => new ProfilePresenter(profileStore, profileService),
    [profileStore, profileService],
  )

  // Initial loads. Presenters expose their loading state observably so
  // the views can render skeletons.
  useEffect(() => {
    void navigationPresenter.loadSessionCategories()
    void navigationPresenter.loadLibraryCategories()
    void tabsPresenter.load()
    void profilePresenter.load()
  }, [navigationPresenter, tabsPresenter, profilePresenter])

  return (
    <>
      <Observer>
        {() => (
          <ActivityBar
            activeSection={navigationPresenter.activeSection}
            themeMode={themeStore.mode}
            topInset={windowStore.topInset}
            avatarInitials={profilePresenter.profile?.initials ?? ''}
            avatarTitle={profilePresenter.profile?.name ?? 'Profile'}
            onSelectSection={navigationPresenter.selectSection}
            onToggleTheme={() => themeStore.toggle()}
          />
        )}
      </Observer>
      <Observer>
        {() => (
          <Sidebar
            title={sectionTitles[navigationPresenter.activeSection]}
            items={navigationPresenter.sidebarItems}
            loading={navigationPresenter.sidebarLoading}
            collapsed={navigationPresenter.sidebarCollapsed}
            topInset={windowStore.topInset}
            onToggleSidebar={navigationPresenter.toggleSidebar}
          />
        )}
      </Observer>
      <Observer>
        {() => (
          <ChatFrame
            sidebarCollapsed={navigationPresenter.sidebarCollapsed}
            topInset={windowStore.topInset}
            tabBar={
              <Observer>
                {() => (
                  <TabBar
                    tabs={tabsPresenter.tabs}
                    activeTabId={tabsPresenter.activeTabId}
                    onSelectTab={tabsPresenter.selectTab}
                    onCloseTab={tabsPresenter.closeTab}
                    onMoveTab={tabsPresenter.moveTab}
                  />
                )}
              </Observer>
            }
          />
        )}
      </Observer>
    </>
  )
}
