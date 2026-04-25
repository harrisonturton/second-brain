import type { FunctionComponent } from 'react'

export type HomePageProps = {
  ActivityBar: FunctionComponent
  Sidebar: FunctionComponent
  ChatFrame: FunctionComponent
}

/**
 * HomePage — stateless layout for the home route. The setup in
 * `index.tsx` hands in pre-bound, observer-wrapped subcomponents;
 * this layout just composes them.
 */
export function HomePage({
  ActivityBar,
  Sidebar,
  ChatFrame,
}: HomePageProps) {
  return (
    <>
      <ActivityBar />
      <Sidebar />
      <ChatFrame />
    </>
  )
}
