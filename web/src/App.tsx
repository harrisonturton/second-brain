import { observer } from 'mobx-react-lite'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { HomePage } from '@/pages/home/HomePage'
import { useRootStore } from '@/stores/RootStore'
import { PLATFORM_LAYOUT } from '@/base/theme/platformLayout'

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.pageBg};
    color: ${({ theme }) => theme.textPrimary};
    transition: background-color 200ms ease, color 200ms ease;
  }
`

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
  color: ${({ theme }) => theme.textSecondary};
`

const App = observer(function App() {
  const { themeStore, windowStore } = useRootStore()
  return (
    <ThemeProvider theme={themeStore.theme}>
      <GlobalStyle />
      <HomePage />
      <DesktopTitleBar
        $visible={windowStore.isDesktop && !windowStore.isDesktopFullScreen}
      >
        Knowledge Engine
      </DesktopTitleBar>
    </ThemeProvider>
  )
})

export default App
