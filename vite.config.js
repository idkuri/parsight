import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  server: {
    host: isDev ? '0.0.0.0' : 'parsight.idkuri.com',
    port: 5173,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@API': path.resolve(__dirname, 'src/API'), 
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@styles': path.resolve(__dirname, 'src/styles')
    }
  },
  plugins: [react(), tailwindcss()],
})