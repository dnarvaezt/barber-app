import { lazy } from 'react'

// Mapeo estático de rutas para evitar problemas con Vite
const moduleMap: Record<string, () => Promise<any>> = {
  // Dashboard - carga independiente
  dashboard: () => import('../modules/dashboard/index.ts'),

  // Clientes - dividir en chunks separados
  'client-page': () => import('../modules/client/client-page/index.ts'),
  'client-form': () => import('../modules/client/client-form/index.ts'),
  'client-detail': () => import('../modules/client/client-detail/index.ts'),

  // Empleados - dividir en chunks separados
  'employee-page': () => import('../modules/employee/employee-page/index.ts'),
  'employee-form': () => import('../modules/employee/employee-form/index.ts'),
  'employee-detail': () =>
    import('../modules/employee/employee-detail/index.ts'),

  // Categorías - dividir en chunks separados
  'category-page': () => import('../modules/category/category-page/index.ts'),
  'category-form': () => import('../modules/category/category-form/index.ts'),
  'category-detail': () =>
    import('../modules/category/category-detail/index.ts'),

  // Páginas de error - carga independiente
  'not-found': () => import('../modules/not-found/index.ts'),
}

export function lazyRoute(path: string, exportName = 'default') {
  const importFn = moduleMap[path]
  if (!importFn) {
    throw new Error(`Unknown module path: ${path}`)
  }

  return lazy(() =>
    importFn().then(module => ({
      default: module[exportName],
    }))
  )
}
