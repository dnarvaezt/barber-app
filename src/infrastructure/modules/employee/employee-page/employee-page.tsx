import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pagination, SortControls } from '../../../components'
import { EntityList } from '../../../components/entity/entity-list'
import { RouteIds, useRoutes } from '../../../routes'
import { useEmployeePage } from './employee-page.hook'
import './employee-page.scss'

export const EmployeePage = () => {
  const navigate = useNavigate()
  const { buildRoutePathWithParams } = useRoutes()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const {
    employees,
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
    deleteEmployee,
    formatDate,
    formatPhone,
    getMonthName,
  } = useEmployeePage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  const handleDeleteClick = (employeeId: string) => {
    setShowDeleteConfirm(employeeId)
  }

  const handleConfirmDelete = async (employeeId: string) => {
    try {
      console.log('🗑️ Attempting to delete employee:', employeeId)
      await deleteEmployee(employeeId)
      console.log('✅ Employee deleted successfully:', employeeId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('❌ Error deleting employee:', error)
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
      <div className='employee-page'>
        <div className='employee-page__content'>
          <div className='employee-page__loading'>
            <div className='employee-page__loading-spinner'></div>
            <p>Cargando empleados...</p>
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
            <div className='employee-page__error-icon'>⚠️</div>
            <h3 className='employee-page__error-title'>Error</h3>
            <p className='employee-page__error-message'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='employee-page__button employee-page__button--primary'
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='employee-page'>
      <div className='employee-page__content'>
        {/* Header de la página */}
        <div className='employee-page__header'>
          <div className='employee-page__header-content'>
            <h1 className='employee-page__title'>Gestión de Empleados</h1>
            <div className='employee-page__header-actions'>
              <button
                onClick={() => {
                  const newEmployeePath = buildRoutePathWithParams(
                    RouteIds.EMPLOYEE_FORM_NEW,
                    {}
                  )
                  if (newEmployeePath) {
                    navigate(newEmployeePath)
                  }
                }}
                className='employee-page__action-button employee-page__action-button--edit'
              >
                ➕ Nuevo Empleado
              </button>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className='employee-page__filters'>
          <div className='employee-page__search-section'>
            <input
              type='text'
              placeholder='Buscar empleados...'
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className='employee-page__search-input'
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

          <div className='employee-page__sort-section'>
            <SortControls
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onSortChange={handleSortChange}
              className='employee-page__sort-controls'
            />
          </div>
        </div>

        {/* Lista de empleados */}
        <div className='employee-page__content'>
          {loading ? (
            <div className='employee-page__loading'>
              <p>Cargando empleados...</p>
            </div>
          ) : error ? (
            <div className='employee-page__error'>
              <p>Error: {error}</p>
            </div>
          ) : employees.length === 0 ? (
            <div className='employee-page__empty'>
              <p>No se encontraron empleados.</p>
            </div>
          ) : (
            <>
              {/* Tabla para desktop */}
              <div className='employee-page__table-container'>
                <table className='employee-page__table'>
                  <thead className='employee-page__table-header'>
                    <tr>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Fecha de Nacimiento</th>
                      <th>Edad</th>
                      <th>Mes de Nacimiento</th>
                      <th>Porcentaje</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='employee-page__table-body'>
                    {employees.map(employee => (
                      <tr
                        key={employee.id}
                        className='employee-page__table-row'
                      >
                        <td className='employee-page__table-cell'>
                          <div className='employee-page__employee-info'>
                            <span className='employee-page__employee-name'>
                              {employee.name}
                            </span>
                          </div>
                        </td>
                        <td className='employee-page__table-cell'>
                          {formatPhone(employee.phoneNumber)}
                        </td>
                        <td className='employee-page__table-cell'>
                          {formatDate(employee.birthDate)}
                        </td>
                        <td className='employee-page__table-cell'>
                          {getAge(employee.birthDate)}
                        </td>
                        <td className='employee-page__table-cell'>
                          {getMonthName(
                            new Date(employee.birthDate).getMonth()
                          )}
                        </td>
                        <td className='employee-page__table-cell'>
                          {employee.percentage}%
                        </td>
                        <td className='employee-page__table-cell'>
                          <div className='employee-page__actions'>
                            <Link
                              to={buildRoutePathWithParams(
                                RouteIds.EMPLOYEE_DETAIL,
                                {
                                  employeeId: employee.id,
                                }
                              )}
                              className='employee-page__action-button employee-page__action-button--view'
                            >
                              👁️ Ver
                            </Link>
                            <Link
                              to={buildRoutePathWithParams(
                                RouteIds.EMPLOYEE_FORM_EDIT,
                                {
                                  employeeId: employee.id,
                                }
                              )}
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
              </div>

              {/* Tarjetas para móviles */}
              <EntityList
                entities={employees}
                entityType='employee'
                loading={loading}
                error={error}
                onDeleteClick={handleDeleteClick}
                formatPhone={formatPhone}
                formatDate={formatDate}
                getAge={getAge}
                getMonthName={getMonthName}
                className='employee-page__mobile-cards'
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
          className='employee-page__pagination'
        />

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className='employee-page__modal-overlay'>
            <div className='employee-page__modal'>
              <div className='employee-page__modal-header'>
                <h3>Confirmar Eliminación</h3>
              </div>
              <div className='employee-page__modal-body'>
                <p>¿Estás seguro de que quieres eliminar este empleado?</p>
                <p>Esta acción no se puede deshacer.</p>
              </div>
              <div className='employee-page__modal-actions'>
                <button
                  onClick={handleCancelDelete}
                  className='employee-page__button employee-page__button--secondary'
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleConfirmDelete(showDeleteConfirm)}
                  className='employee-page__button employee-page__button--danger'
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
