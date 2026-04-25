import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useRootStore } from '../stores/RootStore'
import { Composer } from './Composer'

const Frame = styled.div<{ $sidebarCollapsed: boolean }>`
  position: fixed;
  top: 4px;
  left: ${({ $sidebarCollapsed }) => ($sidebarCollapsed ? '40px' : '248px')};
  right: 4px;
  bottom: 4px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 7px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  will-change: left;
  transition: left 260ms cubic-bezier(0.32, 0.72, 0, 1);
`

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
`

const Column = styled.div`
  width: 100%;
  max-width: 720px;
  padding: 32px 24px 24px;
`

export const ChatFrame = observer(function ChatFrame() {
  const { sidebarCollapsed } = useRootStore()
  return (
    <Frame $sidebarCollapsed={sidebarCollapsed}>
      <Messages>
        <Column />
      </Messages>
      <Composer />
    </Frame>
  )
})
