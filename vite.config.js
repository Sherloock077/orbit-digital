import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Объединяем плагины и базовый путь в один конфиг
export default defineConfig({
  plugins: [react()],
  base: '/orbit-digital/', // Это нужно для корректной работы на GitHub Pages
  server: {
    host: true // Чтобы ты мог открывать проект в локальной сети
  }
})