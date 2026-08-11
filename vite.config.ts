import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'

export default defineConfig({
  base: '/form-builder/',
  plugins: [
    react(),
    reactCompilerPreset(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

