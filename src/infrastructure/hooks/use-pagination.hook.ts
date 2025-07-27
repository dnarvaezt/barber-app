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

  // Usar useRef para mantener una referencia estable al config
  const configRef = useRef(config)
  configRef.current = config

  // Función para cargar datos con paginación
  const loadData = useCallback(
    async (pagination: PaginationParams) => {
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
    },
    [] // Sin dependencias para evitar recreación
  )

  // Cargar datos iniciales solo una vez al montar
  useEffect(() => {
    const initialPagination: PaginationParams = {
      page: config.initialPage || 1,
      limit: config.initialLimit || 10,
    }
    loadData(initialPagination)
  }, []) // Solo se ejecuta al montar

  // Cambiar página
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage === meta.page) return // Evitar llamadas innecesarias

      const newPagination: PaginationParams = {
        ...meta,
        page: newPage,
      }
      loadData(newPagination)
    },
    [meta, loadData]
  )

  // Cambiar límite por página
  const handleLimitChange = useCallback(
    (newLimit: number) => {
      if (newLimit === meta.limit) return // Evitar llamadas innecesarias

      const newPagination: PaginationParams = {
        ...meta,
        page: 1, // Reset a la primera página cuando cambia el límite
        limit: newLimit,
      }
      loadData(newPagination)
    },
    [meta, loadData]
  )

  // Recargar datos (útil para después de crear/actualizar/eliminar)
  const refresh = useCallback(() => {
    const currentPagination: PaginationParams = {
      page: meta.page,
      limit: meta.limit,
    }
    loadData(currentPagination)
  }, [meta.page, meta.limit, loadData])

  // Función para cargar datos con filtros (útil para búsquedas)
  const loadDataWithFilters = useCallback(
    (filters: Partial<PaginationParams>) => {
      const newPagination: PaginationParams = {
        ...meta,
        ...filters,
      }
      loadData(newPagination)
    },
    [meta, loadData]
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
