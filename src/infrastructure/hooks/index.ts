// ============================================================================
// HOOKS EXPORTS - Exportaciones centralizadas de hooks
// ============================================================================

// Existing hooks
export { useEntityDetail } from './use-entity-detail.hook'
export { useEntityForm } from './use-entity-form.hook'
export { usePaginatedList } from './use-paginated-list.hook'
export { useURLState } from './use-url-state.hook'
export { useUtils } from './use-utils.hook'
export { useValidation } from './use-validation.hook'

// New generic entity hook (removed unused exports)

// ============================================================================
// HOOK TYPES - Tipos exportados para hooks
// ============================================================================

export type {
  PaginatedListConfig,
  PaginatedListState,
} from './use-paginated-list.hook'
