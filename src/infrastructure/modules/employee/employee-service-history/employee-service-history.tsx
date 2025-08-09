import { useCallback, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { PaginationParams } from '../../../../application/domain/common'
import type {
  EmployeeServiceHistoryFilters,
  EmployeeServiceHistoryRecord,
} from '../../../../application/domain/invoice/invoice.model'
import { invoiceService } from '../../../../application/domain/invoice/invoice.provider'
import { Pagination } from '../../../components/pagination/pagination'
import { usePaginatedList } from '../../../hooks/use-paginated-list.hook'
import { useUtils } from '../../../hooks/use-utils.hook'
import { RouteIds, useRoutes } from '../../../routes'
import './employee-service-history.scss'

type Filters = {
  dateFrom: string
  dateTo: string
  activityId: string | null
}

export const EmployeeServiceHistoryPage = () => {
  const params = useParams<{ employeeId: string }>()
  const employeeId = params.employeeId as string
  const { formatDate, formatDateTime, formatCurrency } = useUtils()
  const { buildRoutePathWithParams } = useRoutes()

  const load = useCallback(
    async (pagination: PaginationParams, filters: Partial<Filters>) => {
      // Validar fechas obligatorias
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

      const domainFilters: EmployeeServiceHistoryFilters = {
        dateFrom: new Date(filters.dateFrom),
        dateTo: new Date(filters.dateTo),
        activityId: filters.activityId ?? undefined,
      }

      return invoiceService.getEmployeeServiceHistory(
        employeeId,
        domainFilters,
        {
          ...pagination,
          sortBy: 'timestamp',
          sortOrder: 'desc',
        }
      )
    },
    [employeeId]
  )

  const list = usePaginatedList<EmployeeServiceHistoryRecord, Filters>({
    loadEntities: load,
    urlConfig: {
      filters: {
        dateFrom: { type: 'string', defaultValue: '' },
        dateTo: { type: 'string', defaultValue: '' },
        activityId: { type: 'string', defaultValue: null },
      },
      pagination: {
        page: { defaultValue: 1 },
        limit: { defaultValue: 10 },
        sortBy: { defaultValue: 'timestamp' },
        sortOrder: { defaultValue: 'desc' },
      },
    },
  })

  // Prefijar rango por defecto (últimos 30 días)
  useEffect(() => {
    const toISO = (d: Date) => d.toISOString().slice(0, 10)
    if (!list.filters.dateFrom || !list.filters.dateTo) {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 29)
      list.updateFilters({ dateFrom: toISO(start), dateTo: toISO(end) })
    }
  }, [list.filters.dateFrom, list.filters.dateTo, list])

  const totalCountText = useMemo(() => {
    return `${list.meta.total} servicios en el período`
  }, [list.meta.total])

  const handleClearFilters = () => {
    list.clearFilters()
  }

  return (
    <div className='employee-history-page'>
      <div className='employee-history-page__header'>
        <h1 className='employee-history-page__title'>Historial de Servicios</h1>
        <div className='employee-history-page__actions'>
          <Link
            to={buildRoutePathWithParams(RouteIds.EMPLOYEE_DETAIL, {
              employeeId,
            })}
            className='employee-history-page__btn'
          >
            ← Volver al detalle
          </Link>
        </div>
      </div>

      <div className='employee-history-page__filters'>
        <div className='employee-history-page__filter'>
          <label>Desde</label>
          <input
            type='date'
            value={list.filters.dateFrom || ''}
            onChange={e => list.updateFilters({ dateFrom: e.target.value })}
          />
        </div>
        <div className='employee-history-page__filter'>
          <label>Hasta</label>
          <input
            type='date'
            value={list.filters.dateTo || ''}
            onChange={e => list.updateFilters({ dateTo: e.target.value })}
          />
        </div>
        <div className='employee-history-page__filter'>
          <label>Actividad (opcional)</label>
          <input
            type='text'
            placeholder='activityId'
            value={list.filters.activityId || ''}
            onChange={e =>
              list.updateFilters({
                activityId: e.target.value || null,
              })
            }
          />
        </div>
        <button
          className='employee-history-page__btn employee-history-page__btn--secondary'
          onClick={handleClearFilters}
        >
          Limpiar filtros
        </button>
      </div>

      <div className='employee-history-page__summary'>
        <span>{totalCountText}</span>
      </div>

      {list.loading && (
        <div className='employee-history-page__loading'>Cargando...</div>
      )}
      {list.error && (
        <div className='employee-history-page__error'>Error: {list.error}</div>
      )}
      {!list.loading && !list.error && list.data.length === 0 && (
        <div className='employee-history-page__empty'>
          No hay servicios para el período seleccionado.
        </div>
      )}

      {!list.loading && !list.error && list.data.length > 0 && (
        <ul className='employee-history-page__list'>
          {list.data.map(item => (
            <li
              key={`${item.invoiceId}-${item.service.activityId}-${item.timestamp.toString()}`}
              className='employee-history-page__item'
            >
              <div className='employee-history-page__item-col'>
                <div className='employee-history-page__item-label'>Fecha</div>
                <div className='employee-history-page__item-value'>
                  {formatDateTime(item.timestamp)}
                </div>
              </div>
              <div className='employee-history-page__item-col'>
                <div className='employee-history-page__item-label'>Cliente</div>
                <div className='employee-history-page__item-value'>
                  <Link
                    to={buildRoutePathWithParams(RouteIds.CLIENT_DETAIL, {
                      clientId: item.clientId,
                    })}
                    className='employee-history-page__link'
                  >
                    {item.clientId}
                  </Link>
                </div>
              </div>
              <div className='employee-history-page__item-col'>
                <div className='employee-history-page__item-label'>
                  Servicio
                </div>
                <div className='employee-history-page__item-value'>
                  {item.service.activityName || item.service.activityId}
                </div>
              </div>
              <div className='employee-history-page__item-col'>
                <div className='employee-history-page__item-label'>Precio</div>
                <div className='employee-history-page__item-value'>
                  {formatCurrency(item.service.price)}
                </div>
              </div>
              <div className='employee-history-page__item-col'>
                <div className='employee-history-page__item-label'>Factura</div>
                <div className='employee-history-page__item-value'>
                  <Link
                    to={buildRoutePathWithParams(RouteIds.INVOICE_DETAIL, {
                      invoiceId: item.invoiceId,
                    })}
                    className='employee-history-page__link'
                  >
                    {item.invoiceId}
                  </Link>
                </div>
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

// no default export (rule)
