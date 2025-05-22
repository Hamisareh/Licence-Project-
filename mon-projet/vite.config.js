// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': { // Changé de '/api' à '/auth'
        target: 'http://192.168.90.20:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '/api/auth'), // Réécriture corrigée
        secure: false
      }
    }
  }
})