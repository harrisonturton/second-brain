import type { HttpService } from '@/services/http/HttpService'
import type {
  LibraryCategory,
  LibraryDocument,
  LibraryService,
} from './LibraryService'

const CATEGORIES: LibraryCategory[] = [
  { id: 'browse', label: 'Browse' },
]

const DOCUMENTS: LibraryDocument[] = [
  {
    id: 'd1',
    title: 'Attention is all you need',
    author: 'Ashish Vaswani et al.',
    source: 'arXiv',
    publishedDate: '2017-06-12',
    addedDate: '2024-11-04',
  },
  {
    id: 'd2',
    title: 'The Bitter Lesson',
    author: 'Rich Sutton',
    source: 'incompleteideas.net',
    publishedDate: '2019-03-13',
    addedDate: '2024-11-08',
  },
  {
    id: 'd3',
    title: 'A Mathematical Theory of Communication',
    author: 'Claude Shannon',
    source: 'Bell System Tech. Journal',
    publishedDate: '1948-07-01',
    addedDate: '2024-12-01',
  },
  {
    id: 'd4',
    title: 'How to Do Great Work',
    author: 'Paul Graham',
    source: 'paulgraham.com',
    publishedDate: '2023-07-01',
    addedDate: '2025-01-12',
  },
  {
    id: 'd5',
    title: 'The Unreasonable Effectiveness of Mathematics',
    author: 'Eugene Wigner',
    source: 'Wikipedia',
    publishedDate: '1960-02-01',
    addedDate: '2025-02-03',
  },
  {
    id: 'd6',
    title: 'Memory, learning, and the role of the hippocampus',
    author: 'Larry Squire',
    source: 'Nature Reviews Neuroscience',
    publishedDate: '2004-04-01',
    addedDate: '2025-03-21',
  },
  {
    id: 'd7',
    title: 'On Bullshit',
    author: 'Harry Frankfurt',
    source: 'Princeton University Press',
    publishedDate: '2005-01-10',
    addedDate: '2025-03-29',
  },
  {
    id: 'd8',
    title: 'Building a Second Brain',
    author: 'Tiago Forte',
    source: 'Atria Books',
    publishedDate: '2022-06-14',
    addedDate: '2025-04-02',
  },
  {
    id: 'd9',
    title: 'Notes on Notes',
    author: 'Andy Matuschak',
    source: 'andymatuschak.org',
    publishedDate: '2020-10-12',
    addedDate: '2025-04-15',
  },
  {
    id: 'd10',
    title: 'Emergent Abilities of Large Language Models',
    author: 'Jason Wei et al.',
    source: 'arXiv',
    publishedDate: '2022-06-15',
    addedDate: '2025-04-22',
  },
]

export class FakeLibraryService implements LibraryService {
  constructor(private http: HttpService) {}

  async listCategories(): Promise<LibraryCategory[]> {
    await this.http.request({ method: 'GET', path: '/library/categories' })
    return CATEGORIES
  }

  async listDocuments(): Promise<LibraryDocument[]> {
    await this.http.request({ method: 'GET', path: '/library/documents' })
    return DOCUMENTS
  }

  async listRecentlyViewed(): Promise<LibraryDocument[]> {
    await this.http.request({
      method: 'GET',
      path: '/library/recently-viewed',
    })
    // Hardcoded slice for now; eventually backed by view-history.
    return [
      DOCUMENTS[7], // Building a Second Brain
      DOCUMENTS[8], // Notes on Notes
      DOCUMENTS[3], // How to Do Great Work
      DOCUMENTS[0], // Attention is all you need
      DOCUMENTS[1], // The Bitter Lesson
    ]
  }
}
