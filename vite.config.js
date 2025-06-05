import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VitePWA } from 'vite-plugin-pwa'

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
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 年
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?version=1`
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 年
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 天
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources-cache'
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Game Collection',
        short_name: 'GameCollection',
        description: '经典游戏集合应用，包含俄罗斯方块、贪吃蛇、拼图和记忆游戏',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        categories: ['games', 'entertainment'],
        lang: 'zh-CN',
        dir: 'ltr',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: '俄罗斯方块',
            short_name: 'Tetris',
            description: '经典俄罗斯方块游戏',
            url: '/games/tetris',
            icons: [
              {
                src: 'icons/tetris-96x96.png',
                sizes: '96x96'
              }
            ]
          },
          {
            name: '贪吃蛇',
            short_name: 'Snake',
            description: '经典贪吃蛇游戏',
            url: '/games/snake',
            icons: [
              {
                src: 'icons/snake-96x96.png',
                sizes: '96x96'
              }
            ]
          },
          {
            name: '拼图游戏',
            short_name: 'Puzzle',
            description: '拼图挑战游戏',
            url: '/games/puzzle',
            icons: [
              {
                src: 'icons/puzzle-96x96.png',
                sizes: '96x96'
              }
            ]
          },
          {
            name: '记忆翻牌',
            short_name: 'Memory',
            description: '记忆力挑战游戏',
            url: '/games/memory',
            icons: [
              {
                src: 'icons/memory-96x96.png',
                sizes: '96x96'
              }
            ]
          }
        ],
        screenshots: [
          {
            src: 'screenshots/desktop-1.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: '游戏主界面'
          },
          {
            src: 'screenshots/mobile-1.png',
            sizes: '375x667',
            type: 'image/png',
            form_factor: 'narrow',
            label: '移动端游戏界面'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
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
