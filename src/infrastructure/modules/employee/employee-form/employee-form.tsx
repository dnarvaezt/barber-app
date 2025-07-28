import { useEffect } from 'react'
import { useEmployeeForm } from './employee-form.hook'
import './employee-form.scss'

export const EmployeeForm = () => {
  const {
    loading,
    isValidating,
    isValidEmployee,
    employee,
    isEditing,
    formData,
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
        <div className='employee-form-page__header'>
          <h1 className='employee-form-page__title'>
            {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h1>
        </div>

        <div className='employee-form-page__form-container'>
          <form onSubmit={handleSubmit} className='employee-form-page__form'>
            {/* Mensaje de éxito */}
            {employee && (
              <div className='employee-form-page__success-message'>
                <div className='employee-form-page__success-icon'>✅</div>
                <p>
                  {isEditing
                    ? '¡Empleado actualizado exitosamente!'
                    : '¡Empleado creado exitosamente!'}
                </p>
              </div>
            )}

            {/* Campo Nombre */}
            <div className='employee-form-page__field'>
              <label htmlFor='name' className='employee-form-page__label'>
                Nombre *
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`employee-form-page__input ${
                  formData.name ? 'employee-form-page__input--filled' : ''
                }`}
                placeholder='Ingresa el nombre del empleado'
                required
              />
            </div>

            {/* Campo Teléfono */}
            <div className='employee-form-page__field'>
              <label
                htmlFor='phoneNumber'
                className='employee-form-page__label'
              >
                Teléfono *
              </label>
              <input
                type='tel'
                id='phoneNumber'
                value={formData.phoneNumber}
                onChange={e => handleInputChange('phoneNumber', e.target.value)}
                className={`employee-form-page__input ${
                  formData.phoneNumber
                    ? 'employee-form-page__input--filled'
                    : ''
                }`}
                placeholder='Ingresa el número de teléfono'
                required
              />
            </div>

            {/* Campo Fecha de Nacimiento */}
            <div className='employee-form-page__field'>
              <label htmlFor='birthDate' className='employee-form-page__label'>
                Fecha de Nacimiento *
              </label>
              <input
                type='date'
                id='birthDate'
                value={formData.birthDate}
                onChange={e => handleInputChange('birthDate', e.target.value)}
                className={`employee-form-page__input ${
                  formData.birthDate ? 'employee-form-page__input--filled' : ''
                }`}
                required
              />
            </div>

            {/* Campo Porcentaje */}
            <div className='employee-form-page__field'>
              <label htmlFor='percentage' className='employee-form-page__label'>
                Porcentaje *
              </label>
              <input
                type='number'
                id='percentage'
                value={formData.percentage}
                onChange={e => handleInputChange('percentage', e.target.value)}
                className={`employee-form-page__input ${
                  formData.percentage ? 'employee-form-page__input--filled' : ''
                }`}
                placeholder='Ingresa el porcentaje'
                min='0'
                max='100'
                required
              />
            </div>

            {/* Botones de acción */}
            <div className='employee-form-page__actions'>
              <button
                type='button'
                onClick={handleCancel}
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
