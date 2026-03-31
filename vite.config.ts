import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: "/cinerec",
  server: {
    proxy: {
      '/api': {
        target: 'https://cinerec-production-9d02.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
