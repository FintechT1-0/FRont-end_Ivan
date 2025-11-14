// vite.config.js  (ESM)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    '/auth': {
      target: 'https://fintechbackend.online',
      changeOrigin: true,
      secure: false,
    },
  },
},
})
