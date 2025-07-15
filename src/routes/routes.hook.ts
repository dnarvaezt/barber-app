import { useMemo } from 'react'
import { appRoutes } from './routes.data'
import { RoutesService } from './routes.service'
import type { RouteItem, RoutePage } from './routes.types'

export const useRoutes = () => {
  const routesService = useMemo(() => new RoutesService(appRoutes), [])

  const getPages = (): RoutePage[] => {
    return routesService.getPages()
  }

  const findRouteByPath = (path: string): RouteItem | undefined => {
    return routesService.findRouteByPath(path)
  }

  const getAllRoutes = (): RouteItem[] => {
    return routesService.getAllRoutes()
  }

  const getRoutesByLevel = (level: number): RouteItem[] => {
    return routesService.getRoutesByLevel(level)
  }

  const routeExists = (path: string): boolean => {
    return routesService.routeExists(path)
  }

  return {
    routes: appRoutes,
    getPages,
    findRouteByPath,
    getAllRoutes,
    getRoutesByLevel,
    routeExists,
  }
}
