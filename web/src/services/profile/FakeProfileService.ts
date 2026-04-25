import type { HttpService } from '@/services/http/HttpService'
import type { Profile, ProfileService } from './ProfileService'

const PROFILE: Profile = {
  name: 'Harrison Turton',
  initials: 'HT',
}

export class FakeProfileService implements ProfileService {
  constructor(private http: HttpService) {}

  async getProfile(): Promise<Profile> {
    await this.http.request({ method: 'GET', path: '/profile' })
    return PROFILE
  }
}
