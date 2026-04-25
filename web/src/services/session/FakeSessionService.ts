import type { HttpService } from '@/services/http/HttpService'
import type {
  Session,
  SessionCategory,
  SessionService,
} from './SessionService'

const OPEN_SESSIONS: Session[] = [
  { id: 't1', title: 'The shape of meaning' },
  { id: 't2', title: 'Embeddings primer' },
]

const CATEGORIES: SessionCategory[] = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'projects', label: 'Projects' },
  { id: 'notes', label: 'Notes' },
  { id: 'archive', label: 'Archive' },
]

export class FakeSessionService implements SessionService {
  constructor(private http: HttpService) {}

  async listOpenSessions(): Promise<Session[]> {
    await this.http.request({ method: 'GET', path: '/sessions/open' })
    return OPEN_SESSIONS
  }

  async listCategories(): Promise<SessionCategory[]> {
    await this.http.request({ method: 'GET', path: '/sessions/categories' })
    return CATEGORIES
  }
}
