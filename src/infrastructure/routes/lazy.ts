import { lazy } from 'react'

// Mapeo estático de rutas para evitar problemas con Vite
const moduleMap: Record<string, () => Promise<any>> = {
  // Dashboard - carga independiente
  dashboard: () => import('../modules/dashboard/index.ts'),

  // Clientes - dividir en chunks separados
  'client-page': () => import('../modules/client/client-page/index.ts'),
  'client-form': () => import('../modules/client/client-form/index.ts'),
  'client-detail': () => import('../modules/client/client-detail/index.ts'),
  'client-invoices': () => import('../modules/client/client-invoices/index.ts'),

  // Empleados - dividir en chunks separados
  'employee-page': () => import('../modules/employee/employee-page/index.ts'),
  'employee-form': () => import('../modules/employee/employee-form/index.ts'),
  'employee-detail': () =>
    import('../modules/employee/employee-detail/index.ts'),
  'employee-service-history': () =>
    import('../modules/employee/employee-service-history/index.ts'),

  // Categorías - dividir en chunks separados
  'category-page': () => import('../modules/category/category-page/index.ts'),
  'category-form': () => import('../modules/category/category-form/index.ts'),
  'category-detail': () =>
    import('../modules/category/category-detail/index.ts'),

  // Actividades - dividir en chunks separados
  'activity-page': () => import('../modules/activity/activity-page/index.ts'),
  'activity-form': () => import('../modules/activity/activity-form/index.ts'),
  'activity-detail': () =>
    import('../modules/activity/activity-detail/index.ts'),

  // Productos - dividir en chunks separados
  'product-page': () => import('../modules/product/product-page/index.ts'),
  'product-form': () => import('../modules/product/product-form/index.ts'),
  'product-detail': () => import('../modules/product/product-detail/index.ts'),

  // Stock - dividir en chunks separados
  stock: () => import('../modules/stock/stock-page/index.ts'),
  'stock-movements': () =>
    import('../modules/stock/stock-movement-page/index.ts'),

  // Facturas - dividir en chunks separados
  'invoice-page': () => import('../modules/invoice/invoice-page/index.ts'),
  'invoice-form': () => import('../modules/invoice/invoice-form/index.ts'),
  'invoice-detail': () => import('../modules/invoice/invoice-detail/index.ts'),

  // Citas - dividir en chunks separados
  'appointment-page': () =>
    import('../modules/appointment/appointment-page/index.ts'),
  'appointment-form': () =>
    import('../modules/appointment/appointment-form/index.ts'),
  'appointment-detail': () =>
    import('../modules/appointment/appointment-detail/index.ts'),

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
