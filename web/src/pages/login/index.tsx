import { observer } from 'mobx-react-lite'
import { makePage } from '@/base/page/Page'
import type { SessionPresenter } from '@/base/session/SessionPresenter'
import type { SessionStore } from '@/base/session/SessionStore'
import type { ThemeStore } from '@/base/theme/ThemeStore'
import type { WindowStore } from '@/base/window/WindowStore'
import { LoginPanel } from './LoginPanel'

/**
 * LoginPage install. Stateless `LoginPanel` view; the install just
 * binds the form's submit + provider handlers to the SessionPresenter
 * and reads submitting/error flags off the SessionStore. The local
 * email/password state lives inside `LoginPanel` because no other
 * component needs to read it.
 */
export default makePage<{
  themeStore: ThemeStore
  windowStore: WindowStore
  sessionStore: SessionStore
  sessionPresenter: SessionPresenter
}>(({ windowStore, sessionStore, sessionPresenter }) => {
  const LoginView = observer(() => (
    <LoginPanel
      topInset={windowStore.topInset}
      submitting={sessionStore.status === 'logging-in'}
      errorMessage={sessionStore.loginError}
      onSubmit={(email, password) => {
        void sessionPresenter.login(email, password)
      }}
      onLoginWithProvider={(provider) => {
        void sessionPresenter.loginWithProvider(provider)
      }}
    />
  ))

  return LoginView
})
