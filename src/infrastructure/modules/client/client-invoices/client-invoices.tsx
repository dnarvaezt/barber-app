import { useCallback, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { PaginationParams } from '../../../../application/domain/common'
import type {
  ClientInvoiceFilters,
  Invoice,
} from '../../../../application/domain/invoice/invoice.model'
import { invoiceService } from '../../../../application/domain/invoice/invoice.provider'
import { Pagination } from '../../../components/pagination/pagination'
import { usePaginatedList } from '../../../hooks/use-paginated-list.hook'
import { useUtils } from '../../../hooks/use-utils.hook'
import { RouteIds, useRoutes } from '../../../routes'
import './client-invoices.scss'

type Filters = {
  dateFrom: string
  dateTo: string
  status: 'PENDING' | 'FINALIZED' | 'CANCELED' | 'ALL'
}

export const ClientInvoicesPage = () => {
  const params = useParams<{ clientId: string }>()
  const clientId = params.clientId as string
  const { formatDateTime, formatCurrency } = useUtils()
  const { buildRoutePathWithParams } = useRoutes()

  const load = useCallback(
    async (pagination: PaginationParams, filters: Partial<Filters>) => {
      if (!filters.dateFrom || !filters.dateTo) {
        return {
          data: [],
          meta: {
            page: pagination.page,
            limit: pagination.limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }
      }

      const domainFilters: ClientInvoiceFilters = {
        dateFrom: new Date(filters.dateFrom),
        dateTo: new Date(filters.dateTo),
        status: (filters.status as Filters['status']) ?? 'ALL',
      }

      return invoiceService.getByClient(clientId, domainFilters, {
        ...pagination,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
    },
    [clientId]
  )

  const list = usePaginatedList<Invoice, Filters>({
    loadEntities: load,
    urlConfig: {
      filters: {
        dateFrom: { type: 'string', defaultValue: '' },
        dateTo: { type: 'string', defaultValue: '' },
        status: { type: 'string', defaultValue: 'ALL' },
      },
      pagination: {
        page: { defaultValue: 1 },
        limit: { defaultValue: 10 },
        sortBy: { defaultValue: 'createdAt' },
        sortOrder: { defaultValue: 'desc' },
      },
    },
  })

  // Prefijar rango por defecto (últimos 30 días) si no hay filtros en URL
  useEffect(() => {
    const toISO = (d: Date) => d.toISOString().slice(0, 10)
    if (!list.filters.dateFrom || !list.filters.dateTo) {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 29)
      list.updateFilters({ dateFrom: toISO(start), dateTo: toISO(end) })
    }
  }, [list.filters.dateFrom, list.filters.dateTo, list])

  const totals = useMemo(() => {
    const totalAmount = list.data.reduce(
      (sum, inv) => sum + (inv.totals?.grandTotal || 0),
      0
    )
    return {
      totalAmount,
      count: list.meta.total,
    }
  }, [list.data, list.meta.total])

  const handleClearFilters = () => {
    list.clearFilters()
  }

  return (
    <div className='client-invoices-page'>
      <div className='client-invoices-page__header'>
        <h1 className='client-invoices-page__title'>Facturas del Cliente</h1>
        <div className='client-invoices-page__actions'>
          <Link
            to={buildRoutePathWithParams(RouteIds.CLIENT_DETAIL, { clientId })}
            className='client-invoices-page__btn'
          >
            ← Volver al detalle
          </Link>
        </div>
      </div>

      <div className='client-invoices-page__filters'>
        <div className='client-invoices-page__filter'>
          <label>Desde</label>
          <input
            type='date'
            value={list.filters.dateFrom || ''}
            onChange={e => list.updateFilters({ dateFrom: e.target.value })}
          />
        </div>
        <div className='client-invoices-page__filter'>
          <label>Hasta</label>
          <input
            type='date'
            value={list.filters.dateTo || ''}
            onChange={e => list.updateFilters({ dateTo: e.target.value })}
          />
        </div>
        <div className='client-invoices-page__filter'>
          <label>Estado</label>
          <select
            value={(list.filters.status as Filters['status']) || 'ALL'}
            onChange={e =>
              list.updateFilters({
                status: e.target.value as Filters['status'],
              })
            }
          >
            <option value='ALL'>Todos</option>
            <option value='PENDING'>Pendiente</option>
            <option value='FINALIZED'>Finalizada</option>
            <option value='CANCELED'>Cancelada</option>
          </select>
        </div>
        <button
          className='client-invoices-page__btn client-invoices-page__btn--secondary'
          onClick={() => {
            const toISO = (d: Date) => d.toISOString().slice(0, 10)
            const today = toISO(new Date())
            list.updateFilters({ dateFrom: today, dateTo: today })
          }}
        >
          Hoy
        </button>
        <button
          className='client-invoices-page__btn client-invoices-page__btn--secondary'
          onClick={() => {
            const toISO = (d: Date) => d.toISOString().slice(0, 10)
            const end = new Date()
            const start = new Date()
            start.setDate(end.getDate() - 6)
            list.updateFilters({ dateFrom: toISO(start), dateTo: toISO(end) })
          }}
        >
          Últimos 7 días
        </button>
        <button
          className='client-invoices-page__btn client-invoices-page__btn--secondary'
          onClick={handleClearFilters}
        >
          Limpiar filtros
        </button>
      </div>

      <div className='client-invoices-page__summary'>
        <span>Facturas: {totals.count}</span>
        <span>Total facturado: {formatCurrency(totals.totalAmount)}</span>
      </div>

      {list.loading && (
        <div className='client-invoices-page__loading'>Cargando...</div>
      )}
      {list.error && (
        <div className='client-invoices-page__error'>Error: {list.error}</div>
      )}
      {!list.loading && !list.error && list.data.length === 0 && (
        <div className='client-invoices-page__empty'>
          No hay facturas para el período seleccionado.
        </div>
      )}

      {!list.loading && !list.error && list.data.length > 0 && (
        <ul className='client-invoices-page__list'>
          {list.data.map(inv => (
            <li
              key={inv.id}
              className={`client-invoices-page__item client-invoices-page__item--${inv.status.toLowerCase()}`}
            >
              <div className='client-invoices-page__item-main'>
                <div>
                  <strong>ID:</strong> {inv.id}
                </div>
                <div>
                  <strong>Fecha:</strong> {formatDateTime(inv.createdAt)}
                </div>
                <div>
                  <strong>Estado:</strong> {inv.status}
                </div>
                <div>
                  <strong>Método de pago:</strong> {inv.payment.method}
                </div>
              </div>
              <div className='client-invoices-page__item-totals'>
                <div>Servicios: {formatCurrency(inv.totals.servicesTotal)}</div>
                <div>Productos: {formatCurrency(inv.totals.productsTotal)}</div>
                <div className='client-invoices-page__item-grand'>
                  Total: {formatCurrency(inv.totals.grandTotal)}
                </div>
              </div>
              <div className='client-invoices-page__item-actions'>
                <Link
                  to={buildRoutePathWithParams(RouteIds.INVOICE_DETAIL, {
                    invoiceId: inv.id,
                  })}
                  className='client-invoices-page__btn'
                >
                  Ver detalle
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        meta={list.meta}
        onPageChange={page => list.updatePagination({ page })}
        onLimitChange={limit => list.updatePagination({ limit })}
        showLimitSelector
      />
    </div>
  )
}

export default ClientInvoicesPage
