import { config } from '../config/environment'

/**
 * Hook para obtener el base path de la aplicación
 * En desarrollo: '/'
 * En producción (GitHub Pages): '/barber-app/'
 */
export const useBasePath = () => {
  return config.basePath
}
