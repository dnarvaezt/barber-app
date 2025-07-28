import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
} from '../../application/domain/common'

interface UsePaginationConfig<T> {
  loadEntities: (pagination: PaginationParams) => Promise<PaginatedResponse<T>>
  initialPage?: number
  initialLimit?: number
}

export const usePagination = <T>(config: UsePaginationConfig<T>) => {
  // Estado interno
  const [data, setData] = useState<T[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({
    page: config.initialPage || 1,
    limit: config.initialLimit || 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Referencias estables para evitar recreaciones
  const configRef = useRef(config)
  const metaRef = useRef(meta)

  // Actualizar refs cuando cambien los valores
  configRef.current = config
  metaRef.current = meta

  // Función estable para cargar datos
  const loadData = useCallback(async (pagination: PaginationParams) => {
    setLoading(true)
    setError(null)

    try {
      const response = await configRef.current.loadEntities(pagination)
      setData(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
      console.error('Error loading paginated data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    const initialPagination: PaginationParams = {
      page: config.initialPage || 1,
      limit: config.initialLimit || 10,
    }
    loadData(initialPagination)
  }, [loadData, config.initialPage, config.initialLimit])

  // Cambiar página
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage === metaRef.current.page) return

      const newPagination: PaginationParams = {
        page: newPage,
        limit: metaRef.current.limit,
      }
      loadData(newPagination)
    },
    [loadData]
  )

  // Cambiar límite por página
  const handleLimitChange = useCallback(
    (newLimit: number) => {
      if (newLimit === metaRef.current.limit) return

      const newPagination: PaginationParams = {
        page: 1, // Reset a la primera página cuando cambia el límite
        limit: newLimit,
      }
      loadData(newPagination)
    },
    [loadData]
  )

  // Recargar datos
  const refresh = useCallback(() => {
    const currentPagination: PaginationParams = {
      page: metaRef.current.page,
      limit: metaRef.current.limit,
    }
    loadData(currentPagination)
  }, [loadData])

  // Función para cargar datos con filtros
  const loadDataWithFilters = useCallback(
    (filters: Partial<PaginationParams>) => {
      const newPagination: PaginationParams = {
        page: metaRef.current.page,
        limit: metaRef.current.limit,
        ...filters,
      }
      loadData(newPagination)
    },
    [loadData]
  )

  return {
    data,
    meta,
    loading,
    error,
    handlePageChange,
    handleLimitChange,
    refresh,
    loadDataWithFilters,
  }
}
