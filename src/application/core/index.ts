// ============================================================================
// CORE EXPORTS - Exportaciones centralizadas del core de la aplicación
// ============================================================================

// Domain Layer
export * from './domain/base.repository'
export * from './domain/base.service'
export * from './domain/entity.interface'
export * from './domain/validators/base.validator'

// Dependency Injection
export * from './di/container'

// Events
export * from './events/event.bus'

// Configuration
export * from './config/entity.config'

// ============================================================================
// RE-EXPORTS FROM DOMAIN - Reexportaciones del dominio existente
// ============================================================================

// Common types (mantener compatibilidad)
export type {
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
} from './domain/entity.interface'

// ============================================================================
// UTILITY EXPORTS - Exportaciones de utilidades
// ============================================================================

export {
  CLIENT_CONFIG,
  EMPLOYEE_CONFIG,
  USER_CONFIG,
  createEntityConfig,
  getAllEntityConfigs,
  getEntityConfig,
  hasEntityConfig,
  validateEntityConfig,
} from './config/entity.config'
export { ServiceIds } from './di/container'
export { EventTypes } from './events/event.bus'
