import { Link } from 'react-router-dom'
import { RouteIds, useRoutes } from '../../../routes'
import './invoice-form.scss'
import { useInvoiceForm } from './use-invoice-form.hook'

export const InvoiceForm = () => {
  const { buildRoutePath } = useRoutes()
  const {
    loading,
    error,
    successMessage,
    clients,
    activities,
    employees,
    products,
    clientId,
    services,
    productItems,
    courtesyProductId,
    comment,
    paymentMethod,
    amountReceived,
    totals,
    change,
    createdInvoice,
    setClientId,
    setComment,
    setPaymentMethod,
    setAmountReceived,
    setCourtesyProductId,
    addService,
    removeService,
    addProductItem,
    removeProductItem,
    savePending,
    finalize,
    cancel,
  } = useInvoiceForm()

  return (
    <div className='invoice-form'>
      <div className='invoice-form__header'>
        <h1 className='invoice-form__title'>Nueva Factura</h1>
        <Link
          to={buildRoutePath(RouteIds.INVOICES) || '/invoices'}
          className='invoice-form__btn'
        >
          Volver
        </Link>
      </div>
      <div className='invoice-form__content'>
        {error && <div className='invoice-form__error'>❌ {error}</div>}
        {successMessage && (
          <div className='invoice-form__success'>✅ {successMessage}</div>
        )}

        {/* Cliente */}
        <section className='invoice-form__section'>
          <h2 className='invoice-form__section-title'>Cliente</h2>
          <div className='invoice-form__row'>
            <select
              className='invoice-form__select'
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              disabled={loading}
            >
              <option value=''>Selecciona un cliente</option>
              {clients.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {/* Botón para crear cliente nuevo (futuro) */}
            {/* <Link to={...}>Nuevo Cliente</Link> */}
          </div>
        </section>

        {/* Servicios */}
        <section className='invoice-form__section'>
          <h2 className='invoice-form__section-title'>Servicios</h2>
          <div className='invoice-form__row'>
            <select
              id='activity'
              className='invoice-form__select'
              disabled={loading}
            >
              <option value=''>Selecciona un servicio</option>
              {activities.map(a => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <select
              id='employee'
              className='invoice-form__select'
              disabled={loading}
            >
              <option value=''>Selecciona empleado</option>
              {employees.map(e => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
            <button
              type='button'
              className='invoice-form__btn'
              onClick={() => {
                const act = (
                  document.getElementById('activity') as HTMLSelectElement
                )?.value
                const emp = (
                  document.getElementById('employee') as HTMLSelectElement
                )?.value
                if (act && emp) addService(act, emp)
              }}
              disabled={loading}
            >
              Agregar Servicio
            </button>
          </div>
          {services.length > 0 && (
            <ul className='invoice-form__list'>
              {services.map((s, idx) => (
                <li
                  key={`${s.activityId}-${idx}`}
                  className='invoice-form__list-item'
                >
                  <span>
                    {s.activityName} — Empleado: {s.employeeId} — $
                    {s.price.toLocaleString()}
                  </span>
                  <button
                    type='button'
                    className='invoice-form__btn invoice-form__btn--danger'
                    onClick={() => removeService(idx)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Productos */}
        <section className='invoice-form__section'>
          <h2 className='invoice-form__section-title'>Productos</h2>
          <div className='invoice-form__row'>
            <select
              id='product'
              className='invoice-form__select'
              disabled={loading}
            >
              <option value=''>Selecciona un producto</option>
              {products.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <input
              id='productQty'
              className='invoice-form__input'
              type='number'
              min={1}
              defaultValue={1}
            />
            <button
              type='button'
              className='invoice-form__btn'
              onClick={() => {
                const prod = (
                  document.getElementById('product') as HTMLSelectElement
                )?.value
                const qtyStr = (
                  document.getElementById('productQty') as HTMLInputElement
                )?.value
                const qty = Number(qtyStr || 0)
                if (prod && qty > 0) addProductItem(prod, qty)
              }}
              disabled={loading}
            >
              Agregar Producto
            </button>
          </div>
          {productItems.length > 0 && (
            <ul className='invoice-form__list'>
              {productItems.map((p, idx) => (
                <li
                  key={`${p.productId}-${idx}`}
                  className='invoice-form__list-item'
                >
                  <span>
                    {p.name} — {p.quantity} x ${p.unitPrice.toLocaleString()} =
                    ${(p.unitPrice * p.quantity).toLocaleString()}
                  </span>
                  <button
                    type='button'
                    className='invoice-form__btn invoice-form__btn--danger'
                    onClick={() => removeProductItem(idx)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Cortesía */}
        <section className='invoice-form__section'>
          <h2 className='invoice-form__section-title'>
            Producto de Cortesía (1 máx)
          </h2>
          <div className='invoice-form__row'>
            <select
              value={courtesyProductId || ''}
              onChange={e => setCourtesyProductId(e.target.value || undefined)}
              className='invoice-form__select'
              disabled={loading}
            >
              <option value=''>Sin cortesía</option>
              {products.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Pago */}
        <section className='invoice-form__section'>
          <h2 className='invoice-form__section-title'>Pago</h2>
          <div className='invoice-form__row'>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as any)}
              className='invoice-form__select'
              disabled={loading}
            >
              <option value='TRANSFER'>Transferencia</option>
              <option value='CASH'>Efectivo</option>
            </select>
            {paymentMethod === 'CASH' && (
              <>
                <input
                  className='invoice-form__input'
                  type='number'
                  min={0}
                  placeholder='Monto recibido'
                  value={amountReceived}
                  onChange={e =>
                    setAmountReceived(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                />
                <div className='invoice-form__hint'>
                  Devuelta: ${change.toLocaleString()}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Comentario */}
        <section className='invoice-form__section'>
          <h2 className='invoice-form__section-title'>Comentario</h2>
          <textarea
            className='invoice-form__textarea'
            rows={3}
            placeholder='Agrega un comentario opcional'
            value={comment}
            onChange={e => setComment(e.target.value)}
            disabled={loading}
          />
        </section>

        {/* Totales */}
        <section className='invoice-form__section invoice-form__section--totals'>
          <div>Servicios: ${totals.servicesTotal.toLocaleString()}</div>
          <div>Productos: ${totals.productsTotal.toLocaleString()}</div>
          <div className='invoice-form__grand'>
            Total: ${totals.grandTotal.toLocaleString()}
          </div>
        </section>

        {/* Acciones */}
        <section className='invoice-form__actions'>
          <button
            className='invoice-form__btn invoice-form__btn--secondary'
            onClick={savePending}
            disabled={loading}
          >
            Guardar (Pendiente)
          </button>
          <button
            className='invoice-form__btn invoice-form__btn--primary'
            onClick={finalize}
            disabled={loading}
          >
            Finalizar
          </button>
          <button
            className='invoice-form__btn invoice-form__btn--danger'
            onClick={cancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </section>

        {createdInvoice && (
          <div className='invoice-form__meta'>
            <small>
              ID Factura: {createdInvoice.id} — Estado: {createdInvoice.status}
            </small>
          </div>
        )}
      </div>
    </div>
  )
}
