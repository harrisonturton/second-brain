import styled, { keyframes } from 'styled-components'
import { ChevronLeftIcon } from '@/base/icons/ChevronLeftIcon'
import { MoreVerticalIcon } from '@/base/icons/MoreVerticalIcon'
import type { SidebarItem } from './NavigationStore'

const PANEL_WIDTH = 220

const Container = styled.aside<{ $collapsed: boolean; $topInset: number }>`
  position: fixed;
  top: ${({ $topInset }) => `${$topInset}px`};
  left: 44px;
  bottom: 4px;
  width: ${PANEL_WIDTH}px;
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 7px;
  box-shadow: ${({ theme }) => theme.panelShadow};
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transform: ${({ $collapsed }) =>
    $collapsed ? 'translateX(-12px)' : 'translateX(0)'};
  pointer-events: ${({ $collapsed }) => ($collapsed ? 'none' : 'auto')};
  transition:
    opacity 200ms ease,
    transform 260ms cubic-bezier(0.32, 0.72, 0, 1),
    top 260ms cubic-bezier(0.32, 0.72, 0, 1);
`

const PanelTitle = styled.button`
  position: absolute;
  top: 5px;
  left: 5px;
  right: 31px;
  display: flex;
  align-items: center;
  height: 22px;
  padding: 0 6px;
  background: transparent;
  border: none;
  border-radius: 4px;
  font: inherit;
  font-size: 13px;
  line-height: 1;
  color: ${({ theme }) => theme.textPrimary};
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.subtleHoverBg};
  }
`

const ToggleButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 3px;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.hoverBg};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

const Items = styled.div`
  padding: 32px 5px 5px;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 13px;
  color: ${({ theme }) => theme.textPrimary};
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.subtleHoverBg};
  }
`

const Label = styled.button`
  flex: 1;
  padding: 4px 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  line-height: 1.3;
  opacity: 0.65;
  transition: opacity 120ms ease;

  ${Item}:hover & {
    opacity: 1;
  }
`

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 4px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 3px;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;
  opacity: 0;

  ${Item}:hover & {
    opacity: 1;
  }

  &:hover {
    background: ${({ theme }) => theme.hoverBg};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

const shimmer = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`

const SkeletonRow = styled.div`
  height: 18px;
  margin: 4px 6px;
  border-radius: 4px;
  background: ${({ theme }) => theme.subtleHoverBg};
  animation: ${shimmer} 1.2s ease-in-out infinite;
`

export type SidebarViewProps = {
  title: string
  items: SidebarItem[]
  loading: boolean
  collapsed: boolean
  topInset: number
  onToggleSidebar: () => void
}

export function SidebarView(props: SidebarViewProps) {
  const { title, items, loading, collapsed, topInset, onToggleSidebar } = props

  return (
    <Container $collapsed={collapsed} $topInset={topInset}>
      <PanelTitle type="button">{title}</PanelTitle>
      <ToggleButton
        onClick={onToggleSidebar}
        aria-label="Collapse sidebar"
      >
        <ChevronLeftIcon />
      </ToggleButton>
      <Items>
        {loading && items.length === 0 ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          items.map((item) => (
            <Item key={item.id}>
              <Label>{item.label}</Label>
              <MoreButton aria-label={`More options for ${item.label}`}>
                <MoreVerticalIcon />
              </MoreButton>
            </Item>
          ))
        )}
      </Items>
    </Container>
  )
}
