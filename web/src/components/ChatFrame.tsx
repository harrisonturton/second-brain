import styled from 'styled-components'
import { Composer } from './Composer'

const Frame = styled.div`
  position: fixed;
  top: 0;
  left: 252px;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
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

export function ChatFrame() {
  return (
    <Frame>
      <Messages>
        <Column />
      </Messages>
      <Composer />
    </Frame>
  )
}
