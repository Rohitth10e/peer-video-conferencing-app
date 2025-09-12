import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy requests from /api to your backend server
      '/api': {
        target: 'http://localhost:8000', // Your backend server address
        ws: true,
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Set to false if your backend is not using HTTPS
      },
    },
  },
})
