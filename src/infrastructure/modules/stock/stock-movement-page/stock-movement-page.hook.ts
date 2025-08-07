import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { productService } from '../../../../application/domain/product/product.provider'
import {
  stockService,
  type StockMovement,
} from '../../../../application/domain/stock'
import { useURLState } from '../../../hooks/use-url-state.hook'

export const useStockMovementPage = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState<{ id: string; name: string } | null>(
    null
  )
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [stock, setStock] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros en URL
  type UIStockFilters = {
    dateFrom?: string
    dateTo?: string
    type?: '' | 'IN' | 'OUT'
  }
  const urlState = useURLState<UIStockFilters>({
    filters: {
      dateFrom: { type: 'string', defaultValue: '' },
      dateTo: { type: 'string', defaultValue: '' },
      type: { type: 'string', defaultValue: '' },
    },
    pagination: {
      page: { defaultValue: 1 },
      limit: { defaultValue: 25 },
      sortBy: { defaultValue: 'date' },
      sortOrder: { defaultValue: 'desc' },
    },
  })

  const effectiveFilters = useMemo(() => {
    return {
      ...(urlState.filters.dateFrom
        ? { dateFrom: new Date(urlState.filters.dateFrom) }
        : {}),
      ...(urlState.filters.dateTo
        ? { dateTo: new Date(urlState.filters.dateTo) }
        : {}),
      ...(urlState.filters.type === 'IN' || urlState.filters.type === 'OUT'
        ? { type: urlState.filters.type }
        : {}),
    }
  }, [urlState.filters])

  const formatDate = useCallback((date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleString()
  }, [])

  const load = useCallback(async () => {
    if (!productId) return
    setLoading(true)
    setError(null)
    try {
      const prodRes = await productService.getProductById(productId, {
        page: 1,
        limit: 1,
      })
      setProduct(prodRes.data[0] ?? null)

      const movs = await stockService.getMovementsByProduct(
        productId,
        effectiveFilters,
        {
          page: urlState.pagination.page,
          limit: urlState.pagination.limit,
          sortBy: urlState.pagination.sortBy,
          sortOrder: urlState.pagination.sortOrder,
        }
      )
      setMovements(movs.data)
      setStock(await stockService.getCurrentStock(productId))
    } catch (e: any) {
      setError(e?.message ?? 'Error cargando stock')
    } finally {
      setLoading(false)
    }
  }, [productId, effectiveFilters, urlState.pagination])

  useEffect(() => {
    void load()
  }, [load])

  // Formularios simples de cantidad y fecha
  const today = new Date()
  const toDateInput = (d: Date) => d.toISOString().slice(0, 10)
  const [entryQuantity, setEntryQuantity] = useState<string>('')
  const [entryDate, setEntryDate] = useState<string>(toDateInput(today))
  const [exitQuantity, setExitQuantity] = useState<string>('')
  const [exitDate, setExitDate] = useState<string>(toDateInput(today))

  const registerEntry = useCallback(async () => {
    if (!productId) return
    const quantity = Number(entryQuantity)
    if (!Number.isFinite(quantity) || quantity <= 0) return
    await stockService.registerEntry({
      productId,
      quantity,
      userId: 'admin_001',
      date: entryDate ? new Date(entryDate) : undefined,
    })
    setEntryQuantity('')
    await load()
  }, [productId, entryQuantity, entryDate, load])

  const registerExit = useCallback(async () => {
    if (!productId) return
    const quantity = Number(exitQuantity)
    if (!Number.isFinite(quantity) || quantity <= 0) return
    try {
      await stockService.registerExit({
        productId,
        quantity,
        userId: 'admin_001',
        date: exitDate ? new Date(exitDate) : undefined,
      })
    } catch (e: any) {
      window.alert(e?.message ?? 'Error registrando salida')
    }
    setExitQuantity('')
    await load()
  }, [productId, exitQuantity, exitDate, load])

  return {
    product,
    movements,
    stock,
    loading,
    error,
    registerEntry,
    registerExit,
    formatDate,
    // Filtros
    filters: urlState.filters,
    setFilters: urlState.updateFilters,
    // Formularios
    entryQuantity,
    setEntryQuantity,
    entryDate,
    setEntryDate,
    exitQuantity,
    setExitQuantity,
    exitDate,
    setExitDate,
  }
}
