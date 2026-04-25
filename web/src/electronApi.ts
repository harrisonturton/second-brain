export type WindowState = {
  isFullScreen: boolean
}

export type ElectronAPI = {
  platform: string
  getWindowState?: () => Promise<WindowState>
  onWindowStateChange?: (callback: (state: WindowState) => void) => () => void
}

export function getElectronApi(): ElectronAPI | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as Window & { electronAPI?: ElectronAPI }).electronAPI
}
