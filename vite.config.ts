import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/tests': fileURLToPath(new URL('./tests', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/main/config/vitest-setup.ts'],
    globals: false,
    coverage: {
      provider: 'v8',
      exclude: ['src/main/**', '**/index.ts'],
    },
  },
})
