import { useEffect } from 'react'
import { useEmployeeDetail } from './employee-detail.hook'
import './employee-detail.scss'

export const EmployeeDetail = () => {
  const {
    loading,
    isValidating,
    isValidEmployee,
    employee,
    error,
    handleEdit,
    handleBack,
    formatDate,
    formatPhone,
    getAge,
    getBirthMonth,
  } = useEmployeeDetail()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el employeeId
  if (isValidating) {
    return (
      <div className='employee-detail-page'>
        <div className='employee-detail-page__content'>
          <div className='employee-detail-page__loading'>
            <div className='employee-detail-page__loading-spinner'></div>
            <p>Validando empleado...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si el employeeId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidEmployee) {
    return null
  }

  if (loading) {
    return (
      <div className='employee-detail-page'>
        <div className='employee-detail-page__content'>
          <div className='employee-detail-page__loading'>
            <div className='employee-detail-page__loading-spinner'></div>
            <p>Cargando empleado...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className='employee-detail-page'>
        <div className='employee-detail-page__content'>
          <div className='employee-detail-page__error'>
            <div className='employee-detail-page__error-icon'>⚠️</div>
            <h3 className='employee-detail-page__error-title'>Error</h3>
            <p className='employee-detail-page__error-message'>
              {error || 'Empleado no encontrado'}
            </p>
            <button
              onClick={handleBack}
              className='employee-detail-page__button employee-detail-page__button--primary'
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='employee-detail-page'>
      <div className='employee-detail-page__content'>
        <div className='employee-detail-page__card'>
          {/* Información principal */}
          <div className='employee-detail-page__section'>
            <h2 className='employee-detail-page__section-title'>
              Información Personal
            </h2>
            <div className='employee-detail-page__info-grid'>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  Nombre:
                </span>
                <span className='employee-detail-page__info-value'>
                  {employee.name}
                </span>
              </div>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  Teléfono:
                </span>
                <span className='employee-detail-page__info-value'>
                  <a
                    href={`tel:${employee.phoneNumber}`}
                    className='employee-detail-page__phone-link'
                  >
                    {formatPhone(employee.phoneNumber)}
                  </a>
                </span>
              </div>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  Fecha de Nacimiento:
                </span>
                <span className='employee-detail-page__info-value'>
                  {formatDate(employee.birthDate)} ({getAge(employee.birthDate)}{' '}
                  años)
                </span>
              </div>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  Mes de Cumpleaños:
                </span>
                <span className='employee-detail-page__info-value'>
                  {getBirthMonth(employee.birthDate)}
                </span>
              </div>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  Porcentaje de Comisión:
                </span>
                <span className='employee-detail-page__info-value'>
                  <span className='employee-detail-page__info-value--percentage'>
                    {employee.percentage}%
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Información de auditoría */}
          <div className='employee-detail-page__section'>
            <h2 className='employee-detail-page__section-title'>
              Información del Sistema
            </h2>
            <div className='employee-detail-page__info-grid'>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  ID del Empleado:
                </span>
                <span className='employee-detail-page__info-value employee-detail-page__info-value--mono'>
                  {employee.id}
                </span>
              </div>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  Fecha de Creación:
                </span>
                <span className='employee-detail-page__info-value'>
                  {formatDate(employee.createdAt)}
                </span>
              </div>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  Última Actualización:
                </span>
                <span className='employee-detail-page__info-value'>
                  {formatDate(employee.updatedAt)}
                </span>
              </div>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  Creado por:
                </span>
                <span className='employee-detail-page__info-value'>
                  {employee.createdBy}
                </span>
              </div>
              <div className='employee-detail-page__info-item'>
                <span className='employee-detail-page__info-label'>
                  Actualizado por:
                </span>
                <span className='employee-detail-page__info-value'>
                  {employee.updatedBy}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className='employee-detail-page__section'>
            <h2 className='employee-detail-page__section-title'>Acciones</h2>
            <div className='employee-detail-page__actions'>
              <button
                onClick={handleEdit}
                className='employee-detail-page__action-button employee-detail-page__action-button--edit'
              >
                ✏️ Editar Empleado
              </button>
              <button
                onClick={() =>
                  window.open(`tel:${employee.phoneNumber}`, '_self')
                }
                className='employee-detail-page__action-button employee-detail-page__action-button--call'
              >
                📞 Llamar
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${employee.phoneNumber.replace('+', '')}`,
                    '_blank'
                  )
                }
                className='employee-detail-page__action-button employee-detail-page__action-button--whatsapp'
              >
                💬 WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
