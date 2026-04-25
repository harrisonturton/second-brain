import styled from 'styled-components'

const Heading = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.01em;
`

const LogoutButton = styled.button`
  padding: 8px 14px;
  font: inherit;
  font-size: 13px;
  color: ${({ theme }) => theme.textPrimary};
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 6px;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.subtleHoverBg};
  }
`

export type UserSettingsProps = {
  onLogout: () => void
}

export function UserSettings({ onLogout }: UserSettingsProps) {
  return (
    <>
      <Heading>User</Heading>
      <LogoutButton type="button" onClick={onLogout}>
        Log out
      </LogoutButton>
    </>
  )
}
