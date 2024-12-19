import process from 'node:process'
import { BrowserWindow } from 'electron'

export function useHotReload() {
  process.on('message', (msg) => {
    if (msg === 'electron-vite&type=hot-reload') {
      for (const win of BrowserWindow.getAllWindows()) {
        // Hot reload preload scripts
        win.webContents.reload()
      }
    }
  })
}
