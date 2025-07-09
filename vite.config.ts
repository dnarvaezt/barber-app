import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure environment variables are loaded
  envDir: '.',
  // Define environment variables that should be exposed to the client
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
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
});
