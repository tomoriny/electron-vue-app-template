import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld(import.meta.env.VITE_ELECTRON_APIKEY, {})
