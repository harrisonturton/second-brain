import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { ChatFrame } from './components/ChatFrame'
import { IconStrip } from './components/IconStrip'
import { Sidebar } from './components/Sidebar'
import { useRootStore } from './stores/RootStore'
import { PLATFORM_LAYOUT } from './theme/platformLayout'

const DesktopTitleBar = styled.header<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${PLATFORM_LAYOUT.appDesktop.titleBarHeight}px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  opacity: ${({ $visible }) => ($visible ? 0.82 : 0)};
  -webkit-app-region: drag;
  user-select: none;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #4b5563;
`

const App = observer(function App() {
  const store = useRootStore()
  return (
    <>
      <IconStrip />
      <Sidebar />
      <ChatFrame />
      <DesktopTitleBar $visible={store.isDesktop && !store.isDesktopFullScreen}>
        Knowledge Engine
      </DesktopTitleBar>
    </>
  )
})

export default App
