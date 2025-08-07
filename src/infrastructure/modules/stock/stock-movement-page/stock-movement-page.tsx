import { Link } from 'react-router-dom'
import { RouteIds, useRoutes } from '../../../routes'
import { useStockMovementPage } from './stock-movement-page.hook'
import './stock-movement-page.scss'

export const StockMovementPage = () => {
  const {
    product,
    movements,
    stock,
    loading,
    error,
    registerEntry,
    registerExit,
    formatDate,
    filters,
    setFilters,
    entryQuantity,
    setEntryQuantity,
    entryDate,
    setEntryDate,
    exitQuantity,
    setExitQuantity,
    exitDate,
    setExitDate,
  } = useStockMovementPage()
  const { buildRoutePathWithParams } = useRoutes()

  return (
    <div className='stock-movement'>
      <div className='stock-movement__container'>
        <div className='stock-movement__header-row'>
          <h1 className='stock-movement__title'>
            Stock de {product?.name ?? 'Producto'}
          </h1>
          {product?.id && (
            <Link
              to={buildRoutePathWithParams(RouteIds.PRODUCT_DETAIL, {
                productId: product.id,
              })}
              className='btn btn-link'
            >
              Ir al detalle del producto →
            </Link>
          )}
        </div>
        <div className='stock-movement__summary'>Stock actual: {stock}</div>

        {/* Filtros */}
        <div className='stock-movement__filters'>
          <div>
            <label>Desde</label>
            <input
              type='date'
              value={filters.dateFrom || ''}
              onChange={e => setFilters({ dateFrom: e.target.value })}
            />
          </div>
          <div>
            <label>Hasta</label>
            <input
              type='date'
              value={filters.dateTo || ''}
              onChange={e => setFilters({ dateTo: e.target.value })}
            />
          </div>
          <div>
            <label>Tipo</label>
            <select
              value={filters.type || ''}
              onChange={e => setFilters({ type: e.target.value as any })}
            >
              <option value=''>Todos</option>
              <option value='IN'>Entrada</option>
              <option value='OUT'>Salida</option>
            </select>
          </div>
        </div>

        {/* Formularios simples de registro */}
        <div className='stock-movement__actions'>
          <div>
            <strong>Registrar entrada</strong>
            <div>
              <input
                type='number'
                min={1}
                placeholder='Cantidad'
                value={entryQuantity}
                onChange={e => setEntryQuantity(e.target.value)}
              />
              <input
                type='date'
                value={entryDate}
                onChange={e => setEntryDate(e.target.value)}
              />
              <button onClick={registerEntry} className='btn btn-primary'>
                Guardar entrada
              </button>
            </div>
          </div>
          <div>
            <strong>Registrar salida</strong>
            <div>
              <input
                type='number'
                min={1}
                placeholder='Cantidad'
                value={exitQuantity}
                onChange={e => setExitQuantity(e.target.value)}
              />
              <input
                type='date'
                value={exitDate}
                onChange={e => setExitDate(e.target.value)}
              />
              <button onClick={registerExit} className='btn btn-secondary'>
                Guardar salida
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='stock-movement__loading'>Cargando...</div>
        ) : error ? (
          <div className='stock-movement__error'>{error}</div>
        ) : (
          <table className='stock-movement__table'>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(m => (
                <tr key={m.id}>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.type === 'IN' ? 'Entrada' : 'Salida'}</td>
                  <td>{m.quantity}</td>
                  <td>{m.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
