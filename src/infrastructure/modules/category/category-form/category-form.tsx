import { useEffect } from 'react'
import { useCategoryForm } from './category-form.hook'
import './category-form.scss'

export const CategoryForm = () => {
  const {
    loading,
    isValidating,
    isValidCategory,
    isEditing,
    formData,
    showSuccessMessage,
    errors,
    handleSubmit,
    handleCancel,
    handleInputChange,
  } = useCategoryForm()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el categoryId
  if (isValidating) {
    return (
      <div className='category-form'>
        <div className='category-form__container'>
          <div className='category-form__loading'>
            <div className='category-form__loading-spinner'></div>
            <p className='category-form__loading-text'>
              Validando categoría...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Si el categoryId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidCategory && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <div className='category-form'>
        <div className='category-form__container'>
          <div className='category-form__loading'>
            <div className='category-form__loading-spinner'></div>
            <p className='category-form__loading-text'>Cargando categoría...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='category-form'>
      <div className='category-form__container'>
        <div className='category-form__header'>
          <h1 className='category-form__title'>
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </h1>
          <p className='category-form__subtitle'>
            {isEditing
              ? 'Actualiza la información de la categoría'
              : 'Completa la información para crear una nueva categoría'}
          </p>
        </div>

        <div className='category-form__form'>
          {/* Mensaje de éxito */}
          {showSuccessMessage && (
            <div className='category-form__success-message'>
              <div className='category-form__success-icon'>✅</div>
              <p className='category-form__success-text'>
                {isEditing
                  ? '¡Categoría actualizada exitosamente!'
                  : '¡Categoría creada exitosamente!'}
              </p>
            </div>
          )}

          {/* Mensaje de error general */}
          {errors.general && (
            <div className='category-form__error-message'>
              <div className='category-form__error-icon'>❌</div>
              <p className='category-form__error-text'>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='category-form__form-content'>
            {/* Campo Nombre */}
            <div className='category-form__field'>
              <label htmlFor='name' className='category-form__label'>
                Nombre de la categoría *
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`category-form__input ${
                  formData.name ? 'category-form__input--filled' : ''
                }`}
                placeholder='Ingresa el nombre de la categoría'
                required
                minLength={2}
                maxLength={50}
              />
              <p className='category-form__help-text'>
                El nombre debe tener entre 2 y 50 caracteres
              </p>
            </div>

            {/* Botones de acción */}
            <div className='category-form__actions'>
              <button
                type='button'
                onClick={handleCancel}
                className='category-form__button category-form__button--secondary'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading}
                className='category-form__button category-form__button--primary'
              >
                {loading && (
                  <div className='category-form__loading-spinner category-form__loading-spinner--small'></div>
                )}
                <span className='category-form__button-text'>
                  {isEditing ? 'Actualizar' : 'Crear'} Categoría
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
