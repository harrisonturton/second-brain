import { action, makeObservable, observable } from 'mobx'

export type Tab = {
  id: string
  label: string
}

export class TabsStore {
  @observable tabs: Tab[] = []
  @observable activeTabId: string | null = null
  @observable loading = false

  constructor() {
    makeObservable(this)
  }

  @action setTabs(tabs: Tab[]) {
    this.tabs = tabs
  }

  @action setActiveTabId(id: string | null) {
    this.activeTabId = id
  }

  @action setLoading(value: boolean) {
    this.loading = value
  }
}
