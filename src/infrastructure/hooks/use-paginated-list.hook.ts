import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  PaginatedResponse,
  PaginationParams,
} from '../../application/domain/common'
import { useURLState } from './use-url-state.hook'

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

  // Referencia estable para la función de carga
  const loadDataWithFiltersRef = useRef(config.loadEntities)
  loadDataWithFiltersRef.current = config.loadEntities

  // Función estable para cargar datos con filtros y búsqueda
  const loadDataWithFilters = useCallback(
    async (pagination: PaginationParams) => {
      // Combinar parámetros de paginación con los de URL
      const fullPagination: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy || urlState.pagination.sortBy,
        sortOrder: pagination.sortOrder || urlState.pagination.sortOrder,
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
    ]
  )

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
        setError(err instanceof Error ? err.message : 'Error al cargar datos')
        console.error('Error loading paginated data:', err)
      } finally {
        setLoading(false)
      }
    },
    [loadDataWithFilters]
  )

  // Cargar datos iniciales con todos los parámetros de URL
  useEffect(() => {
    const initialPagination: PaginationParams = {
      page: urlState.pagination.page,
      limit: urlState.pagination.limit,
      sortBy: urlState.pagination.sortBy,
      sortOrder: urlState.pagination.sortOrder,
    }
    loadData(initialPagination)
  }, [loadData]) // Solo ejecutar cuando cambie loadData

  // Recargar datos cuando cambien los filtros, búsqueda o ordenamiento
  useEffect(() => {
    // Solo recargar si ya tenemos datos iniciales
    if (data.length > 0 || loading) {
      const currentPagination: PaginationParams = {
        page: urlState.pagination.page,
        limit: urlState.pagination.limit,
        sortBy: urlState.pagination.sortBy,
        sortOrder: urlState.pagination.sortOrder,
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
  ]) // Dependencies are intentionally included to trigger reloads

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
    const currentPagination: PaginationParams = {
      page: urlState.pagination.page,
      limit: urlState.pagination.limit,
      sortBy: urlState.pagination.sortBy,
      sortOrder: urlState.pagination.sortOrder,
    }
    loadData(currentPagination)
  }, [loadData, urlState.pagination])

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
  }
}
