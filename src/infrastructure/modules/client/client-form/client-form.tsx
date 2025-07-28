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
        <div className='client-form-page__header'>
          <h1 className='client-form-page__title'>
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
        </div>

        <div className='client-form-page__form-container'>
          <form onSubmit={handleSubmit} className='client-form-page__form'>
            {/* Mensaje de éxito */}
            {client && (
              <div className='client-form-page__success-message'>
                <div className='client-form-page__success-icon'>✅</div>
                <p>
                  {isEditing
                    ? '¡Cliente actualizado exitosamente!'
                    : '¡Cliente creado exitosamente!'}
                </p>
              </div>
            )}

            {/* Campo Nombre */}
            <div className='client-form-page__field'>
              <label htmlFor='name' className='client-form-page__label'>
                Nombre *
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`client-form-page__input ${
                  formData.name ? 'client-form-page__input--filled' : ''
                }`}
                placeholder='Ingresa el nombre del cliente'
                required
              />
            </div>

            {/* Campo Teléfono */}
            <div className='client-form-page__field'>
              <label htmlFor='phoneNumber' className='client-form-page__label'>
                Teléfono *
              </label>
              <input
                type='tel'
                id='phoneNumber'
                value={formData.phoneNumber}
                onChange={e => handleInputChange('phoneNumber', e.target.value)}
                className={`client-form-page__input ${
                  formData.phoneNumber ? 'client-form-page__input--filled' : ''
                }`}
                placeholder='Ingresa el número de teléfono'
                required
              />
            </div>

            {/* Campo Fecha de Nacimiento */}
            <div className='client-form-page__field'>
              <label htmlFor='birthDate' className='client-form-page__label'>
                Fecha de Nacimiento *
              </label>
              <input
                type='date'
                id='birthDate'
                value={formData.birthDate}
                onChange={e => handleInputChange('birthDate', e.target.value)}
                className={`client-form-page__input ${
                  formData.birthDate ? 'client-form-page__input--filled' : ''
                }`}
                required
              />
            </div>

            {/* Botones de acción */}
            <div className='client-form-page__actions'>
              <button
                type='button'
                onClick={handleCancel}
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
