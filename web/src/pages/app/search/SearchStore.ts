import { action, makeObservable, observable } from 'mobx'
import type {
  SearchHistoryItem,
  SearchResult,
} from '@/services/search/SearchService'

/**
 * SearchStore — state for the Search section's main panel.
 *
 * Holds the in-progress query the user is typing, the results of the
 * most recent search, the loading flag while a search runs, and the
 * full history list (also surfaced as sidebar items via the
 * NavigationPresenter — kept here too so the panel can look up labels
 * for the currently-selected history entry).
 */
export class SearchStore {
  @observable query = ''
  @observable results: SearchResult[] = []
  @observable searching = false
  @observable history: SearchHistoryItem[] = []

  constructor() {
    makeObservable(this)
  }

  @action setQuery(value: string) {
    this.query = value
  }

  @action setResults(results: SearchResult[]) {
    this.results = results
  }

  @action setSearching(value: boolean) {
    this.searching = value
  }

  @action setHistory(items: SearchHistoryItem[]) {
    this.history = items
  }

  @action reset() {
    this.query = ''
    this.results = []
    this.searching = false
  }
}
