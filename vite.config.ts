import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'

// Lee la versión del package.json
const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure environment variables are loaded
  envDir: '.',
  // Define environment variables that should be exposed to the client
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  // Server configuration
  server: {
    port: 3000,
    host: true,
  },
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
