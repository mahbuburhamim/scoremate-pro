import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The API is PHP (public/api) served by Hostinger. For local development run
//   php -S 127.0.0.1:8099 -t public
// and set API_PROXY=http://127.0.0.1:8099 so /api requests reach it.
const apiProxy = process.env.API_PROXY
  ? { '/api': { target: process.env.API_PROXY, changeOrigin: false } }
  : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
