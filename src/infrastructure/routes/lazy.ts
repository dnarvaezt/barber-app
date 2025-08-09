import { lazy } from 'react'

export function lazyRoute(importFn: () => Promise<any>, exportName: string) {
  return lazy(() =>
    importFn().then(module => ({
      default: module[exportName],
    }))
  )
}
