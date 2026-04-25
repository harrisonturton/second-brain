import type { FunctionComponent } from 'react'

export type HomePageViewProps = {
  ActivityBar: FunctionComponent
  Sidebar: FunctionComponent
  ChatFrame: FunctionComponent
}

/**
 * HomePageView — stateless layout for the home route. The setup in
 * HomePage.tsx hands in pre-bound, observer-wrapped subcomponents;
 * this view just composes them.
 */
export function HomePageView({
  ActivityBar,
  Sidebar,
  ChatFrame,
}: HomePageViewProps) {
  return (
    <>
      <ActivityBar />
      <Sidebar />
      <ChatFrame />
    </>
  )
}
