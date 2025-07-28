import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  IEntity,
  PaginatedResponse,
  PaginationParams,
} from '../../application/core/domain/entity.interface'
import { useURLState } from './use-url-state.hook'

// ============================================================================
// ENTITY HOOK CONFIGURATION - Configuración para hooks de entidades
// ============================================================================

export interface EntityHookConfig<
  T extends IEntity,
  F extends Record<string, any> = Record<string, any>,
> {
  // Función para cargar datos
  loadEntities: (
    pagination: PaginationParams,
    filters?: Partial<F>,
    search?: string
  ) => Promise<PaginatedResponse<T>>

  // Configuración de URL
  urlConfig: {
    filters?: {
      [K in keyof F]?: {
        type: 'string' | 'number' | 'boolean' | 'array'
        defaultValue?: F[K]
        transform?: (value: string) => F[K]
      }
    }
    pagination?: {
      page: { defaultValue: number }
      limit: { defaultValue: number }
      sortBy?: { defaultValue: string }
      sortOrder?: { defaultValue: 'asc' | 'desc' }
    }
    search?: {
      key: string
      defaultValue: string
    }
  }

  // Configuración de la entidad
  entityConfig: {
    entityType: string
    displayName: string
    searchableFields: string[]
    defaultSortBy: string
    defaultSortOrder: 'asc' | 'desc'
  }
}

// ============================================================================
// ENTITY HOOK STATE - Estado del hook de entidad
// ============================================================================

export interface EntityHookState<
  T extends IEntity,
  F extends Record<string, any> = Record<string, any>,
> {
  // Datos y estado
  data: T[]
  loading: boolean
  error: string | null
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }

  // Filtros y búsqueda
  filters: Partial<F>
  search: string

  // Métodos de actualización
  updateFilters: (filters: Partial<F>) => void
  updateSearch: (search: string) => void
  updatePagination: (
    pagination: Partial<{
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }>
  ) => void
  clearFilters: () => void
  clearAll: () => void
  refresh: () => void

  // Métodos de entidad
  createEntity: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<T>
  updateEntity: (data: Partial<T> & { id: string }) => Promise<T>
  deleteEntity: (id: string) => Promise<boolean>

  // Estado de operaciones
  creating: boolean
  updating: boolean
  deleting: boolean
  operationError: string | null
}

// ============================================================================
// ENTITY HOOK - Hook genérico para manejar entidades
// ============================================================================

export const useEntity = <
  T extends IEntity,
  F extends Record<string, any> = Record<string, any>,
>(
  config: EntityHookConfig<T, F>
): EntityHookState<T, F> => {
  // Hook para manejar el estado de la URL
  const urlState = useURLState<F>(config.urlConfig)

  // Referencia estable para la función de carga
  const loadDataWithFiltersRef = useRef(config.loadEntities)
  loadDataWithFiltersRef.current = config.loadEntities

  // Estado interno para manejar la paginación
  const [data, setData] = useState<T[]>([])
  const [meta, setMeta] = useState({
    page: urlState.pagination.page,
    limit: urlState.pagination.limit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para operaciones CRUD
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [operationError, setOperationError] = useState<string | null>(null)

  // Función estable para cargar datos con filtros y búsqueda
  const loadDataWithFilters = useCallback(
    async (pagination: PaginationParams) => {
      const fullPagination: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy:
          pagination.sortBy ||
          urlState.pagination.sortBy ||
          config.entityConfig.defaultSortBy,
        sortOrder:
          pagination.sortOrder ||
          urlState.pagination.sortOrder ||
          config.entityConfig.defaultSortOrder,
      }

      return await loadDataWithFiltersRef.current!(
        fullPagination,
        urlState.filters,
        urlState.search
      )
    },
    [
      urlState.filters,
      urlState.search,
      urlState.pagination.sortBy,
      urlState.pagination.sortOrder,
      config.entityConfig.defaultSortBy,
      config.entityConfig.defaultSortOrder,
    ]
  )

  // Función para cargar datos
  const loadData = useCallback(
    async (pagination: PaginationParams) => {
      setLoading(true)
      setError(null)

      try {
        const response = await loadDataWithFilters(pagination)
        setData(response.data)
        setMeta(response.meta)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : `Error al cargar ${config.entityConfig.displayName}`
        )
        console.error(
          `Error loading ${config.entityConfig.entityType} data:`,
          err
        )
      } finally {
        setLoading(false)
      }
    },
    [
      loadDataWithFilters,
      config.entityConfig.displayName,
      config.entityConfig.entityType,
    ]
  )

  // Cargar datos iniciales
  useEffect(() => {
    const initialPagination: PaginationParams = {
      page: urlState.pagination.page,
      limit: urlState.pagination.limit,
      sortBy: urlState.pagination.sortBy || config.entityConfig.defaultSortBy,
      sortOrder:
        urlState.pagination.sortOrder || config.entityConfig.defaultSortOrder,
    }
    loadData(initialPagination)
  }, [loadData])

  // Recargar datos cuando cambien los filtros, búsqueda o ordenamiento
  useEffect(() => {
    if (data.length > 0 || loading) {
      const currentPagination: PaginationParams = {
        page: urlState.pagination.page,
        limit: urlState.pagination.limit,
        sortBy: urlState.pagination.sortBy || config.entityConfig.defaultSortBy,
        sortOrder:
          urlState.pagination.sortOrder || config.entityConfig.defaultSortOrder,
      }
      loadData(currentPagination)
    }
  }, [
    urlState.filters,
    urlState.search,
    urlState.pagination.sortBy,
    urlState.pagination.sortOrder,
    urlState.pagination.page,
    urlState.pagination.limit,
    data.length,
    loading,
    loadData,
    config.entityConfig.defaultSortBy,
    config.entityConfig.defaultSortOrder,
  ]) // Dependencies are intentionally included to trigger reloads

  // Métodos de actualización
  const updateFilters = useCallback(
    (newFilters: Partial<F>) => {
      urlState.updateFilters(newFilters)
    },
    [urlState]
  )

  const updateSearch = useCallback(
    (newSearch: string) => {
      urlState.updateSearch(newSearch)
    },
    [urlState]
  )

  const updatePagination = useCallback(
    (
      newPagination: Partial<{
        page: number
        limit: number
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
      }>
    ) => {
      urlState.updatePagination(newPagination)
    },
    [urlState]
  )

  const clearFilters = useCallback(() => {
    urlState.clearFilters()
  }, [urlState])

  const clearAll = useCallback(() => {
    urlState.clearAll()
  }, [urlState])

  const refresh = useCallback(() => {
    const currentPagination: PaginationParams = {
      page: urlState.pagination.page,
      limit: urlState.pagination.limit,
      sortBy: urlState.pagination.sortBy || config.entityConfig.defaultSortBy,
      sortOrder:
        urlState.pagination.sortOrder || config.entityConfig.defaultSortOrder,
    }
    loadData(currentPagination)
  }, [
    loadData,
    urlState.pagination,
    config.entityConfig.defaultSortBy,
    config.entityConfig.defaultSortOrder,
  ])

  // Métodos CRUD genéricos
  const createEntity = useCallback(
    async (entityData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
      setCreating(true)
      setOperationError(null)

      try {
        // Aquí se implementaría la lógica de creación
        // Por ahora es un placeholder
        const newEntity = { ...entityData } as T
        setData(prev => [newEntity, ...prev])
        return newEntity
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Error al crear ${config.entityConfig.displayName}`
        setOperationError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setCreating(false)
      }
    },
    [config.entityConfig.displayName]
  )

  const updateEntity = useCallback(
    async (entityData: Partial<T> & { id: string }) => {
      setUpdating(true)
      setOperationError(null)

      try {
        // Aquí se implementaría la lógica de actualización
        // Por ahora es un placeholder
        setData(prev =>
          prev.map(entity =>
            entity.id === entityData.id ? { ...entity, ...entityData } : entity
          )
        )
        return entityData as T
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Error al actualizar ${config.entityConfig.displayName}`
        setOperationError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setUpdating(false)
      }
    },
    [config.entityConfig.displayName]
  )

  const deleteEntity = useCallback(
    async (id: string) => {
      setDeleting(true)
      setOperationError(null)

      try {
        // Aquí se implementaría la lógica de eliminación
        // Por ahora es un placeholder
        setData(prev => prev.filter(entity => entity.id !== id))
        return true
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Error al eliminar ${config.entityConfig.displayName}`
        setOperationError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setDeleting(false)
      }
    },
    [config.entityConfig.displayName]
  )

  return {
    // Datos y estado
    data,
    loading,
    error,
    meta,

    // Filtros y búsqueda
    filters: urlState.filters,
    search: urlState.search,

    // Métodos de actualización
    updateFilters,
    updateSearch,
    updatePagination,
    clearFilters,
    clearAll,
    refresh,

    // Métodos de entidad
    createEntity,
    updateEntity,
    deleteEntity,

    // Estado de operaciones
    creating,
    updating,
    deleting,
    operationError,
  }
}
