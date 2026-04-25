export type Session = {
  id: string
  title: string
}

export type SessionCategory = {
  id: string
  label: string
}

export interface SessionService {
  /** Sessions currently open as tabs in the chat frame. */
  listOpenSessions(): Promise<Session[]>
  /** Sidebar buckets when the Sessions section is selected. */
  listCategories(): Promise<SessionCategory[]>
}
