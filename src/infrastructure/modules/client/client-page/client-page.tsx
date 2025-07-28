import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pagination, SortControls } from '../../../components'
import { RouteIds, useRoutes } from '../../../routes'
import { useClientPage } from './client-page.hook'
import './client-page.scss'

export const ClientPage = () => {
  const navigate = useNavigate()
  const { buildRoutePathWithParams } = useRoutes()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const {
    clients,
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
    deleteClient,
    formatDate,
    formatPhone,
    getMonthName,
  } = useClientPage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  const handleDeleteClick = (clientId: string) => {
    setShowDeleteConfirm(clientId)
  }

  const handleConfirmDelete = async (clientId: string) => {
    try {
      console.log('🗑️ Attempting to delete client:', clientId)
      await deleteClient(clientId)
      console.log('✅ Client deleted successfully:', clientId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('❌ Error deleting client:', error)
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  // Función para calcular la edad
  const getAge = (birthDate: Date) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--
    }

    return age
  }

  if (loading) {
    return (
      <div className='client-page'>
        <div className='client-page__content'>
          <div className='client-page__loading'>
            <div className='client-page__loading-spinner'></div>
            <p>Cargando clientes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='client-page'>
        <div className='client-page__content'>
          <div className='client-page__error'>
            <div className='client-page__error-icon'>⚠️</div>
            <h3 className='client-page__error-title'>Error</h3>
            <p className='client-page__error-message'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='client-page__button client-page__button--primary'
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='client-page'>
      <div className='client-page__content'>
        {/* Header de la página */}
        <div className='client-page__header'>
          <div className='client-page__header-content'>
            <h1 className='client-page__title'>Gestión de Clientes</h1>
            <div className='client-page__header-actions'>
              <button
                onClick={() => {
                  const newClientPath = buildRoutePathWithParams(
                    RouteIds.CLIENT_FORM_NEW,
                    {}
                  )
                  if (newClientPath) {
                    navigate(newClientPath)
                  }
                }}
                className='client-page__action-button client-page__action-button--edit'
              >
                ➕ Nuevo Cliente
              </button>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className='client-page__filters'>
          <div className='client-page__search-section'>
            <input
              type='text'
              placeholder='Buscar clientes...'
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className='client-page__search-input'
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

          <div className='client-page__sort-section'>
            <SortControls
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onSortChange={handleSortChange}
              className='client-page__sort-controls'
            />
          </div>
        </div>

        {/* Lista de clientes */}
        <div className='client-page__list'>
          {clients.length === 0 ? (
            <div className='client-page__empty'>
              <div className='client-page__empty-icon'>👥</div>
              <h3 className='client-page__empty-title'>No hay clientes</h3>
              <p className='client-page__empty-message'>
                {searchTerm
                  ? 'No se encontraron clientes con esa búsqueda.'
                  : 'Aún no hay clientes registrados.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => {
                    const newClientPath = buildRoutePathWithParams(
                      RouteIds.CLIENT_FORM_NEW,
                      {}
                    )
                    if (newClientPath) {
                      navigate(newClientPath)
                    }
                  }}
                  className='client-page__button client-page__button--primary'
                >
                  ➕ Agregar Primer Cliente
                </button>
              )}
            </div>
          ) : (
            <div className='client-page__table-container'>
              <table className='client-page__table'>
                <thead className='client-page__table-header'>
                  <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Fecha de Nacimiento</th>
                    <th>Edad</th>
                    <th>Mes de Nacimiento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className='client-page__table-body'>
                  {clients.map(client => (
                    <tr key={client.id} className='client-page__table-row'>
                      <td className='client-page__table-cell'>
                        <div className='client-page__client-info'>
                          <span className='client-page__client-name'>
                            {client.name}
                          </span>
                        </div>
                      </td>
                      <td className='client-page__table-cell'>
                        {formatPhone(client.phoneNumber)}
                      </td>
                      <td className='client-page__table-cell'>
                        {formatDate(client.birthDate)}
                      </td>
                      <td className='client-page__table-cell'>
                        {getAge(client.birthDate)}
                      </td>
                      <td className='client-page__table-cell'>
                        {getMonthName(new Date(client.birthDate).getMonth())}
                      </td>
                      <td className='client-page__table-cell'>
                        <div className='client-page__actions'>
                          <Link
                            to={buildRoutePathWithParams(
                              RouteIds.CLIENT_DETAIL,
                              {
                                clientId: client.id,
                              }
                            )}
                            className='client-page__action-button client-page__action-button--view'
                          >
                            👁️ Ver
                          </Link>
                          <Link
                            to={buildRoutePathWithParams(
                              RouteIds.CLIENT_FORM_EDIT,
                              {
                                clientId: client.id,
                              }
                            )}
                            className='client-page__action-button client-page__action-button--edit'
                          >
                            ✏️ Editar
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(client.id)}
                            className='client-page__action-button client-page__action-button--delete'
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
          )}
        </div>

        {/* Componente de paginación */}
        <Pagination
          meta={meta}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
          className='client-page__pagination'
        />

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className='client-page__modal-overlay'>
            <div className='client-page__modal'>
              <div className='client-page__modal-header'>
                <h3>Confirmar Eliminación</h3>
              </div>
              <div className='client-page__modal-body'>
                <p>¿Estás seguro de que quieres eliminar este cliente?</p>
                <p>Esta acción no se puede deshacer.</p>
              </div>
              <div className='client-page__modal-actions'>
                <button
                  onClick={handleCancelDelete}
                  className='client-page__button client-page__button--secondary'
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleConfirmDelete(showDeleteConfirm)}
                  className='client-page__button client-page__button--danger'
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
