import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { BookOpenIcon } from '../icons/BookOpenIcon'
import { ChatBubblesIcon } from '../icons/ChatBubblesIcon'
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon'
import { MoreVerticalIcon } from '../icons/MoreVerticalIcon'
import {
  useRootStore,
  type SidebarView,
} from '../stores/RootStore'

const ICON_STRIP_WIDTH = 40
const CONTENT_WIDTH = 220
const EXPANDED_WIDTH = ICON_STRIP_WIDTH + CONTENT_WIDTH

const Container = styled.aside<{ $collapsed: boolean }>`
  position: fixed;
  top: 4px;
  left: 4px;
  bottom: 4px;
  width: ${({ $collapsed }) =>
    $collapsed ? ICON_STRIP_WIDTH : EXPANDED_WIDTH}px;
  display: flex;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 7px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  will-change: width;
  transition: width 260ms cubic-bezier(0.32, 0.72, 0, 1);
`

const IconStrip = styled.div`
  flex-shrink: 0;
  width: ${ICON_STRIP_WIDTH}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  gap: 4px;
`

const IconButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: ${({ $active }) => ($active ? '#f1f1f1' : 'transparent')};
  border: none;
  border-radius: 5px;
  color: ${({ $active }) => ($active ? '#2a2a2a' : '#888')};
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;

  &:hover {
    background: #f3f3f3;
    color: #2a2a2a;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const ContentPanel = styled.div<{ $collapsed: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: ${CONTENT_WIDTH}px;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  pointer-events: ${({ $collapsed }) => ($collapsed ? 'none' : 'auto')};
  transition: opacity 200ms ease;
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
  color: #2a2a2a;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
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
  color: #6b6b6b;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
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
  color: #2a2a2a;
  border-radius: 4px;

  &:hover {
    background: #f3f3f3;
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
  color: #6b6b6b;
  cursor: pointer;
  opacity: 0;

  ${Item}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

const sessionItems = [
  'Inbox',
  'Today',
  'Upcoming',
  'Projects',
  'Notes',
  'Archive',
]

const libraryItems = [
  'Articles',
  'Notes',
  'Saved sources',
  'Highlights',
  'Collections',
]

const viewLabels: Record<SidebarView, string> = {
  sessions: 'Sessions',
  library: 'Library',
}

export const Sidebar = observer(function Sidebar() {
  const store = useRootStore()
  const collapsed = store.sidebarCollapsed
  const view = store.activeSidebarView
  const items = view === 'sessions' ? sessionItems : libraryItems

  return (
    <Container $collapsed={collapsed}>
      <IconStrip>
        <IconButton
          $active={view === 'sessions'}
          onClick={() => store.selectSidebarView('sessions')}
          aria-label="Sessions"
          title="Sessions"
        >
          <ChatBubblesIcon />
        </IconButton>
        <IconButton
          $active={view === 'library'}
          onClick={() => store.selectSidebarView('library')}
          aria-label="Library"
          title="Library"
        >
          <BookOpenIcon />
        </IconButton>
      </IconStrip>
      <ContentPanel $collapsed={collapsed}>
        <PanelTitle type="button">{viewLabels[view]}</PanelTitle>
        <ToggleButton
          onClick={() => store.toggleSidebar()}
          aria-label="Collapse sidebar"
        >
          <ChevronLeftIcon />
        </ToggleButton>
        <Items>
          {items.map((label) => (
            <Item key={label}>
              <Label>{label}</Label>
              <MoreButton aria-label={`More options for ${label}`}>
                <MoreVerticalIcon />
              </MoreButton>
            </Item>
          ))}
        </Items>
      </ContentPanel>
    </Container>
  )
})
