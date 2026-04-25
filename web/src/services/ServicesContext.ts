import { createContext, useContext } from 'react'
import type { LibraryService } from './library/LibraryService'
import type { ProfileService } from './profile/ProfileService'
import type { SessionService } from './session/SessionService'

/**
 * Services — the bag of backend-fetching services that presenters
 * accept in their constructors. Provided through React context so
 * pages and tests can swap real impls for fakes without touching
 * any consumer code.
 */
export type Services = {
  sessionService: SessionService
  profileService: ProfileService
  libraryService: LibraryService
}

const ServicesContext = createContext<Services | null>(null)

export const ServicesProvider = ServicesContext.Provider

export function useServices(): Services {
  const services = useContext(ServicesContext)
  if (!services) {
    throw new Error('useServices must be used within a ServicesProvider')
  }
  return services
}
