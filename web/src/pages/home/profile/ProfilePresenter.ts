import type { ProfileService } from '@/services/profile/ProfileService'
import type { ProfileStore } from './ProfileStore'

/**
 * ProfilePresenter — fetches the current user's profile through
 * ProfileService and exposes the result + loading flag for views
 * (today: just the avatar in ActivityBar).
 */
export class ProfilePresenter {
  constructor(
    private store: ProfileStore,
    private profileService: ProfileService,
  ) {}

  get profile() {
    return this.store.profile
  }

  get loading() {
    return this.store.loading
  }

  load = async (): Promise<void> => {
    this.store.setLoading(true)
    try {
      const profile = await this.profileService.getProfile()
      this.store.setProfile(profile)
    } finally {
      this.store.setLoading(false)
    }
  }
}
