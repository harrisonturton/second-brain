import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import styled, { keyframes } from 'styled-components'
import { DotIcon } from '@/base/icons/DotIcon'
import { MoreVerticalIcon } from '@/base/icons/MoreVerticalIcon'
import { XIcon } from '@/base/icons/XIcon'
import type { SidebarItem } from './NavigationStore'

const Container = styled.aside<{
  $collapsed: boolean
  $topInset: number
  $width: number
}>`
  position: fixed;
  top: ${({ $topInset }) => `${$topInset}px`};
  left: 44px;
  bottom: 4px;
  width: ${({ $width }) => `${$width}px`};
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

const ResizeHandle = styled.div<{
  $left: number
  $topInset: number
  $hidden: boolean
  $resizing: boolean
}>`
  position: fixed;
  top: ${({ $topInset }) => `${$topInset}px`};
  left: ${({ $left }) => `${$left - 2}px`};
  bottom: 4px;
  width: 8px;
  cursor: col-resize;
  z-index: 60;
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};

  &::before {
    content: '';
    position: absolute;
    top: 14px;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    border-radius: 1px;
    background: ${({ theme }) => theme.textBody};
    opacity: ${({ $resizing }) => ($resizing ? 1 : 0)};
    transition: opacity 120ms ease;
  }

  &:hover::before {
    opacity: 1;
  }
`

const PanelTitle = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  right: 31px;
  display: flex;
  align-items: center;
  height: 22px;
  padding: 0 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  color: ${({ theme }) => theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;
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

const Item = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1px 0;
  font-size: 13px;
  color: ${({ $selected, theme }) =>
    $selected ? theme.activeFg : theme.textPrimary};
  border-radius: 4px;
  background-clip: content-box;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.activeBg : 'transparent'};

  &:hover {
    background-color: ${({ $selected, theme }) =>
      $selected ? theme.activeBg : theme.subtleHoverBg};
  }
`

const Label = styled.button<{ $selected: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  line-height: 1.3;
  opacity: ${({ $selected }) => ($selected ? 1 : 0.65)};
  transition: opacity 120ms ease;

  ${Item}:hover & {
    opacity: 1;
  }
`

const LeadingIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;
  }
`

const GroupHeader = styled.div`
  margin: 14px 6px 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
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

export type SidebarLeadingAction = {
  label: string
  icon: ReactNode
  onClick: () => void
}

export type SidebarProps = {
  title: string
  items: SidebarItem[]
  selectedItemId: string | null
  loading: boolean
  collapsed: boolean
  topInset: number
  width: number
  resizing: boolean
  onSelectItem: (id: string) => void
  onToggleSidebar: () => void
  onResizeStart: (e: ReactPointerEvent<HTMLDivElement>) => void
  /** Optional row rendered above the items list, styled like an entry
   *  but with a leading icon. Used by the sessions section for "New
   *  session". */
  leadingAction?: SidebarLeadingAction
  /** Optional uppercase group header rendered above the items list. */
  itemsHeader?: string
}

export function Sidebar(props: SidebarProps) {
  const {
    title,
    items,
    selectedItemId,
    loading,
    collapsed,
    topInset,
    width,
    resizing,
    onSelectItem,
    onToggleSidebar,
    onResizeStart,
    leadingAction,
    itemsHeader,
  } = props

  return (
    <>
      <Container $collapsed={collapsed} $topInset={topInset} $width={width}>
        <PanelTitle>{title}</PanelTitle>
        <ToggleButton
          onClick={onToggleSidebar}
          aria-label="Close sidebar"
        >
          <XIcon />
        </ToggleButton>
        <Items>
          {leadingAction && (
            <Item $selected={false}>
              <Label
                $selected={false}
                onClick={leadingAction.onClick}
              >
                <LeadingIcon>{leadingAction.icon}</LeadingIcon>
                {leadingAction.label}
              </Label>
            </Item>
          )}
          {itemsHeader && <GroupHeader>{itemsHeader}</GroupHeader>}
          {loading && items.length === 0 ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            items.map((item) => {
              const selected = item.id === selectedItemId
              return (
                <Item key={item.id} $selected={selected}>
                  <Label
                    $selected={selected}
                    onClick={() => onSelectItem(item.id)}
                  >
                    <LeadingIcon>
                      <DotIcon />
                    </LeadingIcon>
                    {item.label}
                  </Label>
                  <MoreButton aria-label={`More options for ${item.label}`}>
                    <MoreVerticalIcon />
                  </MoreButton>
                </Item>
              )
            })
          )}
        </Items>
      </Container>
      <ResizeHandle
        $left={44 + width}
        $topInset={topInset}
        $hidden={collapsed}
        $resizing={resizing}
        onPointerDown={onResizeStart}
        role="separator"
        aria-label="Resize sidebar"
        aria-orientation="vertical"
      />
    </>
  )
}
