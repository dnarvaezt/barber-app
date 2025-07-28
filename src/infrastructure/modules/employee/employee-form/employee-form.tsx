import { useEffect } from 'react'
import { useEmployeeForm } from './employee-form.hook'
import './employee-form.scss'

export const EmployeeForm = () => {
  const {
    loading,
    isValidating,
    isValidEmployee,
    isEditing,
    formData,
    showSuccessMessage,
    errors,
    handleSubmit,
    handleCancel,
    handleInputChange,
  } = useEmployeeForm()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el employeeId
  if (isValidating) {
    return (
      <div className='employee-form'>
        <div className='employee-form__container'>
          <div className='employee-form__loading'>
            <div className='employee-form__loading-spinner'></div>
            <p className='employee-form__loading-text'>Validando empleado...</p>
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
      <div className='employee-form'>
        <div className='employee-form__container'>
          <div className='employee-form__loading'>
            <div className='employee-form__loading-spinner'></div>
            <p className='employee-form__loading-text'>Cargando empleado...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='employee-form'>
      <div className='employee-form__container'>
        <div className='employee-form__header'>
          <h1 className='employee-form__title'>
            {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h1>
          <p className='employee-form__subtitle'>
            {isEditing
              ? 'Actualiza la información del empleado'
              : 'Completa la información para crear un nuevo empleado'}
          </p>
        </div>

        <div className='employee-form__form'>
          {/* Mensaje de éxito */}
          {showSuccessMessage && (
            <div className='employee-form__success-message'>
              <div className='employee-form__success-icon'>✅</div>
              <p className='employee-form__success-text'>
                {isEditing
                  ? '¡Empleado actualizado exitosamente!'
                  : '¡Empleado creado exitosamente!'}
              </p>
            </div>
          )}

          {/* Mensaje de error general */}
          {errors.general && (
            <div className='employee-form__error-message'>
              <div className='employee-form__error-icon'>❌</div>
              <p className='employee-form__error-text'>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='employee-form__form-content'>
            {/* Campo Nombre */}
            <div className='employee-form__field'>
              <label htmlFor='name' className='employee-form__label'>
                Nombre completo *
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`employee-form__input ${
                  formData.name ? 'employee-form__input--filled' : ''
                }`}
                placeholder='Ingresa el nombre completo'
                required
              />
            </div>

            {/* Campo Teléfono */}
            <div className='employee-form__field'>
              <label htmlFor='phoneNumber' className='employee-form__label'>
                Número de teléfono *
              </label>
              <input
                type='tel'
                id='phoneNumber'
                value={formData.phoneNumber}
                onChange={e => handleInputChange('phoneNumber', e.target.value)}
                className={`employee-form__input ${
                  formData.phoneNumber ? 'employee-form__input--filled' : ''
                }`}
                placeholder='Ej: +57 300 123 4567'
                required
              />
            </div>

            {/* Campo Fecha de Nacimiento */}
            <div className='employee-form__field'>
              <label htmlFor='birthDate' className='employee-form__label'>
                Fecha de nacimiento *
              </label>
              <input
                type='date'
                id='birthDate'
                value={formData.birthDate}
                onChange={e => handleInputChange('birthDate', e.target.value)}
                className={`employee-form__input ${
                  formData.birthDate ? 'employee-form__input--filled' : ''
                }`}
                required
              />
            </div>

            {/* Campo Porcentaje */}
            <div className='employee-form__field'>
              <label htmlFor='percentage' className='employee-form__label'>
                Porcentaje de comisión *
              </label>
              <input
                type='number'
                id='percentage'
                value={formData.percentage}
                onChange={e => handleInputChange('percentage', e.target.value)}
                className={`employee-form__input ${
                  formData.percentage ? 'employee-form__input--filled' : ''
                }`}
                placeholder='Ej: 25'
                min='0'
                max='100'
                step='0.01'
                required
              />
              <p className='employee-form__help-text'>
                Ingresa el porcentaje de comisión que recibirá el empleado
                (0-100%)
              </p>
            </div>

            {/* Botones de acción */}
            <div className='employee-form__actions'>
              <button
                type='button'
                onClick={handleCancel}
                className='employee-form__button employee-form__button--secondary'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading}
                className='employee-form__button employee-form__button--primary'
              >
                {loading && (
                  <div className='employee-form__loading-spinner employee-form__loading-spinner--small'></div>
                )}
                <span className='employee-form__button-text'>
                  {isEditing ? 'Actualizar' : 'Crear'} Empleado
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
