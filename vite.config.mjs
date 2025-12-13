import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
// vite.config.js
import { defineConfig } from 'vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  base: '/vault-mate/',
  plugins: [
    VueRouter(),
    Vue({ template: { transformAssetUrls } }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Vault Mate',
        short_name: 'VaultMate',
        description: 'A Vue PWA Application For Save Password Applications',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/vault-mate/',
        scope: '/vault-mate/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /\/.*\.(js|css|html|png|svg)/,
            handler: 'CacheFirst',
            options: { cacheName: 'assets-cache' },
          },
        ],
      },
    }),
    Vuetify({
      autoImport: true,
      styles: { configFile: 'src/styles/settings.scss' },
    }),
    Components(),
    Fonts({
      fontsource: {
        families: [
          { name: 'Roboto', weights: [100, 300, 400, 500, 700, 900], styles: ['normal', 'italic'] },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: { '@': fileURLToPath(new URL('src', import.meta.url)) },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    host: true,
    port: 3000,
    proxy: {},
  },
})
