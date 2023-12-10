import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    svgr(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      }
    }),
    visualizer({ open: true, gzipSize: true })
  ],
  server: {
    open: true,
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  cacheDir: '../node_modules/.vite'
})