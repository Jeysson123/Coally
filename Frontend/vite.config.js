import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        //target: 'http://localhost:5000', // Backend server
        target: 'https://coally-backend.up.railway.app/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true, // Enables global access to `vi` and `expect`
    environment: 'jsdom'
  },
});
