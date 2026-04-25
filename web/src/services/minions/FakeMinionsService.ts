import type { HttpService } from '@/services/http/HttpService'
import type { Minion, MinionsService } from './MinionsService'

const MINIONS: Minion[] = [
  { id: 'indexer', label: 'Indexer' },
  { id: 'crawler', label: 'Crawler' },
  { id: 'summarizer', label: 'Summarizer' },
  { id: 'linker', label: 'Linker' },
  { id: 'curator', label: 'Curator' },
]

export class FakeMinionsService implements MinionsService {
  constructor(private http: HttpService) {}

  async listMinions(): Promise<Minion[]> {
    await this.http.request({ method: 'GET', path: '/minions' })
    return MINIONS
  }
}
