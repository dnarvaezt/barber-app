import { useEffect } from 'react'
import { useClientForm } from './client-form.hook'
import './client-form.scss'

export const ClientForm = () => {
  const {
    loading,
    isValidating,
    isValidClient,
    client,
    isEditing,
    formData,
    handleSubmit,
    handleCancel,
    handleInputChange,
  } = useClientForm()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el clientId
  if (isValidating) {
    return (
      <div className='client-form'>
        <div className='client-form__container'>
          <div className='client-form__loading'>
            <div className='client-form__loading-spinner'></div>
            <p className='client-form__loading-text'>Validando cliente...</p>
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
      <div className='client-form'>
        <div className='client-form__container'>
          <div className='client-form__loading'>
            <div className='client-form__loading-spinner'></div>
            <p className='client-form__loading-text'>Cargando cliente...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='client-form'>
      <div className='client-form__container'>
        <div className='client-form__header'>
          <h1 className='client-form__title'>
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
          <p className='client-form__subtitle'>
            {isEditing
              ? 'Actualiza la información del cliente'
              : 'Completa la información para crear un nuevo cliente'}
          </p>
        </div>

        <div className='client-form__form'>
          {/* Mensaje de éxito */}
          {client && (
            <div className='client-form__success-message'>
              <div className='client-form__success-icon'>✅</div>
              <p className='client-form__success-text'>
                {isEditing
                  ? '¡Cliente actualizado exitosamente!'
                  : '¡Cliente creado exitosamente!'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='client-form__form-content'>
            {/* Campo Nombre */}
            <div className='client-form__field'>
              <label htmlFor='name' className='client-form__label'>
                Nombre completo *
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`client-form__input ${
                  formData.name ? 'client-form__input--filled' : ''
                }`}
                placeholder='Ingresa el nombre completo'
                required
              />
            </div>

            {/* Campo Teléfono */}
            <div className='client-form__field'>
              <label htmlFor='phoneNumber' className='client-form__label'>
                Número de teléfono *
              </label>
              <input
                type='tel'
                id='phoneNumber'
                value={formData.phoneNumber}
                onChange={e => handleInputChange('phoneNumber', e.target.value)}
                className={`client-form__input ${
                  formData.phoneNumber ? 'client-form__input--filled' : ''
                }`}
                placeholder='Ej: +57 300 123 4567'
                required
              />
            </div>

            {/* Campo Fecha de Nacimiento */}
            <div className='client-form__field'>
              <label htmlFor='birthDate' className='client-form__label'>
                Fecha de nacimiento *
              </label>
              <input
                type='date'
                id='birthDate'
                value={formData.birthDate}
                onChange={e => handleInputChange('birthDate', e.target.value)}
                className={`client-form__input ${
                  formData.birthDate ? 'client-form__input--filled' : ''
                }`}
                required
              />
            </div>

            {/* Botones de acción */}
            <div className='client-form__actions'>
              <button
                type='button'
                onClick={handleCancel}
                className='client-form__button client-form__button--secondary'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading}
                className='client-form__button client-form__button--primary'
              >
                {loading && (
                  <div className='client-form__loading-spinner client-form__loading-spinner--small'></div>
                )}
                <span className='client-form__button-text'>
                  {isEditing ? 'Actualizar' : 'Crear'} Cliente
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
