import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import checker from "vite-plugin-checker";
import { visualizer } from "rollup-plugin-visualizer";

const isHostRender = !!process.env.RENDER;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    checker({
      overlay: { initialIsOpen: false },
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
      }
    }),
    !isHostRender && visualizer({ open: true, gzipSize: true, sourcemap: true })
  ],
  build: { sourcemap: !isHostRender },
  server: {
    open: true,
    port: 3000,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:5000"
    }
  },
  resolve: {
    alias: {
      "@src": new URL("./src", import.meta.url).pathname
    }
  },
  cacheDir: "../node_modules/.vite"
});
