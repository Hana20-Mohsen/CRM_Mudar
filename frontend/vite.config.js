import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
 plugins: [react()],
  server: {
    host: true,
    base: "/crm/", 
    port: 5173, 
    strictPort: false,
    allowedHosts: [
      'christiane-dangerless-calculatingly.ngrok-free.dev', // الرابط اللي Ngrok طلعلك
    ],
  },
})
