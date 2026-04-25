import type { LibraryService } from '@/services/library/LibraryService'
import type { LibraryStore } from './LibraryStore'

/**
 * LibraryPresenter — loads documents for the Library section.
 *
 * Constructor takes the store and the LibraryService. Exposes only
 * action methods; the view reads `documents` and `documentsLoading`
 * directly off the store.
 */
export class LibraryPresenter {
  constructor(
    private store: LibraryStore,
    private libraryService: LibraryService,
  ) {}

  loadDocuments = async (): Promise<void> => {
    this.store.setDocumentsLoading(true)
    try {
      const docs = await this.libraryService.listDocuments()
      this.store.setDocuments(docs)
    } finally {
      this.store.setDocumentsLoading(false)
    }
  }
}
