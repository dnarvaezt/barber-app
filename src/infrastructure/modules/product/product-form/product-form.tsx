import { useEffect, useState } from 'react'
import { categoryService } from '../../../../application/domain/category/category.provider'
import { useProductForm } from './product-form.hook'
import './product-form.scss'

export const ProductForm = () => {
  const {
    loading,
    isValidating,
    isValidProduct,
    isEditing,
    formData,
    showSuccessMessage,
    errors,
    handleSubmit,
    handleCancel,
    handleInputChange,
  } = useProductForm()

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

  // Mostrar loading mientras valida el productId
  if (isValidating) {
    return (
      <div className='product-form'>
        <div className='product-form__container'>
          <div className='product-form__loading'>
            <div className='product-form__loading-spinner'></div>
            <p className='product-form__loading-text'>Validando producto...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si el productId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidProduct && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <div className='product-form'>
        <div className='product-form__container'>
          <div className='product-form__loading'>
            <div className='product-form__loading-spinner'></div>
            <p className='product-form__loading-text'>Cargando producto...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='product-form'>
      <div className='product-form__container'>
        <div className='product-form__header'>
          <h1 className='product-form__title'>
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className='product-form__subtitle'>
            {isEditing
              ? 'Actualiza la información del producto'
              : 'Completa la información para crear un nuevo producto'}
          </p>
        </div>

        <div className='product-form__form'>
          {/* Mensaje de éxito */}
          {showSuccessMessage && (
            <div className='product-form__success-message'>
              <div className='product-form__success-icon'>✅</div>
              <p className='product-form__success-text'>
                {isEditing
                  ? '¡Producto actualizado exitosamente!'
                  : '¡Producto creado exitosamente!'}
              </p>
            </div>
          )}

          {/* Mensaje de error general */}
          {errors.general && (
            <div className='product-form__error-message'>
              <div className='product-form__error-icon'>❌</div>
              <p className='product-form__error-text'>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='product-form__form-content'>
            {/* Campo Nombre */}
            <div className='product-form__field'>
              <label htmlFor='name' className='product-form__label'>
                Nombre del producto *
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`product-form__input ${
                  formData.name ? 'product-form__input--filled' : ''
                }`}
                placeholder='Ingresa el nombre del producto'
                required
                minLength={2}
                maxLength={100}
              />
              <p className='product-form__help-text'>
                El nombre debe tener entre 2 y 100 caracteres
              </p>
            </div>

            {/* Campo Descripción */}
            <div className='product-form__field'>
              <label htmlFor='description' className='product-form__label'>
                Descripción del producto *
              </label>
              <textarea
                id='description'
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                className={`product-form__textarea ${
                  formData.description ? 'product-form__textarea--filled' : ''
                }`}
                placeholder='Describe el producto detalladamente'
                required
                minLength={10}
                maxLength={500}
                rows={4}
              />
              <p className='product-form__help-text'>
                La descripción debe tener entre 10 y 500 caracteres
              </p>
            </div>

            {/* Campo Categoría */}
            <div className='product-form__field'>
              <label htmlFor='category' className='product-form__label'>
                Categoría del producto *
              </label>
              <input
                type='text'
                id='category'
                value={formData.category}
                onChange={e => handleInputChange('category', e.target.value)}
                className={`product-form__input ${
                  formData.category ? 'product-form__input--filled' : ''
                }`}
                placeholder='Ej: Cuidado Personal, Accesorios, etc.'
                required
                minLength={2}
                maxLength={50}
              />
              <p className='product-form__help-text'>
                La categoría debe tener entre 2 y 50 caracteres
              </p>
            </div>

            {/* Sección de Precios */}
            <div className='product-form__price-section'>
              {/* Campo Precio de Costo */}
              <div className='product-form__price-field'>
                <label
                  htmlFor='costPrice'
                  className='product-form__price-label'
                >
                  Precio de Costo *
                </label>
                <input
                  type='number'
                  id='costPrice'
                  value={formData.costPrice}
                  onChange={e => handleInputChange('costPrice', e.target.value)}
                  className={`product-form__price-input ${
                    formData.costPrice
                      ? 'product-form__price-input--filled'
                      : ''
                  }`}
                  placeholder='Ej: 15000'
                  min='0'
                  max='999999.99'
                  step='0.01'
                  required
                />
                <p className='product-form__price-help'>
                  Ingresa el precio de costo en pesos colombianos
                </p>
              </div>

              {/* Campo Precio de Venta */}
              <div className='product-form__price-field'>
                <label
                  htmlFor='salePrice'
                  className='product-form__price-label'
                >
                  Precio de Venta *
                </label>
                <input
                  type='number'
                  id='salePrice'
                  value={formData.salePrice}
                  onChange={e => handleInputChange('salePrice', e.target.value)}
                  className={`product-form__price-input ${
                    formData.salePrice
                      ? 'product-form__price-input--filled'
                      : ''
                  }`}
                  placeholder='Ej: 25000'
                  min='0'
                  max='999999.99'
                  step='0.01'
                  required
                />
                <p className='product-form__price-help'>
                  Ingresa el precio de venta en pesos colombianos
                </p>
              </div>
            </div>

            {/* Campo Categoría ID */}
            <div className='product-form__field'>
              <label htmlFor='categoryId' className='product-form__label'>
                Categoría ID *
              </label>
              <select
                id='categoryId'
                value={formData.categoryId}
                onChange={e => handleInputChange('categoryId', e.target.value)}
                className={`product-form__select ${
                  formData.categoryId ? 'product-form__select--filled' : ''
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
              <p className='product-form__help-text'>
                Selecciona la categoría a la que pertenece este producto
              </p>
            </div>

            {/* Botones de acción */}
            <div className='product-form__actions'>
              <button
                type='button'
                onClick={handleCancel}
                className='product-form__button product-form__button--secondary'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading}
                className='product-form__button product-form__button--primary'
              >
                {loading && (
                  <div className='product-form__loading-spinner product-form__loading-spinner--small'></div>
                )}
                <span className='product-form__button-text'>
                  {isEditing ? 'Actualizar' : 'Crear'} Producto
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
