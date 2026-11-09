import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Encaminha /api para o back-end, evitando problemas de CORS no dev
    proxy: {
      '/api': 'http://localhost:3333',
    },
  },
})
