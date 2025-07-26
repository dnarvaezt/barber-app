import { useEffect, useState } from 'react'
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from '../../../application/domain/client'
import { useLayout } from '../../components'
import { ClientForm } from './client-form'
import { useClientPage } from './client-page.hook'
import './client-page.scss'

export const ClientPage = () => {
  const { setHeaderTitle, setHeaderActions } = useLayout()
  const {
    clients,
    loading,
    searchTerm,
    birthMonthFilter,
    handleSearch,
    handleBirthMonthFilter,
    clearFilters,
    createClient,
    updateClient,
    deleteClient,
    formatDate,
    formatPhone,
    getMonthName,
  } = useClientPage()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [showClientForm, setShowClientForm] = useState<{
    mode: 'create' | 'edit'
    client?: Client
  } | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setHeaderTitle('Gestión de Clientes')
    setHeaderActions(
      <button
        onClick={() => setShowClientForm({ mode: 'create' })}
        className='client-page__action-button client-page__action-button--edit'
      >
        ➕ Nuevo Cliente
      </button>
    )

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setHeaderActions])

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

  return (
    <div className='client-page'>
      <div className='client-page__content'>
        {/* Sección de búsqueda y filtros */}
        <div className='client-page__search-section'>
          <div className='client-page__search-form'>
            <div className='client-page__search-input'>
              <input
                type='text'
                placeholder='Buscar por nombre o teléfono...'
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div className='client-page__filter-select'>
              <select
                value={birthMonthFilter}
                onChange={e =>
                  handleBirthMonthFilter(
                    e.target.value ? Number(e.target.value) : ''
                  )
                }
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Todos los meses</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
            {(searchTerm || birthMonthFilter !== '') && (
              <button
                onClick={clearFilters}
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
                {searchTerm || birthMonthFilter !== ''
                  ? 'No se encontraron clientes con los filtros aplicados'
                  : 'No hay clientes registrados'}
              </p>
            </div>
          ) : (
            <table className='client-page__table'>
              <thead className='client-page__table-header'>
                <tr>
                  <th className='client-page__table-header-cell'>Nombre</th>
                  <th className='client-page__table-header-cell'>Teléfono</th>
                  <th className='client-page__table-header-cell'>
                    Fecha de Cumpleaños
                  </th>
                  <th className='client-page__table-header-cell'>
                    Fecha de Registro
                  </th>
                  <th className='client-page__table-header-cell'>Acciones</th>
                </tr>
              </thead>
              <tbody className='client-page__table-body'>
                {clients.map(client => (
                  <tr key={client.id} className='client-page__table-row'>
                    <td className='client-page__table-cell client-page__table-cell--name'>
                      {client.name}
                    </td>
                    <td className='client-page__table-cell client-page__table-cell--phone'>
                      {formatPhone(client.phoneNumber)}
                    </td>
                    <td className='client-page__table-cell client-page__table-cell--birth-date'>
                      {formatDate(client.birthDate)}
                    </td>
                    <td className='client-page__table-cell client-page__table-cell--birth-date'>
                      {formatDate(client.createdAt)}
                    </td>
                    <td className='client-page__table-cell client-page__table-cell--actions'>
                      <div className='client-page__action-buttons'>
                        <button
                          onClick={() =>
                            setShowClientForm({ mode: 'edit', client })
                          }
                          className='client-page__action-button client-page__action-button--edit'
                        >
                          ✏️ Editar
                        </button>
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
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Confirmar Eliminación
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                ¿Estás seguro de que quieres eliminar este cliente? Esta acción
                no se puede deshacer.
              </p>
              <div className='flex justify-end gap-3'>
                <button
                  onClick={handleDeleteCancel}
                  className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                  className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700'
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de cliente */}
        {showClientForm && (
          <ClientForm
            client={showClientForm.client}
            onSubmit={async data => {
              setIsSubmitting(true)
              try {
                if (showClientForm.mode === 'create') {
                  await createClient(data as CreateClientRequest)
                } else {
                  await updateClient(data as UpdateClientRequest)
                }
                setShowClientForm(null)
              } catch (error) {
                console.error('Error submitting form:', error)
              } finally {
                setIsSubmitting(false)
              }
            }}
            onCancel={() => setShowClientForm(null)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}
