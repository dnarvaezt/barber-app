import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { EntityList } from '../../../components/entity/entity-list'
import { Pagination } from '../../../components/pagination'
import { SortControls } from '../../../components/sort-controls'
import { useActivityPage } from './activity-page.hook'
import './activity-page.scss'

export const ActivityPage = () => {
  const {
    activities,
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
    deleteActivity,
    formatDate,
  } = useActivityPage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  const handleDelete = async (id: string) => {
    if (
      window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')
    ) {
      try {
        await deleteActivity(id)
      } catch (error) {
        console.error('Error deleting activity:', error)
        alert('Error al eliminar la actividad')
      }
    }
  }

  const formatPhone = () => '' // No aplica para actividades
  const getAge = () => 0 // No aplica para actividades
  const getMonthName = () => '' // No aplica para actividades

  return (
    <div className='activity-page'>
      <div className='activity-page__container'>
        {/* Header */}
        <div className='activity-page__header'>
          <div className='activity-page__title-section'>
            <h1 className='activity-page__title'>Actividades</h1>
            <span className='activity-page__subtitle'>
              Gestiona las actividades del barber shop
            </span>
          </div>
          <div className='activity-page__actions'>
            <Link
              to='/activities/form/new'
              className='activity-page__button activity-page__button--primary'
            >
              <span className='activity-page__button-icon'>➕</span>
              <span className='activity-page__button-text'>
                Nueva Actividad
              </span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className='activity-page__content'>
          {/* Toolbar */}
          <div className='activity-page__toolbar'>
            <div className='activity-page__search-section'>
              <div className='activity-page__search-container'>
                <input
                  type='text'
                  placeholder='Buscar actividades...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='activity-page__search-input'
                />
              </div>
              <div className='activity-page__sort-controls'>
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
          <div className='activity-page__list-section'>
            {loading ? (
              <div className='activity-page__loading'>
                <div className='activity-page__loading-spinner'></div>
                <p className='activity-page__loading-text'>
                  Cargando actividades...
                </p>
              </div>
            ) : error ? (
              <div className='activity-page__error'>
                <div className='activity-page__error-icon'>⚠️</div>
                <h3 className='activity-page__error-title'>Error</h3>
                <p className='activity-page__error-message'>{error}</p>
                <button
                  onClick={refresh}
                  className='activity-page__button activity-page__button--primary'
                >
                  Reintentar
                </button>
              </div>
            ) : activities.length === 0 ? (
              <div className='activity-page__empty'>
                <div className='activity-page__empty-icon'>📋</div>
                <h3 className='activity-page__empty-title'>
                  No hay actividades
                </h3>
                <p className='activity-page__empty-message'>
                  {searchTerm
                    ? 'No se encontraron actividades con ese término de búsqueda'
                    : 'Aún no se han creado actividades. Crea la primera actividad para comenzar.'}
                </p>
                {!searchTerm && (
                  <Link
                    to='/activities/form/new'
                    className='activity-page__button activity-page__button--primary'
                  >
                    Crear Primera Actividad
                  </Link>
                )}
              </div>
            ) : (
              <>
                <EntityList
                  entities={activities}
                  entityType='activity'
                  loading={loading}
                  onDeleteClick={handleDelete}
                  formatDate={formatDate}
                  formatPhone={formatPhone}
                  getAge={getAge}
                  getMonthName={getMonthName}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='activity-page__pagination'>
                    <div className='activity-page__pagination-info'>
                      Mostrando {(pagination.page - 1) * pagination.limit + 1}-
                      {Math.min(pagination.page * pagination.limit, total)} de{' '}
                      {total} actividades
                    </div>
                    <div className='activity-page__pagination-controls'>
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
