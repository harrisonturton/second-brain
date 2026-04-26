import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type CSSProperties, type MouseEvent } from 'react'
import styled from 'styled-components'
import { XIcon } from '@/base/icons/XIcon'
import { type Tab as TabModel } from './TabsStore'

const Tab = styled.div<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 12px;
  min-width: 80px;
  max-width: 220px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  color: ${({ $active, theme }) =>
    $active ? theme.textPrimary : theme.textSecondary};
  background: ${({ $active, theme }) =>
    $active ? theme.panelBorder : 'transparent'};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  -webkit-app-region: no-drag;
  transition: background 120ms ease, color 120ms ease;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.panelBorder : theme.subtleHoverBg};
    color: ${({ theme }) => theme.textPrimary};
  }
`

const Label = styled.span<{ $active: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.5;
  opacity: ${({ $active }) => ($active ? 1 : 0.65)};
  transition: opacity 120ms ease;

  ${Tab}:hover & {
    opacity: 1;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  background: ${({ theme }) => theme.subtleHoverBg};
  border: none;
  border-radius: 3px;
  color: ${({ theme }) => theme.textBody};
  cursor: pointer;
  opacity: 0;
  transition: background 120ms ease, opacity 120ms ease;

  ${Tab}:hover & {
    opacity: 1;
  }

  &:hover {
    background: ${({ theme }) => theme.panelBorder};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`

interface SortableTabProps {
  tab: TabModel
  active: boolean
  onActivate: () => void
  onClose: (e: MouseEvent) => void
}

export function SortableTab({
  tab,
  active,
  onActivate,
  onClose,
}: SortableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 'auto',
  }

  return (
    <Tab
      ref={setNodeRef}
      style={style}
      $active={active}
      onClick={onActivate}
      {...attributes}
      {...listeners}
    >
      <Label $active={active}>{tab.label}</Label>
      <CloseButton
        type="button"
        onClick={onClose}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={`Close ${tab.label}`}
      >
        <XIcon />
      </CloseButton>
    </Tab>
  )
}
