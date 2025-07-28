import { useCallback, useEffect } from 'react'
import type {
  PaginatedResponse,
  PaginationParams,
} from '../../application/domain/common'
import { usePagination, useURLState } from './index'

export interface PaginatedListConfig<T, F> {
  // Función para cargar datos
  loadEntities: (
    pagination: PaginationParams,
    filters: Partial<F>,
    search: string
  ) => Promise<PaginatedResponse<T>>
  // Configuración de filtros para URL
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
}

export interface PaginatedListState<T, F> {
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
}

export const usePaginatedList = <T, F extends Record<string, any>>(
  config: PaginatedListConfig<T, F>
): PaginatedListState<T, F> => {
  // Hook para manejar el estado de la URL
  const urlState = useURLState<F>(config.urlConfig)

  // Función para cargar datos con filtros y búsqueda
  const loadDataWithFilters = useCallback(
    async (pagination: PaginationParams) => {
      return await config.loadEntities(
        pagination,
        urlState.filters,
        urlState.search
      )
    },
    [config, urlState.filters, urlState.search]
  )

  // Hook de paginación
  const pagination = usePagination<T>({
    loadEntities: loadDataWithFilters,
    initialPage: urlState.pagination.page,
    initialLimit: urlState.pagination.limit,
  })

  // Recargar datos cuando cambien los filtros o la búsqueda
  useEffect(() => {
    // Recargar datos con los nuevos filtros/búsqueda
    pagination.refresh()
  }, [urlState.filters, urlState.search, pagination])

  // Actualizar filtros
  const updateFilters = useCallback(
    (newFilters: Partial<F>) => {
      urlState.updateFilters(newFilters)
    },
    [urlState]
  )

  // Actualizar búsqueda
  const updateSearch = useCallback(
    (newSearch: string) => {
      urlState.updateSearch(newSearch)
    },
    [urlState]
  )

  // Actualizar paginación
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

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    urlState.clearFilters()
  }, [urlState])

  // Limpiar todo
  const clearAll = useCallback(() => {
    urlState.clearAll()
  }, [urlState])

  // Recargar datos
  const refresh = useCallback(() => {
    pagination.refresh()
  }, [pagination])

  return {
    // Datos y estado
    data: pagination.data,
    loading: pagination.loading,
    error: pagination.error,
    meta: pagination.meta,
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
  }
}
