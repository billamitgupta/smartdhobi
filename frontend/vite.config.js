import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 1100,
    strictPort: true,
    allowedHosts: [
      'leafkaart.com',
      'www.leafkaart.com',
      'leafkaart.cloud',
      'www.leafkaart.cloud'
    ]
  },
})
