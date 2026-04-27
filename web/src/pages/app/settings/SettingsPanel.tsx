import type { ReactNode } from 'react'
import styled from 'styled-components'

const Panel = styled.div<{
  $sidebarCollapsed: boolean
  $topInset: number
  $sidebarWidth: number
  $resizing: boolean
  $expanded: boolean
}>`
  position: fixed;
  top: ${({ $topInset, $expanded }) => ($expanded ? '4px' : `${$topInset}px`)};
  left: ${({ $sidebarCollapsed, $sidebarWidth, $expanded }) =>
    $expanded
      ? '4px'
      : $sidebarCollapsed
        ? '44px'
        : `${44 + $sidebarWidth + 4}px`};
  right: 4px;
  bottom: 4px;
  z-index: ${({ $expanded }) => ($expanded ? 70 : 'auto')};
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
  overflow-y: auto;
  display: flex;
  justify-content: center;
`

const Column = styled.div`
  width: 100%;
  max-width: 720px;
  padding: 48px 24px;
`

const Empty = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`

export type SettingsPanelProps = {
  selectedItemId: string | null
  sidebarCollapsed: boolean
  topInset: number
  sidebarWidth: number
  resizing: boolean
  expanded: boolean
  /** Slots for the per-item settings views. The install file binds
   *  them to their stores/presenters; only the slot for the selected
   *  sidebar item is rendered. */
  userSettings: ReactNode
  appearanceSettings: ReactNode
  developerSettings: ReactNode
  breadcrumbBar: ReactNode
}

export function SettingsPanel({
  selectedItemId,
  sidebarCollapsed,
  topInset,
  sidebarWidth,
  resizing,
  expanded,
  userSettings,
  appearanceSettings,
  developerSettings,
  breadcrumbBar,
}: SettingsPanelProps) {
  return (
    <Panel
      $sidebarCollapsed={sidebarCollapsed}
      $topInset={topInset}
      $sidebarWidth={sidebarWidth}
      $resizing={resizing}
      $expanded={expanded}
    >
      <Body>
        <Column>
          {selectedItemId === 'user' && userSettings}
          {selectedItemId === 'appearance' && appearanceSettings}
          {selectedItemId === 'developer' && developerSettings}
          {selectedItemId === null && (
            <Empty>Pick a settings section from the sidebar.</Empty>
          )}
        </Column>
      </Body>
      {breadcrumbBar}
    </Panel>
  )
}
