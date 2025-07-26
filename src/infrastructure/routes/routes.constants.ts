// Enum para los IDs de rutas - facilita el uso y previene errores de tipeo
export const RouteIds = {
  CLIENT: 'client',
  CLIENT_FORM_NEW: 'client-form-new',
  CLIENT_DETAIL: 'client-detail',
  CLIENT_FORM_EDIT: 'client-form-edit',
  NOT_FOUND: 'not-found',
} as const

export type RouteId = (typeof RouteIds)[keyof typeof RouteIds]
