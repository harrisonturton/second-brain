import type { FunctionComponent } from 'react'

export type AppPageProps = {
  ActivityBar: FunctionComponent
  Sidebar: FunctionComponent
  /** The main content panel. Swapped depending on which section is
   *  active (the chat surface for sessions/library, the settings
   *  panel for settings). */
  Main: FunctionComponent
  /** Top-of-window tab bar. Renders only on desktop; on web the install
   *  passes a no-op component. */
  TabBar: FunctionComponent
}

/**
 * AppPage — stateless layout for the main app route (`/`). The setup
 * in `index.tsx` hands in pre-bound, observer-wrapped subcomponents;
 * this layout just composes them.
 */
export function AppPage({ ActivityBar, Sidebar, Main, TabBar }: AppPageProps) {
  return (
    <>
      <TabBar />
      <ActivityBar />
      <Sidebar />
      <Main />
    </>
  )
}
