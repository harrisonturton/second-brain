import type { HttpService } from '@/services/http/HttpService'
import type { LibraryCategory, LibraryService } from './LibraryService'

const CATEGORIES: LibraryCategory[] = [
  { id: 'articles', label: 'Articles' },
  { id: 'notes', label: 'Notes' },
  { id: 'saved-sources', label: 'Saved sources' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'collections', label: 'Collections' },
]

export class FakeLibraryService implements LibraryService {
  constructor(private http: HttpService) {}

  async listCategories(): Promise<LibraryCategory[]> {
    await this.http.request({ method: 'GET', path: '/library/categories' })
    return CATEGORIES
  }
}
