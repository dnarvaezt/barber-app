import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pagination, useLayout } from '../../../components'
import { RouteIds, useRoutes } from '../../../routes'
import { useEmployeePage } from './employee-page.hook'
import './employee-page.scss'

export const EmployeePage = () => {
  const navigate = useNavigate()
  const { headerCommands } = useLayout()
  const { getRoutePathById } = useRoutes()
  const {
    employees,
    loading,
    error,
    meta,
    searchTerm,
    birthMonthFilter,
    handleSearch,
    handleBirthMonthFilter,
    clearFilters,
    handlePageChange,
    handleLimitChange,
    deleteEmployee,
    formatDate,
    formatPhone,
    getMonthName,
  } = useEmployeePage()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )

  useEffect(() => {
    headerCommands.setTitle('Gestión de Empleados')
    headerCommands.setActions(
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
      headerCommands.setActions(undefined)
    }
  }, [headerCommands, navigate, getRoutePathById])

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

  // Obtener rutas dinámicas
  const getEmployeeDetailPath = (employeeId: string) => {
    return (
      getRoutePathById(RouteIds.EMPLOYEE_DETAIL)?.replace(
        ':employeeId',
        employeeId
      ) || '#'
    )
  }

  const getEmployeeEditPath = (employeeId: string) => {
    return (
      getRoutePathById(RouteIds.EMPLOYEE_FORM_EDIT)?.replace(
        ':employeeId',
        employeeId
      ) || '#'
    )
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

  if (error) {
    return (
      <div className='employee-page'>
        <div className='employee-page__content'>
          <div className='employee-page__error'>
            <p className='employee-page__error-message'>Error: {error}</p>
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
            <>
              <table className='employee-page__table'>
                <thead className='employee-page__table-header'>
                  <tr>
                    <th className='employee-page__table-header-cell'>Nombre</th>
                    <th className='employee-page__table-header-cell'>
                      Teléfono
                    </th>
                    <th className='employee-page__table-header-cell'>
                      Fecha de Nacimiento
                    </th>
                    <th className='employee-page__table-header-cell'>Edad</th>
                    <th className='employee-page__table-header-cell'>
                      Mes de Cumpleaños
                    </th>
                    <th className='employee-page__table-header-cell'>
                      Porcentaje
                    </th>
                    <th className='employee-page__table-header-cell'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className='employee-page__table-body'>
                  {employees.map(employee => (
                    <tr key={employee.id} className='employee-page__table-row'>
                      <td className='employee-page__table-cell'>
                        {employee.name}
                      </td>
                      <td className='employee-page__table-cell'>
                        {formatPhone(employee.phoneNumber)}
                      </td>
                      <td className='employee-page__table-cell'>
                        {formatDate(employee.birthDate)}
                      </td>
                      <td className='employee-page__table-cell'>
                        {Math.floor(
                          (Date.now() - employee.birthDate.getTime()) /
                            (1000 * 60 * 60 * 24 * 365.25)
                        )}{' '}
                        años
                      </td>
                      <td className='employee-page__table-cell'>
                        {getMonthName(employee.birthDate.getMonth() + 1)}
                      </td>
                      <td className='employee-page__table-cell'>
                        {employee.percentage}%
                      </td>
                      <td className='employee-page__table-cell'>
                        <div className='employee-page__table-actions'>
                          <Link
                            to={getEmployeeDetailPath(employee.id)}
                            className='employee-page__action-button employee-page__action-button--view'
                          >
                            👁️ Ver
                          </Link>
                          <Link
                            to={getEmployeeEditPath(employee.id)}
                            className='employee-page__action-button employee-page__action-button--edit'
                          >
                            ✏️ Editar
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(employee.id)}
                            className='employee-page__action-button employee-page__action-button--delete'
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
                className='employee-page__pagination'
              />
            </>
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className='employee-page__delete-modal'>
            <div className='employee-page__delete-modal-content'>
              <h3 className='employee-page__delete-modal-title'>
                Confirmar eliminación
              </h3>
              <p className='employee-page__delete-modal-message'>
                ¿Estás seguro de que quieres eliminar este empleado? Esta acción
                no se puede deshacer.
              </p>
              <div className='employee-page__delete-modal-actions'>
                <button
                  onClick={handleDeleteCancel}
                  className='employee-page__delete-modal-button employee-page__delete-modal-button--cancel'
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                  className='employee-page__delete-modal-button employee-page__delete-modal-button--confirm'
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
