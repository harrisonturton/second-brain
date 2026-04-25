import type { HttpService } from '@/services/http/HttpService'
import type {
  SearchHistoryItem,
  SearchResult,
  SearchService,
} from './SearchService'

const HISTORY: SearchHistoryItem[] = [
  { id: 'h1', query: 'attention is all you need', performedAt: '2025-04-22' },
  { id: 'h2', query: 'second brain methodology', performedAt: '2025-04-20' },
  { id: 'h3', query: 'how does prompt caching work', performedAt: '2025-04-18' },
  { id: 'h4', query: 'shannon information theory', performedAt: '2025-04-12' },
  { id: 'h5', query: 'embeddings primer', performedAt: '2025-04-08' },
  { id: 'h6', query: 'bitter lesson sutton', performedAt: '2025-04-02' },
]

const FAKE_RESULTS: SearchResult[] = [
  {
    id: 'r1',
    title: 'Attention is all you need',
    snippet:
      'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms…',
    source: 'arXiv',
  },
  {
    id: 'r2',
    title: 'The Annotated Transformer',
    snippet:
      'A line-by-line implementation walkthrough of the original Transformer paper.',
    source: 'nlp.seas.harvard.edu',
  },
  {
    id: 'r3',
    title: 'Why self-attention scales',
    snippet:
      'A note on the computational properties that let attention layers replace recurrence.',
    source: 'Notes',
  },
]

export class FakeSearchService implements SearchService {
  constructor(private http: HttpService) {}

  async listHistory(): Promise<SearchHistoryItem[]> {
    await this.http.request({ method: 'GET', path: '/search/history' })
    return HISTORY
  }

  async search(query: string): Promise<SearchResult[]> {
    await this.http.request({
      method: 'POST',
      path: '/search',
      body: { query },
    })
    return FAKE_RESULTS
  }
}
