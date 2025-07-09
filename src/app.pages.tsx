import { getAbsolutePath } from './config/environment'
import HomePage from './modules/HomePage'

export const appPageList = [
  {
    path: '/',
    name: 'Información',
    component: HomePage,
  },
]

// Función helper para obtener rutas absolutas
export const getPageAbsolutePath = (relativePath: string) => {
  return getAbsolutePath(relativePath)
}
