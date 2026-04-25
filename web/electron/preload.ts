import { contextBridge, ipcRenderer } from 'electron'

const WINDOW_STATE_CHANNEL = 'app-desktop:window-state'
const GET_WINDOW_STATE_CHANNEL = 'app-desktop:get-window-state'

type WindowState = {
  isFullScreen: boolean
}

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  getWindowState: () => ipcRenderer.invoke(GET_WINDOW_STATE_CHANNEL) as Promise<WindowState>,
  onWindowStateChange: (callback: (state: WindowState) => void) => {
    const listener = (_event: unknown, state: WindowState) => callback(state)
    ipcRenderer.on(WINDOW_STATE_CHANNEL, listener)
    return () => {
      ipcRenderer.removeListener(WINDOW_STATE_CHANNEL, listener)
    }
  },
})
