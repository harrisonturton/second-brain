import type { HttpService } from '@/services/http/HttpService'
import type { Agent, AgentsService } from './AgentsService'

const AGENTS: Agent[] = [
  { id: 'indexer', label: 'Indexer' },
  { id: 'crawler', label: 'Crawler' },
  { id: 'summarizer', label: 'Summarizer' },
  { id: 'linker', label: 'Linker' },
  { id: 'curator', label: 'Curator' },
]

export class FakeAgentsService implements AgentsService {
  constructor(private http: HttpService) {}

  async listAgents(): Promise<Agent[]> {
    await this.http.request({ method: 'GET', path: '/agents' })
    return AGENTS
  }
}
