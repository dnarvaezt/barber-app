import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductDetail } from './product-detail.hook'
import './product-detail.scss'

export const ProductDetail = () => {
  const {
    loading,
    isValidating,
    isValidProduct,
    product,
    error,
    handleEdit,
    handleBack,
    formatDate,
    formatCurrency,
  } = useProductDetail()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el productId
  if (isValidating) {
    return (
      <div className='product-detail-page'>
        <div className='product-detail-page__content'>
          <div className='product-detail-page__loading'>
            <div className='product-detail-page__loading-spinner'></div>
            <p>Validando producto...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si el productId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidProduct) {
    return null
  }

  if (loading) {
    return (
      <div className='product-detail-page'>
        <div className='product-detail-page__content'>
          <div className='product-detail-page__loading'>
            <div className='product-detail-page__loading-spinner'></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className='product-detail-page'>
        <div className='product-detail-page__content'>
          <div className='product-detail-page__error'>
            <div className='product-detail-page__error-icon'>⚠️</div>
            <h3 className='product-detail-page__error-title'>Error</h3>
            <p className='product-detail-page__error-message'>
              {error || 'Producto no encontrado'}
            </p>
            <button
              onClick={handleBack}
              className='product-detail-page__button product-detail-page__button--primary'
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='product-detail-page'>
      <div className='product-detail-page__content'>
        <div className='product-detail-page__card'>
          {/* Información principal */}
          <div className='product-detail-page__section'>
            <h2 className='product-detail-page__section-title'>
              Información del Producto
            </h2>
            <div className='product-detail-page__info-grid'>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>Nombre:</span>
                <span className='product-detail-page__info-value'>
                  {product.name}
                </span>
              </div>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  Categoría:
                </span>
                <span className='product-detail-page__info-value'>
                  {product.category}
                </span>
              </div>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  Precio de Costo:
                </span>
                <span className='product-detail-page__info-value product-detail-page__info-value--cost-price'>
                  {formatCurrency(product.costPrice)}
                </span>
              </div>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  Precio de Venta:
                </span>
                <span className='product-detail-page__info-value product-detail-page__info-value--price'>
                  {formatCurrency(product.salePrice)}
                </span>
              </div>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  ID de Categoría:
                </span>
                <span className='product-detail-page__info-value product-detail-page__info-value--mono'>
                  {product.categoryId}
                </span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className='product-detail-page__section'>
            <h2 className='product-detail-page__section-title'>
              Descripción del Producto
            </h2>
            <div className='product-detail-page__info-grid'>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  Descripción:
                </span>
                <span className='product-detail-page__info-value product-detail-page__info-value--description'>
                  {product.description}
                </span>
              </div>
            </div>
          </div>

          {/* Información de auditoría */}
          <div className='product-detail-page__section'>
            <h2 className='product-detail-page__section-title'>
              Información del Sistema
            </h2>
            <div className='product-detail-page__info-grid'>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  ID del Producto:
                </span>
                <span className='product-detail-page__info-value product-detail-page__info-value--mono'>
                  {product.id}
                </span>
              </div>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  Fecha de Creación:
                </span>
                <span className='product-detail-page__info-value'>
                  {formatDate(product.createdAt)}
                </span>
              </div>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  Última Actualización:
                </span>
                <span className='product-detail-page__info-value'>
                  {formatDate(product.updatedAt)}
                </span>
              </div>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  Creado por:
                </span>
                <span className='product-detail-page__info-value'>
                  {product.createdBy}
                </span>
              </div>
              <div className='product-detail-page__info-item'>
                <span className='product-detail-page__info-label'>
                  Actualizado por:
                </span>
                <span className='product-detail-page__info-value'>
                  {product.updatedBy}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className='product-detail-page__section'>
            <h2 className='product-detail-page__section-title'>Acciones</h2>
            <div className='product-detail-page__actions'>
              <button
                onClick={handleEdit}
                className='product-detail-page__action-button product-detail-page__action-button--edit'
              >
                ✏️ Editar Producto
              </button>
              <Link
                to={`/stock/${product.id}`}
                className='product-detail-page__action-button product-detail-page__action-button--primary'
              >
                📦 Ver inventario
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
