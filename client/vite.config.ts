import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";

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
        useFlatConfig: true,
        lintCommand: "eslint './src/**/*.{ts,tsx}'"
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
      "@src": `${import.meta.dirname}/src`
    }
  },
  cacheDir: "../node_modules/.vite"
});
