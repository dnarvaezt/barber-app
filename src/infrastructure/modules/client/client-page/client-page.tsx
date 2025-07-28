import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pagination, useLayout } from '../../../components'
import { useSearchInput } from '../../../hooks'
import { RouteIds, useRoutes } from '../../../routes'
import { useClientPage } from './client-page.hook'
import './client-page.scss'

export const ClientPage = () => {
  const navigate = useNavigate()
  const { headerCommands } = useLayout()
  const { getRoutePathById } = useRoutes()
  const {
    clients,
    loading,
    error,
    meta,
    searchTerm,

    handleSearch,
    clearFilters,
    handlePageChange,
    handleLimitChange,
    deleteClient,
    formatDate,
    formatPhone,
    getMonthName,
  } = useClientPage()

  // Hook para manejar la búsqueda con debounce y eventos de teclado
  const searchInput = useSearchInput({
    onSearch: handleSearch,
    debounceMs: 300,
    initialValue: searchTerm,
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )

  useEffect(() => {
    headerCommands.setTitle('Gestión de Clientes')
    headerCommands.setActions(
      <button
        onClick={() => {
          const newClientPath = getRoutePathById(RouteIds.CLIENT_FORM_NEW)
          if (newClientPath) {
            navigate(newClientPath)
          }
        }}
        className='client-page__action-button client-page__action-button--edit'
      >
        ➕ Nuevo Cliente
      </button>
    )

    return () => {
      headerCommands.setActions(undefined)
    }
  }, [headerCommands, navigate, getRoutePathById])

  const handleDeleteClick = (clientId: string) => {
    setShowDeleteConfirm(clientId)
  }

  const handleDeleteConfirm = async (clientId: string) => {
    await deleteClient(clientId)
    setShowDeleteConfirm(null)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null)
  }

  // Obtener rutas dinámicas
  const getClientDetailPath = (clientId: string) => {
    return (
      getRoutePathById(RouteIds.CLIENT_DETAIL)?.replace(
        ':clientId',
        clientId
      ) || '#'
    )
  }

  const getClientEditPath = (clientId: string) => {
    return (
      getRoutePathById(RouteIds.CLIENT_FORM_EDIT)?.replace(
        ':clientId',
        clientId
      ) || '#'
    )
  }

  if (loading) {
    return (
      <div className='client-page'>
        <div className='client-page__content'>
          <div className='client-page__loading'>
            <div className='client-page__loading-spinner'></div>
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
            <p className='client-page__error-message'>Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='client-page'>
      <div className='client-page__content'>
        {/* Sección de búsqueda y filtros */}
        <div className='client-page__search-section'>
          <div className='client-page__search-form'>
            <div className='client-page__search-input'>
              <input
                type='text'
                placeholder='Buscar por nombre o teléfono... (Enter para buscar, Esc para limpiar)'
                value={searchInput.searchValue}
                onChange={e => searchInput.handleInputChange(e.target.value)}
                onKeyDown={searchInput.handleKeyDown}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              {searchInput.isSearching && (
                <div className='client-page__search-loading'>
                  <div className='client-page__search-loading-spinner'></div>
                </div>
              )}
            </div>

            {searchInput.searchValue && (
              <button
                onClick={() => {
                  searchInput.clearSearch()
                  clearFilters()
                }}
                className='px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Tabla de clientes */}
        <div className='client-page__table-container'>
          {clients.length === 0 ? (
            <div className='client-page__empty-state'>
              <div className='client-page__empty-state-icon'>
                <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <p className='client-page__empty-state-text'>
                {searchInput.searchValue
                  ? 'No se encontraron clientes con los filtros aplicados'
                  : 'No hay clientes registrados'}
              </p>
            </div>
          ) : (
            <>
              <table className='client-page__table'>
                <thead className='client-page__table-header'>
                  <tr>
                    <th className='client-page__table-header-cell'>Nombre</th>
                    <th className='client-page__table-header-cell'>Teléfono</th>
                    <th className='client-page__table-header-cell'>
                      Fecha de Nacimiento
                    </th>
                    <th className='client-page__table-header-cell'>Edad</th>
                    <th className='client-page__table-header-cell'>
                      Mes de Cumpleaños
                    </th>
                    <th className='client-page__table-header-cell'>Acciones</th>
                  </tr>
                </thead>
                <tbody className='client-page__table-body'>
                  {clients.map(client => (
                    <tr key={client.id} className='client-page__table-row'>
                      <td className='client-page__table-cell'>{client.name}</td>
                      <td className='client-page__table-cell'>
                        {formatPhone(client.phoneNumber)}
                      </td>
                      <td className='client-page__table-cell'>
                        {formatDate(client.birthDate)}
                      </td>
                      <td className='client-page__table-cell'>
                        {Math.floor(
                          (Date.now() - client.birthDate.getTime()) /
                            (1000 * 60 * 60 * 24 * 365.25)
                        )}{' '}
                        años
                      </td>
                      <td className='client-page__table-cell'>
                        {getMonthName(client.birthDate.getMonth() + 1)}
                      </td>
                      <td className='client-page__table-cell'>
                        <div className='client-page__table-actions'>
                          <Link
                            to={getClientDetailPath(client.id)}
                            className='client-page__action-button client-page__action-button--view'
                          >
                            👁️ Ver
                          </Link>
                          <Link
                            to={getClientEditPath(client.id)}
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

              {/* Componente de paginación */}
              <Pagination
                meta={meta}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                showLimitSelector={true}
                className='client-page__pagination'
              />
            </>
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className='client-page__delete-modal'>
            <div className='client-page__delete-modal-content'>
              <h3 className='client-page__delete-modal-title'>
                Confirmar eliminación
              </h3>
              <p className='client-page__delete-modal-message'>
                ¿Estás seguro de que quieres eliminar este cliente? Esta acción
                no se puede deshacer.
              </p>
              <div className='client-page__delete-modal-actions'>
                <button
                  onClick={handleDeleteCancel}
                  className='client-page__delete-modal-button client-page__delete-modal-button--cancel'
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                  className='client-page__delete-modal-button client-page__delete-modal-button--confirm'
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
