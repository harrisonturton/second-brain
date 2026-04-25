import {
  createElement,
  useState,
  type FunctionComponent,
  type ReactElement,
} from 'react'
import { useServices, type Services } from '@/services/ServicesContext'
import { useRootStore, type RootStore } from '@/stores/RootStore'

export type PageContext = {
  rootStore: RootStore
  services: Services
}

export type PageSetup<P> = (
  initialProps: P,
  context: PageContext,
) => FunctionComponent

/**
 * makePage — turns a setup function into a Page component.
 *
 * The setup runs ONCE on mount with the page's initial props and a
 * context bag (rootStore + services). It is the install layer for the
 * page: instantiate page-local stores and presenters here, wrap each
 * stateless `*View` with `observer(() => <View ... />)` to bind it to
 * those presenters, and return the composed root component.
 *
 * The component returned by `setup` is stable for the lifetime of the
 * page mount, so stores keep their identity across re-renders. Don't
 * call React hooks inside `setup` — pull what you need from the
 * `context` arg instead. Rendering the page does NOT forward props to
 * the inner component; capture them at setup time if needed.
 *
 * Example:
 *
 *   export default makePage((_, { services }) => {
 *     const navStore = new NavigationStore()
 *     const navPresenter = new NavigationPresenter(
 *       navStore,
 *       services.sessionService,
 *       services.libraryService,
 *     )
 *
 *     const Sidebar = observer(() => (
 *       <SidebarView
 *         collapsed={navPresenter.sidebarCollapsed}
 *         onToggle={navPresenter.toggleSidebar}
 *       />
 *     ))
 *
 *     return () => <HomePageView Sidebar={Sidebar} />
 *   })
 */
export function makePage<P extends object = Record<string, never>>(
  setup: PageSetup<P>,
): FunctionComponent<P> {
  return function Page(props: P): ReactElement {
    const rootStore = useRootStore()
    const services = useServices()
    const [Component] = useState(() =>
      setup(props, { rootStore, services }),
    )
    return createElement(Component)
  }
}
