import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const WINDOW_STATE_CHANNEL = 'app-desktop:window-state'
const GET_WINDOW_STATE_CHANNEL = 'app-desktop:get-window-state'

// Matches PLATFORM_LAYOUT.appDesktop.titleBarHeight in the renderer.
const TITLE_BAR_HEIGHT = 44

function createWindow() {
  const isMac = process.platform === 'darwin'

  const win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: '',
    ...(isMac
      ? {
          // macOS: hide title bar but keep native traffic lights at the standard inset.
          titleBarStyle: 'hiddenInset' as const,
        }
      : {
          // Windows/Linux: hide title text and draw window controls as an overlay.
          titleBarStyle: 'hidden' as const,
          titleBarOverlay: {
            color: '#111827',
            symbolColor: '#e5e7eb',
            height: TITLE_BAR_HEIGHT,
          },
        }),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Required for ESM preload scripts; contextIsolation + nodeIntegration:false
      // keep the renderer isolated.
      sandbox: false,
    },
  })

  const emitWindowState = () => {
    win.webContents.send(WINDOW_STATE_CHANNEL, {
      isFullScreen: win.isFullScreen(),
    })
  }
  // Re-emit shortly after each event because macOS fullscreen transitions
  // animate, and querying state mid-animation can be stale.
  const emitWindowStateWithDelay = () => {
    emitWindowState()
    setTimeout(emitWindowState, 120)
  }

  win.on('enter-full-screen', emitWindowStateWithDelay)
  win.on('leave-full-screen', emitWindowStateWithDelay)

  const devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (devServerUrl) {
    void win.loadURL(devServerUrl)
    win.webContents.once('did-finish-load', emitWindowState)
    win.webContents.openDevTools({ mode: 'detach' })
    return
  }

  void win.loadFile(path.join(__dirname, '../dist/index.html'))
  win.webContents.once('did-finish-load', emitWindowState)
}

ipcMain.handle(GET_WINDOW_STATE_CHANNEL, (event) => {
  const sourceWindow = BrowserWindow.fromWebContents(event.sender)
  return {
    isFullScreen: sourceWindow ? sourceWindow.isFullScreen() : false,
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
