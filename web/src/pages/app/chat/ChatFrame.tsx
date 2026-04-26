import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Composer } from './Composer'
import { ExampleContent } from './ExampleContent'
import { TableOfContents, type TocEntry } from './TableOfContents'

const Frame = styled.div<{
  $sidebarCollapsed: boolean
  $topInset: number
  $sidebarWidth: number
  $resizing: boolean
}>`
  position: fixed;
  top: ${({ $topInset }) => `${$topInset}px`};
  left: ${({ $sidebarCollapsed, $sidebarWidth }) =>
    $sidebarCollapsed ? '44px' : `${44 + $sidebarWidth + 4}px`};
  right: 4px;
  bottom: 4px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 7px;
  box-shadow: ${({ theme }) => theme.panelShadow};
  overflow: hidden;
  will-change: left;
  transition: ${({ $resizing }) =>
    $resizing
      ? 'top 260ms cubic-bezier(0.32, 0.72, 0, 1)'
      : 'left 260ms cubic-bezier(0.32, 0.72, 0, 1), top 260ms cubic-bezier(0.32, 0.72, 0, 1)'};
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
`

const Main = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`

const Messages = styled.div`
  position: absolute;
  inset: 0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
`

const Column = styled.div`
  width: 100%;
  max-width: 720px;
  padding: 48px 24px 180px;
  user-select: text;
  -webkit-user-select: text;
`

const ComposerSlot = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`

const tocEntries: TocEntry[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'concepts', label: 'Concepts', level: 2 },
  { id: 'sources', label: 'Sources', level: 2 },
  { id: 'discussion', label: 'Discussion' },
]

export type ChatFrameProps = {
  sidebarCollapsed: boolean
  topInset: number
  sidebarWidth: number
  resizing: boolean
  /** Stateful breadcrumb strip rendered at the top of the panel. */
  breadcrumbBar: ReactNode
}

export function ChatFrame({
  sidebarCollapsed,
  topInset,
  sidebarWidth,
  resizing,
  breadcrumbBar,
}: ChatFrameProps) {
  return (
    <Frame
      $sidebarCollapsed={sidebarCollapsed}
      $topInset={topInset}
      $sidebarWidth={sidebarWidth}
      $resizing={resizing}
    >
      <Body>
        <TableOfContents entries={tocEntries} />
        <Main>
          <Messages>
            <Column>
              <ExampleContent />
            </Column>
          </Messages>
          <ComposerSlot>
            <Composer />
          </ComposerSlot>
        </Main>
      </Body>
      {breadcrumbBar}
    </Frame>
  )
}
