import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '^/auth': {
        target: 'https://fintechbackend.online',
        changeOrigin: true,
        secure: true,
      },
      '^/courses': {
        target: 'https://fintechbackend.online',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
