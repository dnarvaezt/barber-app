// ============================================================================
// HOOKS EXPORTS - Exportaciones centralizadas de hooks
// ============================================================================

// Existing hooks
export { useEntityDetail } from './use-entity-detail.hook'
export { useEntityForm } from './use-entity-form.hook'
export { useEntityList } from './use-entity-list.hook'
export { useMockData } from './use-mock-data.hook'
export { usePaginatedList } from './use-paginated-list.hook'
export { usePagination } from './use-pagination.hook'
export { useSearchInput } from './use-search-input.hook'
export { useURLState } from './use-url-state.hook'
export { useUtils } from './use-utils.hook'
export { useValidation } from './use-validation.hook'

// New generic entity hook
export { useEntity } from './use-entity.hook'
export type { EntityHookConfig, EntityHookState } from './use-entity.hook'

// ============================================================================
// HOOK TYPES - Tipos exportados para hooks
// ============================================================================

export type {
  PaginatedListConfig,
  PaginatedListState,
} from './use-paginated-list.hook'
