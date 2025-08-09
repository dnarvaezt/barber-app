import { lazy } from 'react'

export function lazyRoute(importFn: () => Promise<any>, exportName: string) {
  return lazy(async () => {
    const module = await importFn()
    const component = module[exportName]
    if (!component) {
      throw new Error(
        `lazyRoute: No se encontró la exportación "${exportName}" en el módulo cargado. ` +
          `Verifica que el componente exista y esté exportado como "export const ${exportName} = () => ..." ` +
          `y que el archivo index.ts correspondiente lo reexporte.`
      )
    }
    return { default: component }
  })
}
