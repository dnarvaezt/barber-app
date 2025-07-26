import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig } from 'vite'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

const getBasePath = (mode: string) => {
  if (mode === 'development' || process.env.NODE_ENV === 'preview') {
    return '/'
  }
  return '/barber-app/'
}

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

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const basePath = getBasePath(mode)

  return {
    plugins: [react(), markdownPlugin()],
    envDir: '.',
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __BASE_PATH__: JSON.stringify(basePath),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    base: basePath,
    server: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      cssCodeSplit: true,
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor'
              }
              if (id.includes('react-router')) {
                return 'router-vendor'
              }
              if (id.includes('fontawesome') || id.includes('@fortawesome')) {
                return 'icons-vendor'
              }
              if (id.includes('marked') || id.includes('highlight.js')) {
                return 'markdown-vendor'
              }
              return 'vendor'
            }
            if (id.includes('/src/modules/')) {
              const match = id.match(/src\/modules\/([^/]+)/)
              if (match) return `module-${match[1]}`
            }
          },
          chunkFileNames: chunkInfo => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              if (facadeModuleId.includes('node_modules')) {
                return 'vendor/[name]-[hash].js'
              }
            }
            return 'chunks/[name]-[hash].js'
          },
          assetFileNames: assetInfo => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return 'assets/images/[name]-[hash].[ext]'
            }
            if (/css/i.test(ext)) {
              return 'assets/css/[name]-[hash].[ext]'
            }
            return 'assets/[name]-[hash].[ext]'
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: [
            'console.log',
            'console.info',
            'console.debug',
            'console.warn',
          ],
        },
        mangle: {
          safari10: true,
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
    },
  }
})
