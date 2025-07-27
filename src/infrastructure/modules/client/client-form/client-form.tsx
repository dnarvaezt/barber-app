import { useEffect } from 'react'
import { useLayout } from '../../../components'
import { useClientForm } from './client-form.hook'
import './client-form.scss'

export const ClientFormPage = () => {
  const { headerCommands } = useLayout()
  const {
    loading,
    isValidating,
    isValidClient,
    isSuccess,
    formData,
    errors,
    isEditing,
    handleSubmit,
    handleInputChange,
    handleCancel,
  } = useClientForm()

  useEffect(() => {
    headerCommands.setTitle(isEditing ? 'Editar Cliente' : 'Nuevo Cliente')
    headerCommands.setActions(undefined)
    return () => {
      headerCommands.setActions(undefined)
    }
  }, [headerCommands, isEditing])

  // Mostrar loading mientras valida el clientId
  if (isValidating) {
    return (
      <div className='client-form-page'>
        <div className='client-form-page__content'>
          <div className='client-form-page__loading'>
            <div className='client-form-page__loading-spinner'></div>
            <p>Validando cliente...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si el clientId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidClient && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <div className='client-form-page'>
        <div className='client-form-page__content'>
          <div className='client-form-page__loading'>
            <div className='client-form-page__loading-spinner'></div>
            <p>Cargando cliente...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='client-form-page'>
      <div className='client-form-page__content'>
        <div className='client-form-page__form-container'>
          <form onSubmit={handleSubmit} className='client-form-page__form'>
            {/* Mensaje de éxito */}
            {isSuccess && (
              <div className='client-form-page__success-message'>
                <div className='client-form-page__success-icon'>✅</div>
                <p>
                  {isEditing
                    ? '¡Cliente actualizado exitosamente!'
                    : '¡Cliente creado exitosamente!'}
                </p>
                <p className='client-form-page__success-subtitle'>
                  Redirigiendo al detalle del cliente...
                </p>
              </div>
            )}

            {/* Error general */}
            {errors.general && (
              <div className='client-form-page__error-message'>
                {errors.general}
              </div>
            )}

            {/* Nombre */}
            <div className='client-form-page__form-group'>
              <label htmlFor='name' className='client-form-page__label'>
                Nombre Completo *
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`client-form-page__input ${
                  errors.name ? 'client-form-page__input--error' : ''
                }`}
                placeholder='Ingrese el nombre completo'
                disabled={loading}
              />
              {errors.name && (
                <p className='client-form-page__error-text'>{errors.name}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className='client-form-page__form-group'>
              <label htmlFor='phoneNumber' className='client-form-page__label'>
                Número de Teléfono *
              </label>
              <input
                type='tel'
                id='phoneNumber'
                value={formData.phoneNumber}
                onChange={e => handleInputChange('phoneNumber', e.target.value)}
                className={`client-form-page__input ${
                  errors.phoneNumber ? 'client-form-page__input--error' : ''
                }`}
                placeholder='+573001234567'
                disabled={loading}
              />
              {errors.phoneNumber && (
                <p className='client-form-page__error-text'>
                  {errors.phoneNumber}
                </p>
              )}
              <p className='client-form-page__help-text'>
                Formato: +57 seguido de 10 dígitos
              </p>
            </div>

            {/* Fecha de Cumpleaños */}
            <div className='client-form-page__form-group'>
              <label htmlFor='birthDate' className='client-form-page__label'>
                Fecha de Cumpleaños *
              </label>
              <input
                type='date'
                id='birthDate'
                value={formData.birthDate}
                onChange={e => handleInputChange('birthDate', e.target.value)}
                className={`client-form-page__input ${
                  errors.birthDate ? 'client-form-page__input--error' : ''
                }`}
                disabled={loading}
              />
              {errors.birthDate && (
                <p className='client-form-page__error-text'>
                  {errors.birthDate}
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div className='client-form-page__actions'>
              <button
                type='button'
                onClick={handleCancel}
                disabled={loading}
                className='client-form-page__button client-form-page__button--secondary'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading}
                className='client-form-page__button client-form-page__button--primary'
              >
                {loading && (
                  <div className='client-form-page__loading-spinner client-form-page__loading-spinner--small'></div>
                )}
                {isEditing ? 'Actualizar' : 'Crear'} Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
