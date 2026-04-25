export type Profile = {
  name: string
  initials: string
}

export interface ProfileService {
  getProfile(): Promise<Profile>
}
