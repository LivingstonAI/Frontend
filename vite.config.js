import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'site.webmanifest'],
      workbox: {
        maximumFileSizeToCacheInBytes: 14 * 1024 * 1024, // 14 MB (accommodates your 13.7 MB bundle)
      },
      manifest: {
        name: "SnowAI",
        short_name: "SnowAI",
        description: "Building what others cannot imagine.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
})