export const PLATFORM_LAYOUT = {
  appDesktop: {
    // Top inset that clears the tab bar (and the macOS traffic lights
    // when not fullscreen). Constant across windowed/fullscreen so the
    // tab bar always sits in the same gutter aligned with the sidebar.
    topInset: 36,
    titleBarHeight: 36,
  },
} as const
