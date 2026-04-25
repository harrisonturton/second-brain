import { createContext, useContext } from 'react'
import { ThemeStore } from '@/base/theme/ThemeStore'
import { WindowStore } from '@/base/window/WindowStore'

/**
 * RootStore — DI container for global, app-level state. Holds only
 * stores (no services, no behaviour). Page-local stores live in their
 * page's folder. Service instances are provided through a separate
 * ServicesProvider so that "stores hold state" stays a clean rule.
 */
export class RootStore {
  readonly themeStore = new ThemeStore()
  readonly windowStore = new WindowStore()
}

const RootStoreContext = createContext<RootStore | null>(null)

export const RootStoreProvider = RootStoreContext.Provider

export function useRootStore(): RootStore {
  const store = useContext(RootStoreContext)
  if (!store) {
    throw new Error('useRootStore must be used within a RootStoreProvider')
  }
  return store
}
