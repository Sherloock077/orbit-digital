import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(),
    // Автоматически оптимизирует картинки при сборке (webp/png/jpg/svg),
    // чтобы будущие изображения жались сами, без ручного скрипта.
    ViteImageOptimizer({
      webp: { quality: 80 },
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      png: { quality: 80 },
    }),
  ],
  server: {
    host: true,
  },
})
