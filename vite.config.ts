import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import native from 'vite-plugin-native'

const alias = {
  '@': resolve(__dirname, 'src'),
  '@app': resolve(__dirname, 'src', 'app'),
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), electron({
    main: {
      entry: resolve(__dirname, './src/app/main.ts'),
      vite: {
        plugins: [native({})],
        resolve: {
          alias,
        },
      },
    },
    preload: {
      input: [
        resolve(__dirname, './src/app/utils/preload.ts'),
      ],
    },
  })],
  resolve: {
    alias,
  },
})
