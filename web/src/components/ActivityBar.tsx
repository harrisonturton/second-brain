import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { BookOpenIcon } from '../icons/BookOpenIcon'
import { ChatBubblesIcon } from '../icons/ChatBubblesIcon'
import { CogIcon } from '../icons/CogIcon'
import { MoonIcon } from '../icons/MoonIcon'
import { SunIcon } from '../icons/SunIcon'
import { useRootStore, type WorkspaceSection } from '../stores/RootStore'

const Strip = styled.nav<{ $topInset: number }>`
  position: fixed;
  top: ${({ $topInset }) => `${$topInset}px`};
  left: 4px;
  bottom: 4px;
  width: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  gap: 4px;
  transition: top 260ms cubic-bezier(0.32, 0.72, 0, 1);
`

const Spacer = styled.div`
  flex: 1;
`

const IconButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: ${({ $active, theme }) =>
    $active ? theme.activeBg : 'transparent'};
  border: none;
  border-radius: 5px;
  color: ${({ $active, theme }) =>
    $active ? theme.textPrimary : theme.textSecondary};
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.hoverBg};
    color: ${({ theme }) => theme.textPrimary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const Avatar = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin: 3px 0;
  padding: 0;
  background: linear-gradient(135deg, #6b7e9a 0%, #3c4a5e 100%);
  border: none;
  border-radius: 50%;
  color: #fff;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: filter 120ms ease;

  &:hover {
    filter: brightness(1.1);
  }
`

const sectionIcons: { id: WorkspaceSection; label: string; Icon: typeof ChatBubblesIcon }[] = [
  { id: 'sessions', label: 'Sessions', Icon: ChatBubblesIcon },
  { id: 'library', label: 'Library', Icon: BookOpenIcon },
]

export const ActivityBar = observer(function ActivityBar() {
  const store = useRootStore()
  const activeSection = store.activeSection
  const isDark = store.themeMode === 'dark'

  return (
    <Strip $topInset={store.topInset}>
      {sectionIcons.map(({ id, label, Icon }) => (
        <IconButton
          key={id}
          $active={activeSection === id}
          onClick={() => store.selectSection(id)}
          aria-label={label}
          title={label}
        >
          <Icon />
        </IconButton>
      ))}
      <Spacer />
      <IconButton
        $active={false}
        onClick={() => store.toggleTheme()}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        type="button"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </IconButton>
      <IconButton
        $active={false}
        aria-label="Settings"
        title="Settings"
        type="button"
      >
        <CogIcon />
      </IconButton>
      <Avatar aria-label="Profile" title="Profile" type="button">
        HT
      </Avatar>
    </Strip>
  )
})
