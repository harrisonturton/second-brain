import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import styled from 'styled-components'
import { PlusIcon } from '@/base/icons/PlusIcon'
import { SortableTab } from './SortableTab'
import type { Tab } from './TabsStore'

const TRAFFIC_LIGHTS_GUTTER = 80
const SIDEBAR_LEFT = 44

const Bar = styled.div<{ $fullScreen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px 0
    ${({ $fullScreen }) =>
      $fullScreen ? `${SIDEBAR_LEFT}px` : `${TRAFFIC_LIGHTS_GUTTER}px`};
  z-index: 60;
  -webkit-app-region: drag;
  user-select: none;
  transition: padding-left 200ms ease;
`

const NewTabButton = styled.button`
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin-left: 2px;
  background: transparent;
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.subtleHoverBg};
    color: ${({ theme }) => theme.textPrimary};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

export type TabBarProps = {
  tabs: Tab[]
  activeTabId: string | null
  fullScreen: boolean
  onSelectTab: (id: string) => void
  onCloseTab: (id: string) => void
  onMoveTab: (draggedId: string, targetId: string) => void
  onNewTab: () => void
}

export function TabBar({
  tabs,
  activeTabId,
  fullScreen,
  onSelectTab,
  onCloseTab,
  onMoveTab,
  onNewTab,
}: TabBarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    onMoveTab(active.id as string, over.id as string)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tabs.map((t) => t.id)}
        strategy={horizontalListSortingStrategy}
      >
        <Bar $fullScreen={fullScreen}>
          {tabs.map((tab) => (
            <SortableTab
              key={tab.id}
              tab={tab}
              active={tab.id === activeTabId}
              onActivate={() => onSelectTab(tab.id)}
              onClose={(e) => {
                e.stopPropagation()
                onCloseTab(tab.id)
              }}
            />
          ))}
          <NewTabButton
            type="button"
            onClick={onNewTab}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="New tab"
            title="New tab"
          >
            <PlusIcon />
          </NewTabButton>
        </Bar>
      </SortableContext>
    </DndContext>
  )
}
