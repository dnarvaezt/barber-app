import { useEffect } from 'react'
import { useCategoryDetail } from './category-detail.hook'
import './category-detail.scss'

export const CategoryDetail = () => {
  const {
    loading,
    isValidating,
    isValidCategory,
    category,
    error,
    handleEdit,
    handleBack,
    formatDate,
  } = useCategoryDetail()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el categoryId
  if (isValidating) {
    return (
      <div className='category-detail-page'>
        <div className='category-detail-page__content'>
          <div className='category-detail-page__loading'>
            <div className='category-detail-page__loading-spinner'></div>
            <p>Validando categoría...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si el categoryId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidCategory) {
    return null
  }

  if (loading) {
    return (
      <div className='category-detail-page'>
        <div className='category-detail-page__content'>
          <div className='category-detail-page__loading'>
            <div className='category-detail-page__loading-spinner'></div>
            <p>Cargando categoría...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className='category-detail-page'>
        <div className='category-detail-page__content'>
          <div className='category-detail-page__error'>
            <div className='category-detail-page__error-icon'>⚠️</div>
            <h3 className='category-detail-page__error-title'>Error</h3>
            <p className='category-detail-page__error-message'>
              {error || 'Categoría no encontrada'}
            </p>
            <button
              onClick={handleBack}
              className='category-detail-page__button category-detail-page__button--primary'
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='category-detail-page'>
      <div className='category-detail-page__content'>
        <div className='category-detail-page__card'>
          {/* Información principal */}
          <div className='category-detail-page__section'>
            <h2 className='category-detail-page__section-title'>
              Información de la Categoría
            </h2>
            <div className='category-detail-page__info-grid'>
              <div className='category-detail-page__info-item'>
                <span className='category-detail-page__info-label'>
                  Nombre:
                </span>
                <span className='category-detail-page__info-value'>
                  {category.name}
                </span>
              </div>
            </div>
          </div>

          {/* Información de auditoría */}
          <div className='category-detail-page__section'>
            <h2 className='category-detail-page__section-title'>
              Información del Sistema
            </h2>
            <div className='category-detail-page__info-grid'>
              <div className='category-detail-page__info-item'>
                <span className='category-detail-page__info-label'>
                  ID de la Categoría:
                </span>
                <span className='category-detail-page__info-value category-detail-page__info-value--mono'>
                  {category.id}
                </span>
              </div>
              <div className='category-detail-page__info-item'>
                <span className='category-detail-page__info-label'>
                  Fecha de Creación:
                </span>
                <span className='category-detail-page__info-value'>
                  {formatDate(category.createdAt)}
                </span>
              </div>
              <div className='category-detail-page__info-item'>
                <span className='category-detail-page__info-label'>
                  Última Actualización:
                </span>
                <span className='category-detail-page__info-value'>
                  {formatDate(category.updatedAt)}
                </span>
              </div>
              <div className='category-detail-page__info-item'>
                <span className='category-detail-page__info-label'>
                  Creado por:
                </span>
                <span className='category-detail-page__info-value'>
                  {category.createdBy}
                </span>
              </div>
              <div className='category-detail-page__info-item'>
                <span className='category-detail-page__info-label'>
                  Actualizado por:
                </span>
                <span className='category-detail-page__info-value'>
                  {category.updatedBy}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className='category-detail-page__section'>
            <h2 className='category-detail-page__section-title'>Acciones</h2>
            <div className='category-detail-page__actions'>
              <button
                onClick={handleEdit}
                className='category-detail-page__action-button category-detail-page__action-button--edit'
              >
                ✏️ Editar Categoría
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
