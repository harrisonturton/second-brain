export type Minion = {
  id: string
  label: string
}

export interface MinionsService {
  /** Sidebar list of running/known AI agents (minions). */
  listMinions(): Promise<Minion[]>
}
