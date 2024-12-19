import { useHotReload } from '@/app/utils/use-hot-reload'
import { BrowserWindow } from 'electron'
import { registerAppProtocol } from './utils/app-protocol'
import { pageUrl, preloadPath } from './utils/constants'
import { useCspHeaders } from './utils/use-csp-headers'

async function bootstrap() {
  await registerAppProtocol('app')

  useHotReload()
  useCspHeaders()

  const window = new BrowserWindow({
    webPreferences: {
      preload: preloadPath,
    },
  })

  window.loadURL(pageUrl)
}

bootstrap()
