import { observer } from 'mobx-react-lite'
import { Fragment, useState, type MouseEvent } from 'react'
import styled from 'styled-components'
import { XIcon } from '../icons/XIcon'
import { useRootStore } from '../stores/RootStore'

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;
`

const Separator = styled.span`
  flex-shrink: 0;
  width: 1px;
  height: 10px;
  background: rgba(0, 0, 0, 0.08);
`

const Tab = styled.div<{ $active: boolean; $dragging: boolean }>`
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
  opacity: ${({ $dragging }) => ($dragging ? 0.4 : 1)};
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: background 120ms ease;

  &:hover {
    background: #f3f3f3;
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

export const TabBar = observer(function TabBar() {
  const store = useRootStore()
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const handleClose = (e: MouseEvent, id: string) => {
    e.stopPropagation()
    store.closeTab(id)
  }

  return (
    <Bar>
      {store.tabs.map((tab, index) => {
        const active = tab.id === store.activeTabId
        return (
          <Fragment key={tab.id}>
            {index > 0 && <Separator />}
            <Tab
              $active={active}
              $dragging={draggingId === tab.id}
              onClick={() => store.setActiveTab(tab.id)}
              draggable
              onDragStart={() => setDraggingId(tab.id)}
              onDragEnd={() => setDraggingId(null)}
              onDragOver={(e) => {
                if (draggingId && draggingId !== tab.id) e.preventDefault()
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (draggingId) store.moveTab(draggingId, tab.id)
                setDraggingId(null)
              }}
            >
              <Label $active={active}>{tab.label}</Label>
              <CloseButton
                type="button"
                onClick={(e) => handleClose(e, tab.id)}
                aria-label={`Close ${tab.label}`}
              >
                <XIcon />
              </CloseButton>
            </Tab>
          </Fragment>
        )
      })}
    </Bar>
  )
})
