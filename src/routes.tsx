import React from 'react'
import { Icon } from './components'
import { HomePage, TechnicalDocumentationPage } from './modules'

export interface RouteItem {
  id: string
  name: string
  title: string
  icon?: React.ReactNode
  path?: string
  inheritPath?: boolean
  component?: React.ComponentType
  children?: RouteItem[]
}

export const appRoutes: RouteItem[] = [
  {
    id: 'home',
    name: 'Información',
    title: 'Información',
    icon: <Icon name='home' />,
    component: HomePage,
    path: '/',
    children: [],
  },
  {
    id: 'technical-documentation',
    name: 'Documentación Técnica',
    title: 'Documentación Técnica',
    icon: <Icon name='home' />,
    component: TechnicalDocumentationPage,
    path: '/technical-documentation',
    children: [],
  },
]

// Función helper para obtener solo las páginas (sin iconos)
export const getPages = (
  routes: RouteItem[] = appRoutes
): Array<{
  path: string
  name: string
  component: React.ComponentType
}> => {
  const pages: Array<{
    path: string
    name: string
    component: React.ComponentType
  }> = []

  const traverse = (items: RouteItem[], parentPath: string = '') => {
    for (const item of items) {
      // Construir el path completo para el item actual
      let currentPath = item.path || ''

      // Si inheritPath es true, concatenar con el path del padre
      if (item.inheritPath && parentPath) {
        currentPath = parentPath + currentPath
      } else if (item.path) {
        // Si no tiene inheritPath, usar el path tal como está
        currentPath = item.path
      }

      // Solo crear ruta si tiene componente Y path
      if (item.component && item.path) {
        pages.push({
          path: currentPath,
          name: item.name,
          component: item.component,
        })
      }

      // Procesar los hijos usando el path del item actual como base
      if (item.children && item.children.length > 0) {
        // Para los hijos, usar el path actual como padre (solo si el item actual tiene path)
        const newParentPath = item.path ? currentPath : parentPath
        traverse(item.children, newParentPath)
      }
    }
  }

  traverse(routes)
  return pages
}

// Función helper para encontrar una ruta por path
export const findRouteByPath = (
  path: string,
  routes: RouteItem[] = appRoutes
): RouteItem | undefined => {
  for (const route of routes) {
    if (route.path === path) {
      return route
    }
    if (route.children && route.children.length > 0) {
      const found = findRouteByPath(path, route.children)
      if (found) return found
    }
  }
  return undefined
}

// Función helper para obtener todas las rutas planas (incluyendo subrutas)
export const getAllRoutes = (routes: RouteItem[] = appRoutes): RouteItem[] => {
  const allRoutes: RouteItem[] = []

  const traverse = (items: RouteItem[]) => {
    for (const item of items) {
      allRoutes.push(item)
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    }
  }

  traverse(routes)
  return allRoutes
}
