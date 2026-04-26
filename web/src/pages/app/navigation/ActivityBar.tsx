import styled from 'styled-components'
import { BookOpenIcon } from '@/base/icons/BookOpenIcon'
import { ChatBubblesIcon } from '@/base/icons/ChatBubblesIcon'
import { CogIcon } from '@/base/icons/CogIcon'
import { EyeIcon } from '@/base/icons/EyeIcon'
import { MoonIcon } from '@/base/icons/MoonIcon'
import { SearchIcon } from '@/base/icons/SearchIcon'
import { SparklesIcon } from '@/base/icons/SparklesIcon'
import { SunIcon } from '@/base/icons/SunIcon'
import type { WorkspaceSection } from './NavigationStore'
import type { ThemeMode } from '@/base/theme/themes'

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
  z-index: 50;
  transition: top 260ms cubic-bezier(0.32, 0.72, 0, 1);
`

const Tooltip = styled.span`
  position: absolute;
  left: calc(100% + 6px);
  top: 50%;
  transform: translate(-4px, -50%);
  padding: 5px 9px;
  background: ${({ theme }) => theme.activeBg};
  color: ${({ theme }) => theme.activeFg};
  font-size: 13px;
  line-height: 1;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  z-index: 100;
  transition:
    opacity 80ms ease,
    transform 100ms ease;
`

const TooltipHost = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover ${Tooltip} {
    opacity: 1;
    transform: translate(0, -50%);
  }
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
    $active ? theme.activeFg : theme.textSecondary};
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

function nextThemeToggle(mode: ThemeMode): {
  Icon: typeof ChatBubblesIcon
  label: string
} {
  if (mode === 'light') return { Icon: EyeIcon, label: 'Switch to sepia theme' }
  if (mode === 'sepia') return { Icon: MoonIcon, label: 'Switch to dark theme' }
  return { Icon: SunIcon, label: 'Switch to light theme' }
}

const sectionIcons: { id: WorkspaceSection; label: string; Icon: typeof ChatBubblesIcon }[] = [
  { id: 'sessions', label: 'Sessions', Icon: ChatBubblesIcon },
  { id: 'library', label: 'Library', Icon: BookOpenIcon },
  { id: 'agents', label: 'Agents', Icon: SparklesIcon },
]

export type ActivityBarProps = {
  activeSection: WorkspaceSection
  themeMode: ThemeMode
  topInset: number
  avatarInitials: string
  avatarTitle: string
  onSelectSection: (section: WorkspaceSection) => void
  onToggleTheme: () => void
  onProfileClick: () => void
  /** Always opens a fresh empty search — independent of selectSection's
   *  toggle-collapse behaviour. */
  onOpenNewSearch: () => void
}

export function ActivityBar(props: ActivityBarProps) {
  const {
    activeSection,
    themeMode,
    topInset,
    avatarInitials,
    avatarTitle,
    onSelectSection,
    onToggleTheme,
    onProfileClick,
    onOpenNewSearch,
  } = props
  const themeToggle = nextThemeToggle(themeMode)

  return (
    <Strip $topInset={topInset}>
      <TooltipHost>
        <IconButton
          $active={activeSection === 'search'}
          onClick={onOpenNewSearch}
          aria-label="New search"
          type="button"
        >
          <SearchIcon />
        </IconButton>
        <Tooltip>New search</Tooltip>
      </TooltipHost>
      {sectionIcons.map(({ id, label, Icon }) => (
        <TooltipHost key={id}>
          <IconButton
            $active={activeSection === id}
            onClick={() => onSelectSection(id)}
            aria-label={label}
          >
            <Icon />
          </IconButton>
          <Tooltip>{label}</Tooltip>
        </TooltipHost>
      ))}
      <Spacer />
      <TooltipHost>
        <IconButton
          $active={false}
          onClick={onToggleTheme}
          aria-label={themeToggle.label}
          type="button"
        >
          <themeToggle.Icon />
        </IconButton>
        <Tooltip>{themeToggle.label}</Tooltip>
      </TooltipHost>
      <TooltipHost>
        <IconButton
          $active={activeSection === 'settings'}
          onClick={() => onSelectSection('settings')}
          aria-label="Settings"
          type="button"
        >
          <CogIcon />
        </IconButton>
        <Tooltip>Settings</Tooltip>
      </TooltipHost>
      <TooltipHost>
        <Avatar
          aria-label={avatarTitle}
          type="button"
          onClick={onProfileClick}
        >
          {avatarInitials}
        </Avatar>
        <Tooltip>{avatarTitle}</Tooltip>
      </TooltipHost>
    </Strip>
  )
}
