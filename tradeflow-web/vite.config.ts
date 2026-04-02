import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@tauri-apps/api", "@tauri-apps/plugin-shell"]
  },
  build: {
    rollupOptions: {
      external: ["@tauri-apps/api", "@tauri-apps/plugin-shell"]
    }
  }
})
