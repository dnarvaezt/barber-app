import { config } from '../config/environment'

/**
 * Hook para obtener el base path de la aplicación
 * En desarrollo: '/'
 * En producción (GitHub Pages): '/filter-docs/'
 */
export const useBasePath = () => {
  return config.basePath
}

/**
 * Función para construir rutas absolutas considerando el base path
 */
export const useAbsolutePath = () => {
  const basePath = useBasePath()

  return (path: string) => {
    // Asegurar que el path comience con '/'
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    // Si el base path es '/', simplemente retornar el path
    if (basePath === '/') {
      return normalizedPath
    }

    // Si el base path termina con '/', concatenar directamente
    if (basePath.endsWith('/')) {
      return `${basePath}${normalizedPath.slice(1)}`
    }

    // Si no, agregar '/' entre el base path y el path
    return `${basePath}${normalizedPath}`
  }
}
