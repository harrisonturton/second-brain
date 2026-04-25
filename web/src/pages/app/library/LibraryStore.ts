import { action, makeObservable, observable } from 'mobx'
import type { LibraryDocument } from '@/services/library/LibraryService'

/**
 * LibraryStore — state for the Library section's main panel.
 *
 * Holds the list of documents shown in the Browse view and the
 * loading flag. The presenter populates these by calling the
 * LibraryService.
 */
export class LibraryStore {
  @observable documents: LibraryDocument[] = []
  @observable documentsLoading = false

  constructor() {
    makeObservable(this)
  }

  @action setDocuments(documents: LibraryDocument[]) {
    this.documents = documents
  }

  @action setDocumentsLoading(value: boolean) {
    this.documentsLoading = value
  }
}
