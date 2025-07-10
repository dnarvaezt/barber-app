import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'

// Lee la versión del package.json
const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// Determina el base path dinámicamente
const getBasePath = (mode: string) => {
  // En desarrollo local, usa '/'
  if (mode === 'development') {
    return '/'
  }
  // En producción, usa '/filter-docs/' para GitHub Pages
  return '/filter-docs/'
}

// Plugin para manejar archivos markdown
const markdownPlugin = () => {
  return {
    name: 'markdown-loader',
    transform(code: string, id: string) {
      if (id.endsWith('.md')) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null,
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const basePath = getBasePath(mode)

  return {
    plugins: [react(), markdownPlugin()],
    // Ensure environment variables are loaded
    envDir: '.',
    // Define environment variables that should be exposed to the client
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __BASE_PATH__: JSON.stringify(basePath),
    },
    // Base path dinámico para GitHub Pages
    base: basePath,
    // Server configuration
    server: {
      port: 3000,
      host: true,
      // Configuración para SPA (Single Page Application)
      historyApiFallback: true,
    },
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    // Preview configuration (para probar el build)
    preview: {
      port: 4173,
      host: true,
    },
  }
})
