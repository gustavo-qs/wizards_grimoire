// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "file:///C:/Users/lurik/Desktop/dnd-castro/spell_search/node_modules/vite-plugin-pwa/dist/index.js";
import { defineConfig } from "file:///C:/Users/lurik/Desktop/dnd-castro/spell_search/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/lurik/Desktop/dnd-castro/spell_search/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/lurik/Desktop/dnd-castro/spell_search/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        cleanupOutdatedCaches: false,
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"]
        }
      },
      registerType: "autoUpdate",
      injectRegister: "auto"
    })
  ],
  define: {
    "process.env": {}
  },
  base: "/spell_search/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  manifest: {
    name: "Spell Search",
    short_name: "Spell Search",
    description: "A simple spell search app for D&D 5e",
    theme_color: "#ffffff",
    display: "standalone",
    start_url: "/spell_search/",
    icons: [
      {
        src: "/public/icons8-dungeons-and-dragons-color-16.ico",
        sizes: "16x16",
        type: "image/x-icon"
      },
      {
        src: "/public/icons8-dungeons-and-dragons-color-120.png",
        sizes: "120x120",
        type: "image/png"
      },
      {
        src: "/public/icons8-dungeons-and-dragons-color-96.png",
        sizes: "96x96",
        type: "image/png"
      }
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsdXJpa1xcXFxEZXNrdG9wXFxcXGRuZC1jYXN0cm9cXFxcc3BlbGxfc2VhcmNoXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsdXJpa1xcXFxEZXNrdG9wXFxcXGRuZC1jYXN0cm9cXFxcc3BlbGxfc2VhcmNoXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9sdXJpay9EZXNrdG9wL2RuZC1jYXN0cm8vc3BlbGxfc2VhcmNoL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgd29ya2JveDoge1xuICAgICAgICBjbGVhbnVwT3V0ZGF0ZWRDYWNoZXM6IGZhbHNlLFxuICAgICAgICB3b3JrYm94OiB7XG4gICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnLGpzb24sdnVlLHR4dCx3b2ZmMn0nXVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgaW5qZWN0UmVnaXN0ZXI6ICdhdXRvJ1xuICAgIH0pXG4gIF0sXG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudic6IHt9XG4gIH0sXG4gIGJhc2U6ICcvc3BlbGxfc2VhcmNoLycsXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICB9XG4gIH0sXG4gIG1hbmlmZXN0OiB7XG4gICAgbmFtZTogJ1NwZWxsIFNlYXJjaCcsXG4gICAgc2hvcnRfbmFtZTogJ1NwZWxsIFNlYXJjaCcsXG4gICAgZGVzY3JpcHRpb246ICdBIHNpbXBsZSBzcGVsbCBzZWFyY2ggYXBwIGZvciBEJkQgNWUnLFxuICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxuICAgIHN0YXJ0X3VybDogJy9zcGVsbF9zZWFyY2gvJyxcbiAgICBpY29uczogW1xuICAgICAge1xuICAgICAgICBzcmM6ICcvcHVibGljL2ljb25zOC1kdW5nZW9ucy1hbmQtZHJhZ29ucy1jb2xvci0xNi5pY28nLFxuICAgICAgICBzaXplczogJzE2eDE2JyxcbiAgICAgICAgdHlwZTogJ2ltYWdlL3gtaWNvbidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHNyYzogJy9wdWJsaWMvaWNvbnM4LWR1bmdlb25zLWFuZC1kcmFnb25zLWNvbG9yLTEyMC5wbmcnLFxuICAgICAgICBzaXplczogJzEyMHgxMjAnLFxuICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc3JjOiAnL3B1YmxpYy9pY29uczgtZHVuZ2VvbnMtYW5kLWRyYWdvbnMtY29sb3ItOTYucG5nJyxcbiAgICAgICAgc2l6ZXM6ICc5Nng5NicsXG4gICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICB9XG4gICAgXVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VSxTQUFTLGVBQWUsV0FBVztBQUMzVyxTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBSCtMLElBQU0sMkNBQTJDO0FBTWhRLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFFBQVE7QUFBQSxNQUNOLFNBQVM7QUFBQSxRQUNQLHVCQUF1QjtBQUFBLFFBQ3ZCLFNBQVM7QUFBQSxVQUNQLGNBQWMsQ0FBQyxtREFBbUQ7QUFBQSxRQUNwRTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGNBQWM7QUFBQSxNQUNkLGdCQUFnQjtBQUFBLElBQ2xCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFVBQVU7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQSxJQUNiLFNBQVM7QUFBQSxJQUNULFdBQVc7QUFBQSxJQUNYLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxLQUFLO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsTUFDUjtBQUFBLE1BQ0E7QUFBQSxRQUNFLEtBQUs7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLFFBQ0UsS0FBSztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
