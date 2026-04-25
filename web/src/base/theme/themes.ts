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
  activeFg: string
  subtleHoverBg: string
  divider: string

  accentBg: string
  accentBgHover: string
  accentBgDisabled: string
  accentFg: string

  tocBar: string
}

const SANS_FONT_STACK =
  "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const SERIF_FONT_STACK =
  "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif"

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

function mixHex(hex: string, target: number, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(
    r + (target - r) * amount,
    g + (target - g) * amount,
    b + (target - b) * amount,
  )
}

const lighten = (hex: string, amount: number) => mixHex(hex, 255, amount)
const darken = (hex: string, amount: number) => mixHex(hex, 0, amount)

function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export type Swatch = { value: string; label: string }

export const LIGHT_ACCENT_SWATCHES: Swatch[] = [
  { value: '#475569', label: 'Slate' },
  { value: '#5d7c47', label: 'Moss' },
  { value: '#0d9488', label: 'Teal' },
  { value: '#5e5ce6', label: 'Indigo' },
  { value: '#7c3aed', label: 'Plum' },
  { value: '#e97451', label: 'Coral' },
]

export const LIGHT_PAGE_TINT_SWATCHES: Swatch[] = [
  { value: '#f6f6f6', label: 'Neutral' },
  { value: '#f4f1ea', label: 'Warm' },
  { value: '#edf2eb', label: 'Mint' },
  { value: '#ecf1f7', label: 'Sky' },
  { value: '#f0eef5', label: 'Lilac' },
  { value: '#f5eeec', label: 'Rose' },
]

export const DEFAULT_LIGHT_ACCENT = LIGHT_ACCENT_SWATCHES[1].value
export const DEFAULT_LIGHT_PAGE_TINT = LIGHT_PAGE_TINT_SWATCHES[0].value

export function buildLightTheme(accent: string, pageTint: string): Theme {
  const panelBg = lighten(pageTint, 0.65)
  return {
    fontFamily: SANS_FONT_STACK,

    pageBg: pageTint,
    panelBg,
    panelBgFade: withAlpha(panelBg, 0),
    panelBorder: darken(pageTint, 0.06),
    panelShadow:
      '0 3px 10px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',

    textPrimary: '#2a2a2a',
    textBody: '#4a4a4a',
    textSecondary: '#888888',
    textTertiary: '#b3b3b3',
    textMuted: '#6b6b6b',

    hoverBg: 'rgba(0, 0, 0, 0.06)',
    activeBg: withAlpha(accent, 0.16),
    activeFg: darken(accent, 0.35),
    subtleHoverBg: darken(pageTint, 0.015),
    divider: 'rgba(0, 0, 0, 0.08)',

    accentBg: accent,
    accentBgHover: darken(accent, 0.12),
    accentBgDisabled: '#dcdcdc',
    accentFg: '#ffffff',

    tocBar: '#d8d8d8',
  }
}

export const lightTheme = buildLightTheme(
  DEFAULT_LIGHT_ACCENT,
  DEFAULT_LIGHT_PAGE_TINT,
)

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
  activeFg: '#e8e8e8',
  subtleHoverBg: '#242424',
  divider: 'rgba(255, 255, 255, 0.1)',

  accentBg: '#f0f0f0',
  accentBgHover: '#ffffff',
  accentBgDisabled: '#2a2a2a',
  accentFg: '#181818',

  tocBar: '#383838',
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
  activeFg: '#322a1f',
  subtleHoverBg: '#f2eee5',
  divider: 'rgba(60, 40, 10, 0.08)',

  accentBg: '#322a1f',
  accentBgHover: '#42392c',
  accentBgDisabled: '#e0d8c5',
  accentFg: '#fbf9f4',

  tocBar: '#dcd4be',
}

export const themesByMode = {
  light: lightTheme,
  sepia: sepiaTheme,
  dark: darkTheme,
} as const

export type ThemeMode = keyof typeof themesByMode
