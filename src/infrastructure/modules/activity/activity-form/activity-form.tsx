import { useEffect, useState } from 'react'
import { categoryService } from '../../../../application/domain/category/category.provider'
import { useActivityForm } from './activity-form.hook'
import './activity-form.scss'

export const ActivityForm = () => {
  const {
    loading,
    isValidating,
    isValidActivity,
    isEditing,
    formData,
    showSuccessMessage,
    errors,
    handleSubmit,
    handleCancel,
    handleInputChange,
  } = useActivityForm()

  const [categories, setCategories] = useState<any[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Cargar categorías para el select
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true)
      try {
        const response = await categoryService.getAllCategories({
          page: 1,
          limit: 100,
        })
        setCategories(response.data)
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Mostrar loading mientras valida el activityId
  if (isValidating) {
    return (
      <div className='activity-form'>
        <div className='activity-form__container'>
          <div className='activity-form__loading'>
            <div className='activity-form__loading-spinner'></div>
            <p className='activity-form__loading-text'>
              Validando actividad...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Si el activityId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidActivity && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <div className='activity-form'>
        <div className='activity-form__container'>
          <div className='activity-form__loading'>
            <div className='activity-form__loading-spinner'></div>
            <p className='activity-form__loading-text'>Cargando actividad...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='activity-form'>
      <div className='activity-form__container'>
        <div className='activity-form__header'>
          <h1 className='activity-form__title'>
            {isEditing ? 'Editar Actividad' : 'Nueva Actividad'}
          </h1>
          <p className='activity-form__subtitle'>
            {isEditing
              ? 'Actualiza la información de la actividad'
              : 'Completa la información para crear una nueva actividad'}
          </p>
        </div>

        <div className='activity-form__form'>
          {/* Mensaje de éxito */}
          {showSuccessMessage && (
            <div className='activity-form__success-message'>
              <div className='activity-form__success-icon'>✅</div>
              <p className='activity-form__success-text'>
                {isEditing
                  ? '¡Actividad actualizada exitosamente!'
                  : '¡Actividad creada exitosamente!'}
              </p>
            </div>
          )}

          {/* Mensaje de error general */}
          {errors.general && (
            <div className='activity-form__error-message'>
              <div className='activity-form__error-icon'>❌</div>
              <p className='activity-form__error-text'>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='activity-form__form-content'>
            {/* Campo Nombre */}
            <div className='activity-form__field'>
              <label htmlFor='name' className='activity-form__label'>
                Nombre de la actividad *
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`activity-form__input ${
                  formData.name ? 'activity-form__input--filled' : ''
                }`}
                placeholder='Ingresa el nombre de la actividad'
                required
                minLength={2}
                maxLength={100}
              />
              <p className='activity-form__help-text'>
                El nombre debe tener entre 2 y 100 caracteres
              </p>
            </div>

            {/* Campo Precio */}
            <div className='activity-form__field'>
              <label htmlFor='price' className='activity-form__label'>
                Precio *
              </label>
              <input
                type='number'
                id='price'
                value={formData.price}
                onChange={e => handleInputChange('price', e.target.value)}
                className={`activity-form__input ${
                  formData.price ? 'activity-form__input--filled' : ''
                }`}
                placeholder='Ej: 25000'
                min='0'
                max='999999.99'
                step='0.01'
                required
              />
              <p className='activity-form__help-text'>
                Ingresa el precio en pesos colombianos (0 - 999,999.99)
              </p>
            </div>

            {/* Campo Categoría */}
            <div className='activity-form__field'>
              <label htmlFor='categoryId' className='activity-form__label'>
                Categoría *
              </label>
              <select
                id='categoryId'
                value={formData.categoryId}
                onChange={e => handleInputChange('categoryId', e.target.value)}
                className={`activity-form__select ${
                  formData.categoryId ? 'activity-form__select--filled' : ''
                }`}
                required
                disabled={loadingCategories}
              >
                <option value=''>Selecciona una categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className='activity-form__help-text'>
                Selecciona la categoría a la que pertenece esta actividad
              </p>
            </div>

            {/* Botones de acción */}
            <div className='activity-form__actions'>
              <button
                type='button'
                onClick={handleCancel}
                className='activity-form__button activity-form__button--secondary'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading}
                className='activity-form__button activity-form__button--primary'
              >
                {loading && (
                  <div className='activity-form__loading-spinner activity-form__loading-spinner--small'></div>
                )}
                <span className='activity-form__button-text'>
                  {isEditing ? 'Actualizar' : 'Crear'} Actividad
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
