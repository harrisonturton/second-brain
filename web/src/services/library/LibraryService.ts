export type LibraryCategory = {
  id: string
  label: string
}

export type LibraryDocument = {
  id: string
  title: string
  author: string
  source: string
  /** ISO date (YYYY-MM-DD) of original publication. */
  publishedDate: string
  /** ISO date (YYYY-MM-DD) the user added it to their library. */
  addedDate: string
}

export interface LibraryService {
  /** Sidebar buckets when the Library section is selected. */
  listCategories(): Promise<LibraryCategory[]>
  /** All documents currently saved in the library (Browse view). */
  listDocuments(): Promise<LibraryDocument[]>
  /** Recently viewed documents shown in the library sidebar. */
  listRecentlyViewed(): Promise<LibraryDocument[]>
}
