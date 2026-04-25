import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type CSSProperties, type MouseEvent } from 'react'
import styled from 'styled-components'
import { XIcon } from '../icons/XIcon'
import { type Tab as TabModel } from '../stores/RootStore'

const Tab = styled.div<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  max-width: 220px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1;
  color: #2a2a2a;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: background 120ms ease;

  &:hover {
    background: #f3f3f3;
  }

  &:not(:first-child)::before {
    content: '';
    position: absolute;
    left: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 10px;
    background: rgba(0, 0, 0, 0.08);
  }
`

const Label = styled.span<{ $active: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: ${({ $active }) => ($active ? 1 : 0.65)};
  transition: opacity 120ms ease;

  ${Tab}:hover & {
    opacity: 1;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 3px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  background: #f3f3f3;
  border: none;
  border-radius: 3px;
  color: #4a4a4a;
  cursor: pointer;
  opacity: 0;
  transition: background 120ms ease, opacity 120ms ease;

  ${Tab}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #e5e5e5;
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
