import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// In development and `vite preview`, /api is forwarded to mediprice-api, so the
// app talks to the real backend without CORS or a .env entry.
// Override the target with VITE_API_PROXY, e.g. VITE_API_PROXY=http://localhost:5000
const apiProxy = {
  '/api': {
    target: process.env.VITE_API_PROXY || 'http://localhost:5001',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
