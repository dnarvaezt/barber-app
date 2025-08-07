import { useStockPage } from './stock-page.hook'
import './stock-page.scss'

export const StockPage = () => {
  const {
    movements,
    loading,
    error,
    pagination,
    total,
    totalPages,
    filters,
    setFilters,
    productsMap,
    formatDate,
  } = useStockPage()

  return (
    <div className='stock-page'>
      <div className='stock-page__container'>
        <div className='stock-page__header'>
          <div className='stock-page__title-section'>
            <h1 className='stock-page__title'>Movimientos de Stock</h1>
            <span className='stock-page__subtitle'>Visión general diaria</span>
          </div>
        </div>

        <div className='stock-page__filters'>
          <div className='stock-page__filter'>
            <label>Desde</label>
            <input
              type='date'
              value={filters.dateFrom || ''}
              onChange={e => setFilters({ dateFrom: e.target.value })}
            />
          </div>
          <div className='stock-page__filter'>
            <label>Hasta</label>
            <input
              type='date'
              value={filters.dateTo || ''}
              onChange={e => setFilters({ dateTo: e.target.value })}
            />
          </div>
          <div className='stock-page__filter'>
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
          <div className='stock-page__filter'>
            <label>Producto</label>
            <input
              type='text'
              placeholder='Nombre o código'
              value={filters.search ?? ''}
              onChange={e => setFilters({ search: e.target.value })}
            />
          </div>
        </div>

        <div className='stock-page__content'>
          {loading ? (
            <div className='stock-page__loading'>Cargando...</div>
          ) : error ? (
            <div className='stock-page__error'>{error}</div>
          ) : movements.length === 0 ? (
            <div className='stock-page__empty'>Sin movimientos</div>
          ) : (
            <table className='stock-page__table'>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Observaciones</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {movements.map(mov => (
                  <tr key={mov.id}>
                    <td>{formatDate(mov.date)}</td>
                    <td>{productsMap[mov.productId]?.name || mov.productId}</td>
                    <td>{mov.type === 'IN' ? 'Entrada' : 'Salida'}</td>
                    <td>{mov.quantity}</td>
                    <td>{mov.note || '-'}</td>
                    <td>{mov.userId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className='stock-page__pagination'>
              <span>
                Mostrando {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, total)} de {total}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
