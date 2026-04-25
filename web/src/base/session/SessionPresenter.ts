import type { HttpService } from '@/services/http/HttpService'
import type { Profile, ProfileService } from '@/services/profile/ProfileService'
import type { SessionStore } from './SessionStore'

export type LoginProvider = 'google' | 'apple' | 'sso'

const STORAGE_KEY = 'session.v1'

/**
 * SessionPresenter — owns auth transitions.
 *
 * `login(email, password)` and `loginWithProvider(provider)` simulate
 * a network call (via the HttpService delay), accept any non-empty
 * credentials, hydrate the user profile through ProfileService, and
 * flip the session status. `logout()` clears everything.
 *
 * The URL is pushed to `/` on login and `/login` on logout so the
 * browser address bar reflects the visible page.
 */
export class SessionPresenter {
  constructor(
    private store: SessionStore,
    private profileService: ProfileService,
    private httpService: HttpService,
  ) {}

  /** Rehydrate a previous session from localStorage so reloads keep
   *  the user logged in. Called once at app start. */
  restore = (): void => {
    const profile = readStoredProfile()
    if (!profile) return
    this.store.setProfile(profile)
    this.store.setStatus('logged-in')
  }

  login = async (email: string, password: string): Promise<void> => {
    if (!email.trim() || !password.trim()) {
      this.store.setLoginError('Email and password are required.')
      return
    }
    await this.runLogin(async () => {
      await this.httpService.request({
        method: 'POST',
        path: '/auth/login',
        body: { email, password },
      })
    })
  }

  loginWithProvider = async (provider: LoginProvider): Promise<void> => {
    await this.runLogin(async () => {
      await this.httpService.request({
        method: 'POST',
        path: `/auth/${provider}`,
      })
    })
  }

  logout = (): void => {
    this.store.setProfile(null)
    this.store.setLoginError(null)
    this.store.setStatus('logged-out')
    clearStoredProfile()
    pushPath('/login')
  }

  private async runLogin(call: () => Promise<void>): Promise<void> {
    if (this.store.status === 'logging-in') return
    this.store.setLoginError(null)
    this.store.setStatus('logging-in')
    try {
      await call()
      const profile = await this.profileService.getProfile()
      this.store.setProfile(profile)
      this.store.setStatus('logged-in')
      writeStoredProfile(profile)
      pushPath('/')
    } catch (err) {
      this.store.setLoginError(
        err instanceof Error ? err.message : 'Login failed.',
      )
      this.store.setStatus('logged-out')
    }
  }
}

function pushPath(path: string): void {
  if (typeof window === 'undefined') return
  if (window.location.pathname === path) return
  window.history.pushState({}, '', path)
}

function readStoredProfile(): Profile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Profile
  } catch {
    return null
  }
}

function writeStoredProfile(profile: Profile): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Storage may be unavailable (private mode, quota); ignore.
  }
}

function clearStoredProfile(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
