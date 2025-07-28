import type { RouteItem, RoutePage } from './routes.types'

export class RoutesService {
  private routes: RouteItem[]

  constructor(routes: RouteItem[]) {
    this.routes = routes
  }

  /**
   * Obtiene solo las páginas con componentes (sin iconos)
   */
  getPages(): RoutePage[] {
    const pages: RoutePage[] = []

    const traverse = (items: RouteItem[], parentPath: string = '') => {
      for (const item of items) {
        let currentPath = item.path || ''

        // Calcular el path completo para esta ruta
        if (item.inheritPath && parentPath) {
          currentPath = parentPath + currentPath
        } else if (item.path) {
          currentPath = item.path
        }

        // Solo agregar páginas que tengan componente y path
        if (item.component && currentPath) {
          pages.push({
            path: currentPath,
            name: item.name,
            component: item.component,
          })
        }

        // Procesar hijos con el path actual como parent path
        if (item.children && item.children.length > 0) {
          traverse(item.children, currentPath)
        }
      }
    }

    traverse(this.routes)
    return pages
  }

  /**
   * Encuentra una ruta por su path
   */
  findRouteByPath(path: string): RouteItem | undefined {
    const allRoutes = this.getAllRoutes()
    return allRoutes.find(route => {
      const fullPath = this.getFullPath(route)
      return fullPath === path
    })
  }

  /**
   * Obtiene el path completo de una ruta
   */
  private getFullPath(route: RouteItem): string {
    const parentRoute = this.findParentRoute(route)
    if (parentRoute && route.inheritPath) {
      const parentPath = this.getFullPath(parentRoute)
      return parentPath + route.path
    }
    return route.path || ''
  }

  /**
   * Encuentra la ruta padre de una ruta
   */
  private findParentRoute(childRoute: RouteItem): RouteItem | undefined {
    for (const route of this.routes) {
      if (route.children?.some(child => child.id === childRoute.id)) {
        return route
      }
      if (route.children) {
        for (const child of route.children) {
          if (
            child.children?.some(grandChild => grandChild.id === childRoute.id)
          ) {
            return child
          }
        }
      }
    }
    return undefined
  }

  /**
   * Obtiene todas las rutas planas (incluyendo subrutas)
   */
  getAllRoutes(): RouteItem[] {
    const allRoutes: RouteItem[] = []

    const traverse = (items: RouteItem[]) => {
      for (const item of items) {
        allRoutes.push(item)
        if (item.children && item.children.length > 0) {
          traverse(item.children)
        }
      }
    }

    traverse(this.routes)
    return allRoutes
  }

  /**
   * Obtiene rutas por nivel de profundidad
   */
  getRoutesByLevel(level: number): RouteItem[] {
    const levelRoutes: RouteItem[] = []

    const traverse = (items: RouteItem[], currentLevel: number = 0) => {
      if (currentLevel === level) {
        levelRoutes.push(...items)
        return
      }

      for (const item of items) {
        if (item.children && item.children.length > 0) {
          traverse(item.children, currentLevel + 1)
        }
      }
    }

    traverse(this.routes)
    return levelRoutes
  }

  /**
   * Verifica si una ruta existe
   */
  routeExists(path: string): boolean {
    return this.findRouteByPath(path) !== undefined
  }

  /**
   * Obtiene el path completo de una ruta por su ID
   */
  getRoutePathById(routeId: string): string | undefined {
    const result = this.findRouteById(routeId)
    return result?.fullPath
  }

  /**
   * Encuentra una ruta por su ID y retorna el objeto con el path completo
   */
  findRouteById(
    routeId: string
  ): { route: RouteItem; fullPath: string } | undefined {
    const allRoutes = this.getAllRoutes()

    for (const route of allRoutes) {
      if (route.id === routeId) {
        const fullPath = this.getFullPath(route)
        return { route, fullPath }
      }
    }

    return undefined
  }

  /**
   * Construye el path completo de una ruta por su ID
   */
  buildRoutePath(routeId: string): string | undefined {
    return this.getRoutePathById(routeId)
  }

  /**
   * Construye el path completo de una ruta por su ID, reemplazando parámetros dinámicos
   */
  buildRoutePathWithParams(
    routeId: string,
    params: Record<string, string>
  ): string {
    const result = this.findRouteById(routeId)
    if (!result) {
      // Si no encuentra la ruta, retorna la ruta de 404
      const notFoundRoute = this.findRouteById('not-found')
      return notFoundRoute?.fullPath || '/404'
    }

    let path = result.fullPath

    // Reemplazar parámetros dinámicos
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, value)
    }

    return path
  }
}
