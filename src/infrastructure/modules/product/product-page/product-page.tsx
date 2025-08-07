import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { EntityList } from '../../../components/entity/entity-list'
import { Pagination } from '../../../components/pagination'
import { SortControls } from '../../../components/sort-controls'
import { useProductPage } from './product-page.hook'
import './product-page.scss'

export const ProductPage = () => {
  const {
    products,
    loading,
    error,
    refresh,
    pagination,
    totalPages,
    total,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    deleteProduct,
    formatDate,
  } = useProductPage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  const handleDelete = async (id: string) => {
    if (
      window.confirm('¿Estás seguro de que quieres eliminar este producto?')
    ) {
      try {
        await deleteProduct(id)
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error al eliminar el producto')
      }
    }
  }

  const formatPhone = () => '' // No aplica para productos
  const getAge = () => 0 // No aplica para productos
  const getMonthName = () => '' // No aplica para productos

  return (
    <div className='product-page'>
      <div className='product-page__container'>
        {/* Header */}
        <div className='product-page__header'>
          <div className='product-page__title-section'>
            <h1 className='product-page__title'>Productos</h1>
            <span className='product-page__subtitle'>
              Gestiona los productos del barber shop
            </span>
          </div>
          <div className='product-page__actions'>
            <Link
              to='/products/form/new'
              className='product-page__button product-page__button--primary'
            >
              <span className='product-page__button-icon'>➕</span>
              <span className='product-page__button-text'>Nuevo Producto</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className='product-page__content'>
          {/* Toolbar */}
          <div className='product-page__toolbar'>
            <div className='product-page__search-section'>
              <div className='product-page__search-container'>
                <input
                  type='text'
                  placeholder='Buscar productos...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='product-page__search-input'
                />
              </div>
              <div className='product-page__sort-controls'>
                <SortControls
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSortChange={(sortBy, sortOrder) => {
                    setSortBy(sortBy)
                    setSortOrder(sortOrder)
                  }}
                />
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className='product-page__list-section'>
            {loading ? (
              <div className='product-page__loading'>
                <div className='product-page__loading-spinner'></div>
                <p className='product-page__loading-text'>
                  Cargando productos...
                </p>
              </div>
            ) : error ? (
              <div className='product-page__error'>
                <div className='product-page__error-icon'>⚠️</div>
                <h3 className='product-page__error-title'>Error</h3>
                <p className='product-page__error-message'>{error}</p>
                <button
                  onClick={refresh}
                  className='product-page__button product-page__button--primary'
                >
                  Reintentar
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className='product-page__empty'>
                <div className='product-page__empty-icon'>📦</div>
                <h3 className='product-page__empty-title'>No hay productos</h3>
                <p className='product-page__empty-message'>
                  {searchTerm
                    ? 'No se encontraron productos con ese término de búsqueda'
                    : 'Aún no se han creado productos. Crea el primer producto para comenzar.'}
                </p>
                {!searchTerm && (
                  <Link
                    to='/products/form/new'
                    className='product-page__button product-page__button--primary'
                  >
                    Crear Primer Producto
                  </Link>
                )}
              </div>
            ) : (
              <>
                <EntityList
                  entities={products}
                  entityType='product'
                  loading={loading}
                  onDeleteClick={handleDelete}
                  formatDate={formatDate}
                  formatPhone={formatPhone}
                  getAge={getAge}
                  getMonthName={getMonthName}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='product-page__pagination'>
                    <div className='product-page__pagination-info'>
                      Mostrando {(pagination.page - 1) * pagination.limit + 1}-
                      {Math.min(pagination.page * pagination.limit, total)} de{' '}
                      {total} productos
                    </div>
                    <div className='product-page__pagination-controls'>
                      <Pagination
                        meta={pagination}
                        onPageChange={() => {
                          // La paginación se maneja automáticamente por el hook
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
