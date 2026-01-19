import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 1100,
    strictPort: true,
    allowedHosts: ['smartdhobi.in', 'www.smartdhobi.in']  // ✅ both domains added
  },
  preview: {
    host: '0.0.0.0',
    port: 1100
  }
})
