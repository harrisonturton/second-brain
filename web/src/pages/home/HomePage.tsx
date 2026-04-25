import type { FunctionComponent } from 'react'

export type HomePageProps = {
  ActivityBar: FunctionComponent
  Sidebar: FunctionComponent
  /** The main content panel. Swapped depending on which section is
   *  active (the chat surface for sessions/library, the settings
   *  panel for settings). */
  Main: FunctionComponent
}

/**
 * HomePage — stateless layout for the home route. The setup in
 * `index.tsx` hands in pre-bound, observer-wrapped subcomponents;
 * this layout just composes them.
 */
export function HomePage({ ActivityBar, Sidebar, Main }: HomePageProps) {
  return (
    <>
      <ActivityBar />
      <Sidebar />
      <Main />
    </>
  )
}
