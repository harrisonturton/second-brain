import { action } from 'mobx'
import type { SearchService } from '@/services/search/SearchService'
import type { SearchStore } from './SearchStore'

/**
 * SearchPresenter — orchestrates the Search section.
 *
 * `loadHistory` populates the sidebar history list. `runSearch` fires
 * a query, populates `results`, and would (in a real impl) prepend a
 * fresh history entry. `reset` clears the in-progress query/results
 * so the panel returns to its empty "new search" state.
 */
export class SearchPresenter {
  private searchId = 0

  constructor(
    private store: SearchStore,
    private searchService: SearchService,
  ) {}

  loadHistory = async (): Promise<void> => {
    const items = await this.searchService.listHistory()
    this.store.setHistory(items)
  }

  setQuery = (value: string): void => {
    this.store.setQuery(value)
  }

  reset = action((): void => {
    this.store.reset()
  })

  runSearch = async (query: string): Promise<void> => {
    const trimmed = query.trim()
    if (!trimmed) return
    const token = ++this.searchId
    this.store.setQuery(trimmed)
    this.store.setResults([])
    this.store.setSearching(true)
    try {
      const results = await this.searchService.search(trimmed)
      if (token !== this.searchId) return
      this.store.setResults(results)
    } finally {
      if (token === this.searchId) {
        this.store.setSearching(false)
      }
    }
  }
}
