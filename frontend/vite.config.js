import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://github-analyzer1-b1cm.onrender.com',
        changeOrigin: true
      }
    }
  }
});