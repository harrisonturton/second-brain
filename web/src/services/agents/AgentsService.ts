export type Agent = {
  id: string
  label: string
}

export interface AgentsService {
  /** Sidebar list of running/known AI agents. */
  listAgents(): Promise<Agent[]>
}
