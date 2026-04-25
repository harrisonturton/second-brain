export type SearchHistoryItem = {
  id: string
  query: string
  /** ISO date (YYYY-MM-DD) the search was performed. */
  performedAt: string
}

export type SearchResult = {
  id: string
  title: string
  snippet: string
  source: string
}

export interface SearchService {
  /** Recent searches the user has performed (sidebar history). */
  listHistory(): Promise<SearchHistoryItem[]>
  /** Run a search and return matching documents. */
  search(query: string): Promise<SearchResult[]>
}
