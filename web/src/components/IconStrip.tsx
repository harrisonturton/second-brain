import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { BookOpenIcon } from '../icons/BookOpenIcon'
import { ChatBubblesIcon } from '../icons/ChatBubblesIcon'
import { useRootStore } from '../stores/RootStore'

const Strip = styled.nav`
  position: fixed;
  top: 4px;
  left: 4px;
  bottom: 4px;
  width: 36px;
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
  background: ${({ $active }) =>
    $active ? 'rgba(0, 0, 0, 0.07)' : 'transparent'};
  border: none;
  border-radius: 5px;
  color: ${({ $active }) => ($active ? '#2a2a2a' : '#7a7a7a')};
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #2a2a2a;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

export const IconStrip = observer(function IconStrip() {
  const store = useRootStore()
  const view = store.activeSidebarView

  return (
    <Strip>
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
    </Strip>
  )
})
