import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLayout } from '../../../components'
import { RouteIds, useRoutes } from '../../../routes'
import { useEmployeePage } from './employee-page.hook'
import './employee-page.scss'

export const EmployeePage = () => {
  const navigate = useNavigate()
  const { setHeaderTitle, setHeaderActions } = useLayout()
  const { getRoutePathById } = useRoutes()
  const {
    employees,
    loading,
    searchTerm,
    birthMonthFilter,
    handleSearch,
    handleBirthMonthFilter,
    clearFilters,
    deleteEmployee,
    formatDate,
    formatPhone,
    getMonthName,
  } = useEmployeePage()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )

  useEffect(() => {
    setHeaderTitle('Gestión de Empleados')
    setHeaderActions(
      <button
        onClick={() => {
          const newEmployeePath = getRoutePathById(RouteIds.EMPLOYEE_FORM_NEW)
          if (newEmployeePath) {
            navigate(newEmployeePath)
          }
        }}
        className='employee-page__action-button employee-page__action-button--edit'
      >
        ➕ Nuevo Empleado
      </button>
    )

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setHeaderActions, navigate])

  const handleDeleteClick = (employeeId: string) => {
    setShowDeleteConfirm(employeeId)
  }

  const handleDeleteConfirm = async (employeeId: string) => {
    await deleteEmployee(employeeId)
    setShowDeleteConfirm(null)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className='employee-page'>
        <div className='employee-page__content'>
          <div className='employee-page__loading'>
            <div className='employee-page__loading-spinner'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='employee-page'>
      <div className='employee-page__content'>
        {/* Sección de búsqueda y filtros */}
        <div className='employee-page__search-section'>
          <div className='employee-page__search-form'>
            <div className='employee-page__search-input'>
              <input
                type='text'
                placeholder='Buscar por nombre o teléfono...'
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div className='employee-page__filter-select'>
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

        {/* Tabla de empleados */}
        <div className='employee-page__table-container'>
          {employees.length === 0 ? (
            <div className='employee-page__empty-state'>
              <div className='employee-page__empty-state-icon'>
                <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <p className='employee-page__empty-state-text'>
                {searchTerm || birthMonthFilter !== ''
                  ? 'No se encontraron empleados con los filtros aplicados'
                  : 'No hay empleados registrados'}
              </p>
            </div>
          ) : (
            <table className='employee-page__table'>
              <thead className='employee-page__table-header'>
                <tr>
                  <th className='employee-page__table-header-cell'>Nombre</th>
                  <th className='employee-page__table-header-cell'>Teléfono</th>
                  <th className='employee-page__table-header-cell'>
                    Fecha de Cumpleaños
                  </th>
                  <th className='employee-page__table-header-cell'>
                    Fecha de Registro
                  </th>
                  <th className='employee-page__table-header-cell'>
                    Porcentaje
                  </th>
                  <th className='employee-page__table-header-cell'>Acciones</th>
                </tr>
              </thead>
              <tbody className='employee-page__table-body'>
                {employees.map(employee => (
                  <tr key={employee.id} className='employee-page__table-row'>
                    <td className='employee-page__table-cell employee-page__table-cell--name'>
                      {employee.name}
                    </td>
                    <td className='employee-page__table-cell employee-page__table-cell--phone'>
                      {formatPhone(employee.phoneNumber)}
                    </td>
                    <td className='employee-page__table-cell employee-page__table-cell--birth-date'>
                      {formatDate(employee.birthDate)}
                    </td>
                    <td className='employee-page__table-cell employee-page__table-cell--birth-date'>
                      {formatDate(employee.createdAt)}
                    </td>
                    <td className='employee-page__table-cell employee-page__table-cell--percentage'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        {employee.percentage}%
                      </span>
                    </td>
                    <td className='employee-page__table-cell employee-page__table-cell--actions'>
                      <div className='employee-page__action-buttons'>
                        <Link
                          to={
                            getRoutePathById(RouteIds.EMPLOYEE_DETAIL)?.replace(
                              ':employeeId',
                              employee.id
                            ) || '#'
                          }
                          className='employee-page__action-link employee-page__action-link--view'
                          title='Ver detalle del empleado'
                        >
                          👁️ Ver
                        </Link>
                        <Link
                          to={
                            getRoutePathById(
                              RouteIds.EMPLOYEE_FORM_EDIT
                            )?.replace(':employeeId', employee.id) || '#'
                          }
                          className='employee-page__action-link employee-page__action-link--edit'
                          title='Editar empleado'
                        >
                          ✏️ Editar
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(employee.id)}
                          className='employee-page__action-button employee-page__action-button--delete'
                          title='Eliminar empleado'
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
                ¿Estás seguro de que quieres eliminar este empleado? Esta acción
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

        {/* Formulario de empleado */}
      </div>
    </div>
  )
}
