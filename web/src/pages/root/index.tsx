import { autorun } from 'mobx'
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
    font-family: ${({ theme }) => theme.fontFamily};
    transition: background-color 200ms ease, color 200ms ease;
    user-select: none;
    -webkit-user-select: none;
  }
  button, input, textarea, select {
    font-family: ${({ theme }) => theme.fontFamily};
  }
  input, textarea, [contenteditable="true"] {
    user-select: text;
    -webkit-user-select: text;
  }
`

const DesktopTitleBar = styled.header<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${PLATFORM_LAYOUT.appDesktop.titleBarHeight}px;
  z-index: 40;
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  -webkit-app-region: drag;
  user-select: none;
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

  // Keep the <meta name="theme-color"> tag in sync with the current
  // theme's page background — Safari/mobile browsers tint their window
  // chrome to match.
  autorun(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', themeStore.theme.pageBg)
  })

  // Empty drag strip — gives the macOS window a draggable area on
  // pages without their own tab bar (e.g. login). The app page's tab
  // bar provides drag itself, so we skip this overlay there to avoid
  // hijacking clicks on the tabs.
  const TitleBarView = observer(() => {
    if (sessionStore.status === 'logged-in') return null
    return (
      <DesktopTitleBar
        $visible={windowStore.isDesktop && !windowStore.isDesktopFullScreen}
      />
    )
  })

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
