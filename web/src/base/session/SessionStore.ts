import { action, makeObservable, observable } from 'mobx'
import type { Profile } from '@/services/profile/ProfileService'

export type SessionStatus = 'logged-out' | 'logging-in' | 'logged-in'

/**
 * SessionStore — global auth state. Holds the logged-in/out status,
 * the hydrated user profile (when logged in), and the most recent
 * login error. Driven by SessionPresenter; views read from here.
 */
export class SessionStore {
  @observable status: SessionStatus = 'logged-out'
  @observable profile: Profile | null = null
  @observable loginError: string | null = null

  constructor() {
    makeObservable(this)
  }

  @action setStatus(status: SessionStatus) {
    this.status = status
  }

  @action setProfile(profile: Profile | null) {
    this.profile = profile
  }

  @action setLoginError(error: string | null) {
    this.loginError = error
  }
}
