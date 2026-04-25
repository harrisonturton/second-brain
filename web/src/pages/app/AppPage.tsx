import type { FunctionComponent } from 'react'

export type AppPageProps = {
  ActivityBar: FunctionComponent
  Sidebar: FunctionComponent
  /** The main content panel. Swapped depending on which section is
   *  active (the chat surface for sessions/library, the settings
   *  panel for settings). */
  Main: FunctionComponent
}

/**
 * AppPage — stateless layout for the main app route (`/`). The setup
 * in `index.tsx` hands in pre-bound, observer-wrapped subcomponents;
 * this layout just composes them.
 */
export function AppPage({ ActivityBar, Sidebar, Main }: AppPageProps) {
  return (
    <>
      <ActivityBar />
      <Sidebar />
      <Main />
    </>
  )
}
