export type Theme = {
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

export const lightTheme: Theme = {
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
  pageBg: '#e8dcc4',
  panelBg: '#f4ead3',
  panelBgFade: 'rgba(244, 234, 211, 0)',
  panelBorder: '#d6c9aa',
  panelShadow: '0 3px 10px rgba(80, 60, 20, 0.06), 0 1px 2px rgba(80, 60, 20, 0.04)',

  textPrimary: '#3a2e1c',
  textBody: '#5a4a32',
  textSecondary: '#8a7656',
  textTertiary: '#b3a482',
  textMuted: '#6b5a40',

  hoverBg: 'rgba(60, 40, 10, 0.06)',
  activeBg: 'rgba(60, 40, 10, 0.08)',
  subtleHoverBg: '#ebe0c5',
  divider: 'rgba(60, 40, 10, 0.1)',

  accentBg: '#3a2e1c',
  accentBgHover: '#4a3d28',
  accentBgDisabled: '#d6c9aa',
  accentFg: '#f4ead3',

  tocBar: '#cfc1a2',
  tocBarActive: '#8a7656',
}

export const themesByMode = {
  light: lightTheme,
  sepia: sepiaTheme,
  dark: darkTheme,
} as const

export type ThemeMode = keyof typeof themesByMode
