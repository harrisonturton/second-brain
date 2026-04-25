import { action, makeObservable, observable } from 'mobx'
import type { Profile } from '@/services/profile/ProfileService'

export class ProfileStore {
  @observable profile: Profile | null = null
  @observable loading = false

  constructor() {
    makeObservable(this)
  }

  @action setProfile(profile: Profile | null) {
    this.profile = profile
  }

  @action setLoading(value: boolean) {
    this.loading = value
  }
}
