import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n', 'pinia'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/utils', 'src/composables'],
      vueTemplate: true
    }),
    Components({
      dts: 'src/components.d.ts',
      dirs: ['src/components']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@games': resolve(__dirname, 'src/games'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@i18n': resolve(__dirname, 'src/i18n'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
