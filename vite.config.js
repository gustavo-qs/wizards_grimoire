import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: "Wizard's Grimoire",
        short_name: "Wizard's Grimoire",
        description: "A simple Wizard's Grimoire app for D&D 5e",
        theme_color: '#ffffff',
        display: 'standalone',
        start_url: '/spell_search/',
        icons: [
          {
            src: '/public/icons8-dungeons-and-dragons-color-16.ico',
            sizes: '16x16',
            type: 'image/x-icon'
          },
          {
            src: '/public/icons8-dungeons-and-dragons-color-240.png',
            sizes: '240x240',
            type: 'image/png'
          },
          {
            src: '/public/icons8-dungeons-and-dragons-color-480.png',
            sizes: '480x480',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: false,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}']
      },
      registerType: 'autoUpdate',
      injectRegister: 'auto'
    })
  ],
  define: {
    'process.env': {}
  },
  base: '/spell_search/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
