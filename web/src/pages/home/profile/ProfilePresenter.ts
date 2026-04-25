import type { ProfileService } from '@/services/profile/ProfileService'
import type { ProfileStore } from './ProfileStore'

/**
 * ProfilePresenter — fetches the current user's profile through
 * ProfileService and writes it into ProfileStore. Action-only;
 * views read profile/loading from the store.
 */
export class ProfilePresenter {
  constructor(
    private store: ProfileStore,
    private profileService: ProfileService,
  ) {}

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
