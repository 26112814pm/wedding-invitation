import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/wedding-invitation/',
  server: {
    port: 5173,
    strictPort: true,
  },
})
