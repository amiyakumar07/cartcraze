import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    cssMinify: false
  },
  server: {
    port: 3030,
    host: true,
    strictPort: true
  }
})
