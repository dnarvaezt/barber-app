import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pagination, SortControls } from '../../../components'
import { EntityList } from '../../../components/entity/entity-list'
import { RouteIds, useRoutes } from '../../../routes'
import { useCategoryPage } from './category-page.hook'
import './category-page.scss'

export const CategoryPage = () => {
  const navigate = useNavigate()
  const { buildRoutePathWithParams } = useRoutes()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const {
    categories,
    loading,
    error,
    meta,
    searchTerm,
    sortBy,
    sortOrder,
    handleSearch,
    clearFilters,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    deleteCategory,
    formatDate,
  } = useCategoryPage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  const handleDeleteClick = (categoryId: string) => {
    setShowDeleteConfirm(categoryId)
  }

  const handleConfirmDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('❌ Error deleting category:', error)
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className='category-page'>
        <div className='category-page__content'>
          <div className='category-page__loading'>
            <div className='category-page__loading-spinner'></div>
            <p>Cargando categorías...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='category-page'>
        <div className='category-page__content'>
          <div className='category-page__error'>
            <div className='category-page__error-icon'>⚠️</div>
            <h3 className='category-page__error-title'>Error</h3>
            <p className='category-page__error-message'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='category-page__button category-page__button--primary'
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='category-page'>
      <div className='category-page__content'>
        {/* Header de la página */}
        <div className='category-page__header'>
          <div className='category-page__header-content'>
            <h1 className='category-page__title'>Gestión de Categorías</h1>
            <div className='category-page__header-actions'>
              <button
                onClick={() => {
                  const newCategoryPath = buildRoutePathWithParams(
                    RouteIds.CATEGORY_FORM_NEW,
                    {}
                  )
                  if (newCategoryPath) {
                    navigate(newCategoryPath)
                  }
                }}
                className='category-page__action-button category-page__action-button--edit'
              >
                ➕ Nueva Categoría
              </button>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className='category-page__filters'>
          <div className='category-page__search-section'>
            <input
              type='text'
              placeholder='Buscar categorías...'
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className='category-page__search-input'
            />
            {searchTerm && (
              <button
                onClick={() => {
                  clearFilters()
                }}
                className='px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              >
                Limpiar
              </button>
            )}
          </div>

          <div className='category-page__sort-section'>
            <SortControls
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onSortChange={handleSortChange}
              className='category-page__sort-controls'
            />
          </div>
        </div>

        {/* Lista de categorías */}
        <div className='category-page__content'>
          {loading ? (
            <div className='category-page__loading'>
              <p>Cargando categorías...</p>
            </div>
          ) : error ? (
            <div className='category-page__error'>
              <p>Error: {error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className='category-page__empty'>
              <p>No se encontraron categorías.</p>
            </div>
          ) : (
            <>
              {/* Tabla para desktop */}
              <div className='category-page__table-container'>
                <table className='category-page__table'>
                  <thead className='category-page__table-header'>
                    <tr>
                      <th>Nombre</th>
                      <th>Fecha de Creación</th>
                      <th>Última Actualización</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='category-page__table-body'>
                    {categories.map(category => (
                      <tr
                        key={category.id}
                        className='category-page__table-row'
                      >
                        <td className='category-page__table-cell'>
                          <div className='category-page__category-info'>
                            <span className='category-page__category-name'>
                              {category.name}
                            </span>
                          </div>
                        </td>
                        <td className='category-page__table-cell'>
                          {formatDate(category.createdAt)}
                        </td>
                        <td className='category-page__table-cell'>
                          {formatDate(category.updatedAt)}
                        </td>
                        <td className='category-page__table-cell'>
                          <div className='category-page__actions'>
                            <Link
                              to={buildRoutePathWithParams(
                                RouteIds.CATEGORY_DETAIL,
                                {
                                  categoryId: category.id,
                                }
                              )}
                              className='category-page__action-button category-page__action-button--view'
                            >
                              👁️ Ver
                            </Link>
                            <Link
                              to={buildRoutePathWithParams(
                                RouteIds.CATEGORY_FORM_EDIT,
                                {
                                  categoryId: category.id,
                                }
                              )}
                              className='category-page__action-button category-page__action-button--edit'
                            >
                              ✏️ Editar
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(category.id)}
                              className='category-page__action-button category-page__action-button--delete'
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tarjetas para móviles */}
              <EntityList
                entities={categories}
                entityType='category'
                loading={loading}
                error={error}
                onDeleteClick={handleDeleteClick}
                formatDate={formatDate}
                className='category-page__mobile-cards'
              />
            </>
          )}
        </div>

        {/* Componente de paginación */}
        <Pagination
          meta={meta}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
          className='category-page__pagination'
        />

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className='category-page__modal-overlay'>
            <div className='category-page__modal'>
              <div className='category-page__modal-header'>
                <h3>Confirmar Eliminación</h3>
              </div>
              <div className='category-page__modal-body'>
                <p>¿Estás seguro de que quieres eliminar esta categoría?</p>
                <p>Esta acción no se puede deshacer.</p>
              </div>
              <div className='category-page__modal-actions'>
                <button
                  onClick={handleCancelDelete}
                  className='category-page__button category-page__button--secondary'
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleConfirmDelete(showDeleteConfirm)}
                  className='category-page__button category-page__button--danger'
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
