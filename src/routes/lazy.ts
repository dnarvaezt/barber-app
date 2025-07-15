import { lazy } from 'react'

export function lazyRoute(path: string, exportName = 'default') {
  return lazy(() =>
    import(`../modules/${path}/index.ts`).then(module => ({
      default: module[exportName],
    }))
  )
}
