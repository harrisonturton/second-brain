import 'styled-components'
import type { Theme } from './themes'

declare module 'styled-components' {
  // Augment styled-components' DefaultTheme so `${({ theme }) => theme.x}`
  // gives full intellisense + type-checking for our token set.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
