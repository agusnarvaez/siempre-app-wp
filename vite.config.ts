import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/')

          if (!normalizedId.includes('/node_modules/')) {
            return
          }

          if (normalizedId.includes('/node_modules/@mui/x-data-grid/')) {
            return 'vendor-mui-data-grid'
          }

          if (
            normalizedId.includes('/node_modules/@mui/') ||
            normalizedId.includes('/node_modules/@emotion/')
          ) {
            return 'vendor-mui'
          }

          if (
            normalizedId.includes('/node_modules/react/') ||
            normalizedId.includes('/node_modules/react-dom/') ||
            normalizedId.includes('/node_modules/react-router/') ||
            normalizedId.includes('/node_modules/react-router-dom/')
          ) {
            return 'vendor-react'
          }

          if (normalizedId.includes('/node_modules/react-hook-form/')) {
            return 'vendor-forms'
          }

          if (normalizedId.includes('/node_modules/papaparse/')) {
            return 'vendor-csv'
          }
        },
      },
    },
  },
})
