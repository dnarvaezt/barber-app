import { useCallback, useMemo } from 'react'
import { productService } from '../../../../application/domain/product/product.provider'
import {
  stockService,
  type StockMovement,
  type StockMovementFilters,
} from '../../../../application/domain/stock'
import { usePaginatedList } from '../../../hooks/use-paginated-list.hook'
import { useURLState } from '../../../hooks/use-url-state.hook'
import { useUtils } from '../../../hooks/use-utils.hook'

// Servicio de stock compartido por provider

type UIStockFilters = {
  dateFrom?: string
  dateTo?: string
  type?: 'IN' | 'OUT' | ''
  search?: string
}

export const useStockPage = () => {
  const { formatDate } = useUtils()

  const urlState = useURLState<UIStockFilters>({
    filters: {
      dateFrom: { type: 'string', defaultValue: '' },
      dateTo: { type: 'string', defaultValue: '' },
      type: { type: 'string', defaultValue: '' },
      search: { type: 'string', defaultValue: '' },
    },
    pagination: {
      page: { defaultValue: 1 },
      limit: { defaultValue: 10 },
      sortBy: { defaultValue: 'date' },
      sortOrder: { defaultValue: 'desc' },
    },
  })

  const effectiveFilters: StockMovementFilters = useMemo(() => {
    const f: StockMovementFilters = {}
    if (urlState.filters.dateFrom)
      f.dateFrom = new Date(urlState.filters.dateFrom)
    if (urlState.filters.dateTo) f.dateTo = new Date(urlState.filters.dateTo)
    if (urlState.filters.type === 'IN' || urlState.filters.type === 'OUT')
      f.type = urlState.filters.type
    return f
  }, [urlState.filters])

  const loadMovements = useCallback(
    async (pagination: any) => {
      const response = await stockService.getMovements(
        effectiveFilters,
        pagination
      )

      // Búsqueda por producto por nombre: filtra client-side con datos de productos
      if (urlState.filters.search) {
        const productsPage = await productService.getAllProducts({
          page: 1,
          limit: 1000,
        })
        const lowered = urlState.filters.search.toLowerCase()
        const allowedIds = productsPage.data
          .filter(
            p =>
              p.name.toLowerCase().includes(lowered) ||
              p.id.toLowerCase().includes(lowered)
          )
          .map(p => p.id)

        const filtered = response.data.filter(m =>
          allowedIds.includes(m.productId)
        )
        return {
          ...response,
          data: filtered,
          meta: {
            ...response.meta,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / pagination.limit),
          },
        }
      }

      return response
    },
    [effectiveFilters, urlState.filters.search]
  )

  const listState = usePaginatedList<StockMovement, UIStockFilters>({
    loadEntities: async pagination => loadMovements(pagination),
    urlConfig: {
      filters: {
        dateFrom: { type: 'string', defaultValue: '' },
        dateTo: { type: 'string', defaultValue: '' },
        type: { type: 'string', defaultValue: '' },
        search: { type: 'string', defaultValue: '' },
      },
      pagination: {
        page: { defaultValue: 1 },
        limit: { defaultValue: 10 },
        sortBy: { defaultValue: 'date' },
        sortOrder: { defaultValue: 'desc' },
      },
    },
  })

  // Obtener mapa de productos para nombres
  const productsMap = useMemo(
    () => ({}) as Record<string, { id: string; name: string }>,
    []
  )

  return {
    movements: listState.data,
    loading: listState.loading,
    error: listState.error,
    pagination: listState.meta,
    total: listState.meta.total,
    totalPages: listState.meta.totalPages,
    filters: urlState.filters,
    setFilters: urlState.updateFilters,
    productsMap,
    formatDate,
  }
}
