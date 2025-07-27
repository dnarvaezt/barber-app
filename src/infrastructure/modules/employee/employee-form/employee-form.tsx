import { useEffect } from 'react'
import { useLayout } from '../../../components'
import { useEmployeeForm } from './employee-form.hook'
import './employee-form.scss'

export const EmployeeForm = () => {
  const { headerCommands } = useLayout()
  const {
    loading,
    isValidating,
    isValidEmployee,
    isSuccess,
    formData,
    errors,
    isEditing,
    handleSubmit,
    handleInputChange,
    handleCancel,
  } = useEmployeeForm()

  useEffect(() => {
    headerCommands.setTitle(isEditing ? 'Editar Empleado' : 'Nuevo Empleado')
    headerCommands.setActions(undefined)
    return () => {
      headerCommands.setActions(undefined)
    }
  }, [headerCommands, isEditing])

  // Mostrar loading mientras valida el employeeId
  if (isValidating) {
    return (
      <div className='employee-form-page'>
        <div className='employee-form-page__content'>
          <div className='employee-form-page__loading'>
            <div className='employee-form-page__loading-spinner'></div>
            <p>Validando empleado...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si el employeeId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidEmployee && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <div className='employee-form-page'>
        <div className='employee-form-page__content'>
          <div className='employee-form-page__loading'>
            <div className='employee-form-page__loading-spinner'></div>
            <p>Cargando empleado...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='employee-form-page'>
      <div className='employee-form-page__content'>
        <div className='employee-form-page__form-container'>
          <form onSubmit={handleSubmit} className='employee-form-page__form'>
            {/* Mensaje de éxito */}
            {isSuccess && (
              <div className='employee-form-page__success-message'>
                <div className='employee-form-page__success-icon'>✅</div>
                <p>
                  {isEditing
                    ? '¡Empleado actualizado exitosamente!'
                    : '¡Empleado creado exitosamente!'}
                </p>
                <p className='employee-form-page__success-subtitle'>
                  Redirigiendo al detalle del empleado...
                </p>
              </div>
            )}

            {/* Error general */}
            {errors.general && (
              <div className='employee-form-page__error-message'>
                {errors.general}
              </div>
            )}

            {/* Nombre */}
            <div className='employee-form-page__form-group'>
              <label htmlFor='name' className='employee-form-page__label'>
                Nombre Completo *
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`employee-form-page__input ${
                  errors.name ? 'employee-form-page__input--error' : ''
                }`}
                placeholder='Ingrese el nombre completo'
                disabled={loading}
              />
              {errors.name && (
                <p className='employee-form-page__error-text'>{errors.name}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className='employee-form-page__form-group'>
              <label
                htmlFor='phoneNumber'
                className='employee-form-page__label'
              >
                Número de Teléfono *
              </label>
              <input
                type='tel'
                id='phoneNumber'
                value={formData.phoneNumber}
                onChange={e => handleInputChange('phoneNumber', e.target.value)}
                className={`employee-form-page__input ${
                  errors.phoneNumber ? 'employee-form-page__input--error' : ''
                }`}
                placeholder='+573001234567'
                disabled={loading}
              />
              {errors.phoneNumber && (
                <p className='employee-form-page__error-text'>
                  {errors.phoneNumber}
                </p>
              )}
              <p className='employee-form-page__help-text'>
                Formato: +57 seguido de 10 dígitos
              </p>
            </div>

            {/* Fecha de Cumpleaños */}
            <div className='employee-form-page__form-group'>
              <label htmlFor='birthDate' className='employee-form-page__label'>
                Fecha de Cumpleaños *
              </label>
              <input
                type='date'
                id='birthDate'
                value={formData.birthDate}
                onChange={e => handleInputChange('birthDate', e.target.value)}
                className={`employee-form-page__input ${
                  errors.birthDate ? 'employee-form-page__input--error' : ''
                }`}
                disabled={loading}
              />
              {errors.birthDate && (
                <p className='employee-form-page__error-text'>
                  {errors.birthDate}
                </p>
              )}
            </div>

            {/* Porcentaje de Comisión */}
            <div className='employee-form-page__form-group'>
              <label htmlFor='percentage' className='employee-form-page__label'>
                Porcentaje de Comisión *
              </label>
              <input
                type='number'
                id='percentage'
                min='0'
                max='100'
                step='0.01'
                value={formData.percentage}
                onChange={e => handleInputChange('percentage', e.target.value)}
                className={`employee-form-page__input ${
                  errors.percentage ? 'employee-form-page__input--error' : ''
                }`}
                placeholder='25'
                disabled={loading}
              />
              {errors.percentage && (
                <p className='employee-form-page__error-text'>
                  {errors.percentage}
                </p>
              )}
              <p className='employee-form-page__help-text'>
                Porcentaje de comisión del 0% al 100%
              </p>
            </div>

            {/* Botones de acción */}
            <div className='employee-form-page__actions'>
              <button
                type='button'
                onClick={handleCancel}
                disabled={loading}
                className='employee-form-page__button employee-form-page__button--secondary'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading}
                className='employee-form-page__button employee-form-page__button--primary'
              >
                {loading && (
                  <div className='employee-form-page__loading-spinner employee-form-page__loading-spinner--small'></div>
                )}
                {isEditing ? 'Actualizar' : 'Crear'} Empleado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
