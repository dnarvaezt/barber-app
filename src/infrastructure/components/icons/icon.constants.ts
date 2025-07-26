import type { IconPrefix } from '@fortawesome/fontawesome-svg-core'

// Constantes para prefijos de iconos
export const ICON_PREFIXES = {
  BRANDS: 'fa-brands',
  SOLID: 'fa-solid',
} as const

export const ICON_PREFIX_MAP = {
  [ICON_PREFIXES.BRANDS]: 'fab' as IconPrefix,
  [ICON_PREFIXES.SOLID]: 'fas' as IconPrefix,
} as const

// Tipos exportados
export type IconSize = 'xs' | 'sm' | 'lg' | 'xl' | '2xl'
