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
import { SortableTab } from './SortableTab'
import type { Tab } from './TabsStore'

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.panelBorder};
`

export type TabBarProps = {
  tabs: Tab[]
  activeTabId: string | null
  onSelectTab: (id: string) => void
  onCloseTab: (id: string) => void
  onMoveTab: (draggedId: string, targetId: string) => void
}

export function TabBar({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onMoveTab,
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
        <Bar>
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
        </Bar>
      </SortableContext>
    </DndContext>
  )
}
