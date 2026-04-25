export type Theme = {
  fontFamily: string

  pageBg: string
  panelBg: string
  panelBgFade: string
  panelBorder: string
  panelShadow: string

  textPrimary: string
  textBody: string
  textSecondary: string
  textTertiary: string
  textMuted: string

  hoverBg: string
  activeBg: string
  subtleHoverBg: string
  divider: string

  accentBg: string
  accentBgHover: string
  accentBgDisabled: string
  accentFg: string

  tocBar: string
  tocBarActive: string
}

const SANS_FONT_STACK =
  "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const SERIF_FONT_STACK =
  "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif"

export const lightTheme: Theme = {
  fontFamily: SANS_FONT_STACK,

  pageBg: '#f6f6f6',
  panelBg: '#ffffff',
  panelBgFade: 'rgba(255, 255, 255, 0)',
  panelBorder: '#e8e8e8',
  panelShadow: '0 3px 10px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',

  textPrimary: '#2a2a2a',
  textBody: '#4a4a4a',
  textSecondary: '#888888',
  textTertiary: '#b3b3b3',
  textMuted: '#6b6b6b',

  hoverBg: 'rgba(0, 0, 0, 0.06)',
  activeBg: 'rgba(0, 0, 0, 0.07)',
  subtleHoverBg: '#f3f3f3',
  divider: 'rgba(0, 0, 0, 0.08)',

  accentBg: '#1f1f1f',
  accentBgHover: '#2f2f2f',
  accentBgDisabled: '#dcdcdc',
  accentFg: '#ffffff',

  tocBar: '#d8d8d8',
  tocBarActive: '#888888',
}

export const darkTheme: Theme = {
  fontFamily: SANS_FONT_STACK,

  pageBg: '#0e0e0e',
  panelBg: '#181818',
  panelBgFade: 'rgba(24, 24, 24, 0)',
  panelBorder: '#2a2a2a',
  panelShadow: '0 3px 10px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)',

  textPrimary: '#e8e8e8',
  textBody: '#b8b8b8',
  textSecondary: '#888888',
  textTertiary: '#5a5a5a',
  textMuted: '#9a9a9a',

  hoverBg: 'rgba(255, 255, 255, 0.06)',
  activeBg: 'rgba(255, 255, 255, 0.09)',
  subtleHoverBg: '#242424',
  divider: 'rgba(255, 255, 255, 0.1)',

  accentBg: '#f0f0f0',
  accentBgHover: '#ffffff',
  accentBgDisabled: '#2a2a2a',
  accentFg: '#181818',

  tocBar: '#383838',
  tocBarActive: '#888888',
}

export const sepiaTheme: Theme = {
  fontFamily: SERIF_FONT_STACK,

  pageBg: '#f4f1ea',
  panelBg: '#fbf9f4',
  panelBgFade: 'rgba(251, 249, 244, 0)',
  panelBorder: '#ebe7dd',
  panelShadow: '0 3px 10px rgba(80, 60, 20, 0.04), 0 1px 2px rgba(80, 60, 20, 0.03)',

  textPrimary: '#322a1f',
  textBody: '#544a3a',
  textSecondary: '#8c8270',
  textTertiary: '#bab09c',
  textMuted: '#6e6452',

  hoverBg: 'rgba(60, 40, 10, 0.05)',
  activeBg: 'rgba(60, 40, 10, 0.07)',
  subtleHoverBg: '#f2eee5',
  divider: 'rgba(60, 40, 10, 0.08)',

  accentBg: '#322a1f',
  accentBgHover: '#42392c',
  accentBgDisabled: '#e0d8c5',
  accentFg: '#fbf9f4',

  tocBar: '#dcd4be',
  tocBarActive: '#8c8270',
}

export const themesByMode = {
  light: lightTheme,
  sepia: sepiaTheme,
  dark: darkTheme,
} as const

export type ThemeMode = keyof typeof themesByMode
