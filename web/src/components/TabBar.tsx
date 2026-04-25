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
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useRootStore } from '../stores/RootStore'
import { SortableTab } from './SortableTab'

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;
`

export const TabBar = observer(function TabBar() {
  const store = useRootStore()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    store.moveTab(active.id as string, over.id as string)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={store.tabs.map((t) => t.id)}
        strategy={horizontalListSortingStrategy}
      >
        <Bar>
          {store.tabs.map((tab) => (
            <SortableTab
              key={tab.id}
              tab={tab}
              active={tab.id === store.activeTabId}
              onActivate={() => store.setActiveTab(tab.id)}
              onClose={(e) => {
                e.stopPropagation()
                store.closeTab(tab.id)
              }}
            />
          ))}
        </Bar>
      </SortableContext>
    </DndContext>
  )
})
