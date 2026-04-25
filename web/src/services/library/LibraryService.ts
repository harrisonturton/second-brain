export type LibraryCategory = {
  id: string
  label: string
}

export interface LibraryService {
  /** Sidebar buckets when the Library section is selected. */
  listCategories(): Promise<LibraryCategory[]>
}
