import {
  createElement,
  useState,
  type FunctionComponent,
  type ReactElement,
} from 'react'
import { useServices, type Services } from '@/services/ServicesContext'

export type PageContext = {
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
 * context bag (just `services`; global UI stores like `themeStore` and
 * `windowStore` are owned by `pages/root` and flow down as page props).
 * It is the install layer for the page: instantiate page-local stores
 * and presenters here, wrap each stateless component with
 * `observer(() => <Component ... />)` to bind it to those presenters,
 * and return the composed root component.
 *
 * The component returned by `setup` is stable for the lifetime of the
 * page mount, so stores keep their identity across re-renders. Don't
 * call React hooks inside `setup` — pull what you need from the
 * `context` arg or the props.
 */
export function makePage<P extends object = Record<string, never>>(
  setup: PageSetup<P>,
): FunctionComponent<P> {
  return function Page(props: P): ReactElement {
    const services = useServices()
    const [Component] = useState(() => setup(props, { services }))
    return createElement(Component)
  }
}
