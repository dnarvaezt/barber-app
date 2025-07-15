import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useMemo } from 'react'

import type { IconName } from '@fortawesome/fontawesome-svg-core'

import { ICON_PREFIXES, ICON_PREFIX_MAP } from './icon.constants'

// Hook personalizado para la lógica del icono
export const useIcon = (name: string) => {
  return useMemo(() => {
    try {
      // Determinar el prefijo del icono
      const prefix = name.startsWith(ICON_PREFIXES.BRANDS)
        ? ICON_PREFIX_MAP[ICON_PREFIXES.BRANDS]
        : ICON_PREFIX_MAP[ICON_PREFIXES.SOLID]

      // Extraer el nombre del icono
      const iconName = name
        .replace(`${ICON_PREFIXES.SOLID} fa-`, '')
        .replace(`${ICON_PREFIXES.BRANDS} fa-`, '') as IconName

      // Buscar la definición del icono
      const iconDefinition = findIconDefinition({ prefix, iconName })

      return {
        iconDefinition,
        isValid: !!iconDefinition,
      }
    } catch (error) {
      console.warn(`Error processing icon "${name}":`, error)
      return {
        iconDefinition: null,
        isValid: false,
      }
    }
  }, [name])
}
