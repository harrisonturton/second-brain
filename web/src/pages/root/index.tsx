import { observer } from 'mobx-react-lite'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { makePage } from '@/base/page/Page'
import { SessionPresenter } from '@/base/session/SessionPresenter'
import { SessionStore } from '@/base/session/SessionStore'
import { ThemeStore } from '@/base/theme/ThemeStore'
import { WindowStore } from '@/base/window/WindowStore'
import { PLATFORM_LAYOUT } from '@/base/theme/platformLayout'
import AppPage from '@/pages/app'
import LoginPage from '@/pages/login'

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
 * stores (theme, window, session) and the global styling concerns
 * (`<ThemeProvider>`, body bg, the macOS title-bar overlay).
 *
 * Routes between subpages based on session status:
 *   - logged-out / logging-in  →  LoginPage at `/login`
 *   - logged-in                →  AppPage at `/`
 *
 * The global stores reach each subpage as page props — there is no
 * app-level store container.
 */
export default makePage((_props, { services }) => {
  const themeStore = new ThemeStore()
  const windowStore = new WindowStore()
  const sessionStore = new SessionStore()
  const sessionPresenter = new SessionPresenter(
    sessionStore,
    services.profileService,
    services.httpService,
  )
  sessionPresenter.restore()

  const TitleBarView = observer(() => (
    <DesktopTitleBar
      $visible={windowStore.isDesktop && !windowStore.isDesktopFullScreen}
    >
      Knowledge Engine
    </DesktopTitleBar>
  ))

  const RoutedSubpage = observer(() => {
    if (sessionStore.status === 'logged-in') {
      return (
        <AppPage
          themeStore={themeStore}
          windowStore={windowStore}
          sessionStore={sessionStore}
          sessionPresenter={sessionPresenter}
        />
      )
    }
    return (
      <LoginPage
        themeStore={themeStore}
        windowStore={windowStore}
        sessionStore={sessionStore}
        sessionPresenter={sessionPresenter}
      />
    )
  })

  const RootView = observer(() => (
    <ThemeProvider theme={themeStore.theme}>
      <GlobalStyle />
      <RoutedSubpage />
      <TitleBarView />
    </ThemeProvider>
  ))

  return RootView
})
