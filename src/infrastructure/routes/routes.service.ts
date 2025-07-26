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

        if (item.inheritPath && parentPath) {
          currentPath = parentPath + currentPath
        } else if (item.path) {
          currentPath = item.path
        }

        if (item.component && item.path) {
          pages.push({
            path: currentPath,
            name: item.name,
            component: item.component,
          })
        }

        if (item.children && item.children.length > 0) {
          const newParentPath = item.path ? currentPath : parentPath
          traverse(item.children, newParentPath)
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
    for (const route of this.routes) {
      if (route.path === path) {
        return route
      }
      if (route.children && route.children.length > 0) {
        const found = this.findRouteByPathRecursive(path, route.children)
        if (found) return found
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

  private findRouteByPathRecursive(
    path: string,
    routes: RouteItem[]
  ): RouteItem | undefined {
    for (const route of routes) {
      if (route.path === path) {
        return route
      }
      if (route.children && route.children.length > 0) {
        const found = this.findRouteByPathRecursive(path, route.children)
        if (found) return found
      }
    }
    return undefined
  }
}
