import type { HttpService } from '@/services/http/HttpService'
import type { ProfileService } from '@/services/profile/ProfileService'
import type { SessionStore } from './SessionStore'

export type LoginProvider = 'google' | 'apple' | 'sso'

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
