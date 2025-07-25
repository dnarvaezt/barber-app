/**
 * Configuración de entorno para la aplicación
 */

export const config = {
  // Base path de la aplicación
  basePath: import.meta.env.DEV ? '/' : '/barber-app/',

  // URL base de la aplicación
  baseUrl: import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://dnarvaezt.github.io/barber-app',

  // Versión de la aplicación
  version: __APP_VERSION__ || '0.0.0',

  // Modo de desarrollo
  isDevelopment: import.meta.env.DEV,

  // Modo de producción
  isProduction: import.meta.env.PROD,
}

/**
 * Función utilitaria para obtener rutas absolutas (sin hooks)
 * Para uso en contextos donde no se pueden usar hooks
 */
export const getAbsolutePath = (relativePath: string): string => {
  const normalizedPath = relativePath.startsWith('/')
    ? relativePath
    : `/${relativePath}`

  if (config.isDevelopment) {
    return normalizedPath
  }

  return `${config.basePath}${normalizedPath.slice(1)}`
}

/**
 * Función para obtener URLs absolutas
 */
export const getAbsoluteUrl = (relativePath: string): string => {
  const normalizedPath = relativePath.startsWith('/')
    ? relativePath
    : `/${relativePath}`

  if (config.isDevelopment) {
    return `${config.baseUrl}${normalizedPath}`
  }

  return `${config.baseUrl}${normalizedPath}`
}
