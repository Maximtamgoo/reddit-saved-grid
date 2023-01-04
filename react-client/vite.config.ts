import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"', // for example, lint .ts & .tsx
      }
    }),
    visualizer({ open: true, gzipSize: true })
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