// ============================================================================
// CORE EXPORTS - Exportaciones centralizadas del core de la aplicación
// ============================================================================

// Domain Layer
export * from './domain/base.repository'
export * from './domain/base.service'
export * from './domain/entity.interface'
export * from './domain/validators/base.validator'

// Events
export * from './events/event.bus'

// Configuration (removida por no uso)

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

// Re-export removidos: entity.config, ServiceIds y EventTypes sin uso
