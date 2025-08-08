import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  Invoice,
  InvoiceStatus,
  PaymentMethod,
} from '../../../../application/domain/invoice'
import { invoiceService } from '../../../../application/domain/invoice'

export type InvoiceFilters = {
  status: 'ALL' | InvoiceStatus
  payment: 'ALL' | PaymentMethod
  dateFrom?: string // yyyy-mm-dd
  dateTo?: string // yyyy-mm-dd
}

export const useInvoicePage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filters, setFilters] = useState<InvoiceFilters>({
    status: 'ALL',
    payment: 'ALL',
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await invoiceService.getAll({
        page: 1,
        limit: 1000,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
      setInvoices(res.data)
    } catch (e: any) {
      setError(e?.message || 'Error cargando facturas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const applyFilters = useCallback(
    (items: Invoice[]): Invoice[] => {
      return items.filter(inv => {
        // status
        if (filters.status !== 'ALL' && inv.status !== filters.status)
          return false
        // payment
        if (filters.payment !== 'ALL' && inv.payment.method !== filters.payment)
          return false
        // date range by createdAt
        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom)
          from.setHours(0, 0, 0, 0)
          if (inv.createdAt < from) return false
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo)
          to.setHours(23, 59, 59, 999)
          if (inv.createdAt > to) return false
        }
        return true
      })
    },
    [filters]
  )

  const filtered = useMemo(
    () => applyFilters(invoices),
    [invoices, applyFilters]
  )

  const todayQuick = () => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const iso = `${yyyy}-${mm}-${dd}`
    setFilters(prev => ({ ...prev, dateFrom: iso, dateTo: iso }))
  }

  const clearDates = () =>
    setFilters(prev => ({ ...prev, dateFrom: undefined, dateTo: undefined }))

  const formatDateTime = (date: Date) => new Date(date).toLocaleString()

  return {
    loading,
    error,
    invoices: filtered,
    filters,
    setFilters,
    refresh: load,
    todayQuick,
    clearDates,
    formatDateTime,
  }
}
