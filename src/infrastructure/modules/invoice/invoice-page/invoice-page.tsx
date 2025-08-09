import { Link } from 'react-router-dom'
import { RouteIds, useRoutes } from '../../../routes'
import { useInvoicePage } from './invoice-page.hook'
import './invoice-page.scss'

export const InvoicePage = () => {
  const { buildRoutePathWithParams } = useRoutes()
  const {
    loading,
    error,
    invoices,
    filters,
    setFilters,
    todayQuick,
    clearDates,
    refresh,
    formatDateTime,
  } = useInvoicePage()

  const newInvoicePath =
    buildRoutePathWithParams(RouteIds.INVOICE_FORM_NEW, {}) ||
    '/invoices/form/new'

  const getActionPath = (invoice: any) => {
    if (invoice.status === 'PENDING') {
      return buildRoutePathWithParams(RouteIds.INVOICE_FORM_EDIT, {
        invoiceId: invoice.id,
      })
    }
    return buildRoutePathWithParams(RouteIds.INVOICE_DETAIL, {
      invoiceId: invoice.id,
    })
  }

  return (
    <div className='invoice-page'>
      <div className='invoice-page__header'>
        <h1 className='invoice-page__title'>Facturas</h1>
        <Link to={newInvoicePath} className='invoice-page__btn'>
          Nueva Factura
        </Link>
      </div>

      {/* Filtros */}
      <div className='invoice-page__filters'>
        <select
          className='invoice-page__select'
          value={filters.status}
          onChange={e =>
            setFilters(prev => ({ ...prev, status: e.target.value as any }))
          }
        >
          <option value='ALL'>Todos los estados</option>
          <option value='PENDING'>Pendientes</option>
          <option value='FINALIZED'>Finalizadas</option>
          <option value='CANCELED'>Canceladas</option>
        </select>
        <select
          className='invoice-page__select'
          value={filters.payment}
          onChange={e =>
            setFilters(prev => ({ ...prev, payment: e.target.value as any }))
          }
        >
          <option value='ALL'>Todos los pagos</option>
          <option value='TRANSFER'>Transferencia</option>
          <option value='CASH'>Efectivo</option>
        </select>
        <input
          type='date'
          className='invoice-page__input'
          value={filters.dateFrom || ''}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              dateFrom: e.target.value || undefined,
            }))
          }
        />
        <input
          type='date'
          className='invoice-page__input'
          value={filters.dateTo || ''}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              dateTo: e.target.value || undefined,
            }))
          }
        />
        <button
          className='invoice-page__btn invoice-page__btn--secondary'
          onClick={todayQuick}
        >
          Hoy
        </button>
        <button
          className='invoice-page__btn invoice-page__btn--secondary'
          onClick={clearDates}
        >
          Limpiar fechas
        </button>
        <button
          className='invoice-page__btn invoice-page__btn--secondary'
          onClick={refresh}
        >
          Refrescar
        </button>
      </div>

      {/* Lista */}
      <div className='invoice-page__list'>
        {loading && <div className='invoice-page__loading'>Cargando...</div>}
        {error && <div className='invoice-page__error'>❌ {error}</div>}
        {!loading && !error && invoices.length === 0 && (
          <div className='invoice-page__empty'>
            No hay facturas con los filtros actuales.
          </div>
        )}
        {!loading && !error && invoices.length > 0 && (
          <ul className='invoice-page__items'>
            {invoices.map(inv => (
              <li
                key={inv.id}
                className={`invoice-page__item invoice-page__item--${inv.status.toLowerCase()}`}
              >
                <div className='invoice-page__item-main'>
                  <div>
                    <strong>ID:</strong> {inv.id}
                  </div>
                  <div>
                    <strong>Cliente:</strong> {inv.clientId}
                  </div>
                  <div>
                    <strong>Estado:</strong> {inv.status}
                  </div>
                  <div>
                    <strong>Pago:</strong> {inv.payment.method}
                  </div>
                  <div>
                    <strong>Creada:</strong> {formatDateTime(inv.createdAt)} por{' '}
                    {inv.createdBy}
                  </div>
                </div>
                <div className='invoice-page__item-totals'>
                  <div>
                    Servicios: ${inv.totals.servicesTotal.toLocaleString()}
                  </div>
                  <div>
                    Productos: ${inv.totals.productsTotal.toLocaleString()}
                  </div>
                  <div className='invoice-page__item-grand'>
                    Total: ${inv.totals.grandTotal.toLocaleString()}
                  </div>
                </div>
                <div className='invoice-page__item-actions'>
                  <Link to={getActionPath(inv)} className='invoice-page__btn'>
                    {inv.status === 'PENDING' ? 'Editar' : 'Ver detalle'}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
