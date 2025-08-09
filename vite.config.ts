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
    resolve: {
      alias: {
        application: '/src/application',
        infrastructure: '/src/infrastructure',
      },
    },
    plugins: [
      react({
        babel: {
          plugins: ['react-compiler'],
        },
      }),
      markdownPlugin(),
    ],
    envDir: '.',
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __BASE_PATH__: JSON.stringify(basePath),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    base: basePath,
    // Optimizaciones de build
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: [
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/free-brands-svg-icons',
      ],
    },
    server: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      cssCodeSplit: true,
      cssMinify: true,
      // Optimizaciones adicionales
      target: 'esnext',
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
          passes: 2,
        },
        mangle: {
          safari10: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // React y React DOM
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor'
              }
              // React Router
              if (id.includes('react-router')) {
                return 'router-vendor'
              }
              // FontAwesome - dividir en chunks más pequeños
              if (id.includes('@fortawesome/fontawesome-svg-core')) {
                return 'fontawesome-core'
              }
              if (id.includes('@fortawesome/free-solid-svg-icons')) {
                return 'fontawesome-solid'
              }
              if (id.includes('@fortawesome/free-brands-svg-icons')) {
                return 'fontawesome-brands'
              }
              if (id.includes('@fortawesome/react-fontawesome')) {
                return 'fontawesome-react'
              }
              // Markdown y syntax highlighting
              if (
                id.includes('marked') ||
                id.includes('highlight.js') ||
                id.includes('rehype') ||
                id.includes('remark')
              ) {
                return 'markdown-vendor'
              }
              // CodeMirror
              if (
                id.includes('@codemirror') ||
                id.includes('@uiw/react-codemirror')
              ) {
                return 'codemirror-vendor'
              }
              // Filter library
              if (id.includes('@andes-project/filter')) {
                return 'filter-vendor'
              }
              // Otros vendor
              return 'vendor'
            }
            // Agrupar todos los hooks en un solo chunk para evitar dependencias circulares
            if (id.includes('/src/infrastructure/hooks/')) {
              return 'hooks'
            }
            // Dividir módulos por dominio
            if (id.includes('/src/modules/')) {
              const match = id.match(/src\/modules\/([^/]+)/)
              if (match) return `module-${match[1]}`
            }
            // Dividir componentes por categoría
            if (id.includes('/src/infrastructure/components/')) {
              if (id.includes('/icons/')) {
                return 'components-icons'
              }
              if (id.includes('/layout/')) {
                return 'components-layout'
              }
              if (id.includes('/theme/')) {
                return 'components-theme'
              }
              return 'components-common'
            }
            // Dividir servicios por dominio
            if (id.includes('/src/application/domain/')) {
              if (id.includes('/client/')) {
                return 'domain-client'
              }
              if (id.includes('/employee/')) {
                return 'domain-employee'
              }
              if (id.includes('/common/')) {
                return 'domain-common'
              }
              return 'domain-core'
            }
          },
          chunkFileNames: chunkInfo => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              if (facadeModuleId.includes('node_modules')) {
                return 'vendor/[name]-[hash].js'
              }
            }
            // Organizar chunks por categoría
            if (chunkInfo.name?.includes('fontawesome')) {
              return 'vendor/fontawesome/[name]-[hash].js'
            }
            if (chunkInfo.name?.includes('module-')) {
              return 'modules/[name]-[hash].js'
            }
            if (chunkInfo.name?.includes('components-')) {
              return 'components/[name]-[hash].js'
            }
            if (chunkInfo.name?.includes('domain-')) {
              return 'domain/[name]-[hash].js'
            }
            if (chunkInfo.name === 'hooks') {
              return 'hooks/[name]-[hash].js'
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
    },
    preview: {
      port: 4173,
      host: true,
    },
  }
})
