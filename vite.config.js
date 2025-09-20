import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      process: "process/browser",
      buffer: "buffer",
      util: "util",
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  build: {
    rollupOptions: {
      external: ['@safe-globalThis/safe-apps-provider', '@safe-globalThis/safe-apps-sdk'],
    },
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
  },
  server: {
    historyApiFallback: true,
  },
})