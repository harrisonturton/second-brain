import type { ReactNode } from 'react'
import styled from 'styled-components'

const Panel = styled.div<{ $sidebarCollapsed: boolean; $topInset: number }>`
  position: fixed;
  top: ${({ $topInset }) => `${$topInset}px`};
  left: ${({ $sidebarCollapsed }) => ($sidebarCollapsed ? '44px' : '268px')};
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
  transition:
    left 260ms cubic-bezier(0.32, 0.72, 0, 1),
    top 260ms cubic-bezier(0.32, 0.72, 0, 1);
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
  /** Slot for the developer-settings view; the install file binds it
   *  to the SettingsPresenter. Only rendered when the developer item
   *  is selected. */
  developerSettings: ReactNode
}

export function SettingsPanel({
  selectedItemId,
  sidebarCollapsed,
  topInset,
  developerSettings,
}: SettingsPanelProps) {
  return (
    <Panel $sidebarCollapsed={sidebarCollapsed} $topInset={topInset}>
      <Body>
        <Column>
          {selectedItemId === 'developer' && developerSettings}
          {selectedItemId === 'user' && <Empty>User settings coming soon.</Empty>}
          {selectedItemId === null && (
            <Empty>Pick a settings section from the sidebar.</Empty>
          )}
        </Column>
      </Body>
    </Panel>
  )
}
