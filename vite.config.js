import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Конфиг, адаптированный под Vercel
export default defineConfig({
  plugins: [react()],
  // base: '/orbit-digital/', // УБИРАЕМ ИЛИ ЗАКОММЕНТИРУЕМ ЭТО ДЛЯ VERCEL
  server: {
    host: true 
  }
})