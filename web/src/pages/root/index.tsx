import { observer } from 'mobx-react-lite'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { makePage } from '@/base/page/Page'
import { ThemeStore } from '@/base/theme/ThemeStore'
import { WindowStore } from '@/base/window/WindowStore'
import { PLATFORM_LAYOUT } from '@/base/theme/platformLayout'
import HomePage from '@/pages/home'

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

/**
 * RootPage — the root of the HTML page. Owns the truly-global UI
 * stores (theme, window) and the global styling concerns
 * (`ThemeProvider`, body bg via `GlobalStyle`, the macOS title-bar
 * overlay).
 *
 * It picks the subpage based on the URL (today: only HomePage) and
 * passes the global stores down as page props. This is the mechanism
 * by which `themeStore` / `windowStore` reach every page — there is
 * no app-level RootStore construct.
 */
export default makePage(() => {
  const themeStore = new ThemeStore()
  const windowStore = new WindowStore()

  const TitleBarView = observer(() => (
    <DesktopTitleBar
      $visible={windowStore.isDesktop && !windowStore.isDesktopFullScreen}
    >
      Knowledge Engine
    </DesktopTitleBar>
  ))

  const RootView = observer(() => (
    <ThemeProvider theme={themeStore.theme}>
      <GlobalStyle />
      {/* TODO: route to the right subpage based on the URL. */}
      <HomePage themeStore={themeStore} windowStore={windowStore} />
      <TitleBarView />
    </ThemeProvider>
  ))

  return RootView
})
