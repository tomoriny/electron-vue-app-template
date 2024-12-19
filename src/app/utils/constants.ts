import { resolve } from 'node:path'

export const dirname = import.meta.dirname

// Preload
export const preloadPath = resolve(dirname, 'preload.mjs')

// Protocol
export const appProtocolName = 'app'
export const pagePathBase = resolve('./dist')

export const pageUrl = import.meta.env.VITE_DEV_SERVER_URL
  ? import.meta.env.VITE_DEV_SERVER_URL
  : 'app://./index.html'
