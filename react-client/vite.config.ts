import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import checker from 'vite-plugin-checker'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"', // for example, lint .ts & .tsx
      }
    }),
    visualizer()
  ],
  server: {
    open: true,
    port: 3000,
    host: true,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
