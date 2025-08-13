import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make environment variables available to the app
    'process.env': {}
  },
  build: {
    // Ensure environment variables are properly injected
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    // Add build timestamp for cache busting
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
})
