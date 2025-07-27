// Enum para los IDs de rutas - facilita el uso y previene errores de tipeo
export const RouteIds = {
  DASHBOARD: 'dashboard',
  CLIENT: 'client',
  CLIENT_FORM_NEW: 'client-form-new',
  CLIENT_DETAIL: 'client-detail',
  CLIENT_FORM_EDIT: 'client-form-edit',
  EMPLOYEES: 'employees',
  EMPLOYEE_FORM_NEW: 'employee-form-new',
  EMPLOYEE_DETAIL: 'employee-detail',
  EMPLOYEE_FORM_EDIT: 'employee-form-edit',
  NOT_FOUND: 'not-found',
} as const

export type RouteId = (typeof RouteIds)[keyof typeof RouteIds]
