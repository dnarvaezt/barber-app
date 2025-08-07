import { useEffect } from 'react'
import { useActivityDetail } from './activity-detail.hook'
import './activity-detail.scss'

export const ActivityDetail = () => {
  const {
    loading,
    isValidating,
    isValidActivity,
    activity,
    error,
    handleEdit,
    handleBack,
    formatDate,
    formatCurrency,
  } = useActivityDetail()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el activityId
  if (isValidating) {
    return (
      <div className='activity-detail-page'>
        <div className='activity-detail-page__content'>
          <div className='activity-detail-page__loading'>
            <div className='activity-detail-page__loading-spinner'></div>
            <p>Validando actividad...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si el activityId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidActivity) {
    return null
  }

  if (loading) {
    return (
      <div className='activity-detail-page'>
        <div className='activity-detail-page__content'>
          <div className='activity-detail-page__loading'>
            <div className='activity-detail-page__loading-spinner'></div>
            <p>Cargando actividad...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className='activity-detail-page'>
        <div className='activity-detail-page__content'>
          <div className='activity-detail-page__error'>
            <div className='activity-detail-page__error-icon'>⚠️</div>
            <h3 className='activity-detail-page__error-title'>Error</h3>
            <p className='activity-detail-page__error-message'>
              {error || 'Actividad no encontrada'}
            </p>
            <button
              onClick={handleBack}
              className='activity-detail-page__button activity-detail-page__button--primary'
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='activity-detail-page'>
      <div className='activity-detail-page__content'>
        <div className='activity-detail-page__card'>
          {/* Información principal */}
          <div className='activity-detail-page__section'>
            <h2 className='activity-detail-page__section-title'>
              Información de la Actividad
            </h2>
            <div className='activity-detail-page__info-grid'>
              <div className='activity-detail-page__info-item'>
                <span className='activity-detail-page__info-label'>
                  Nombre:
                </span>
                <span className='activity-detail-page__info-value'>
                  {activity.name}
                </span>
              </div>
              <div className='activity-detail-page__info-item'>
                <span className='activity-detail-page__info-label'>
                  Precio:
                </span>
                <span className='activity-detail-page__info-value activity-detail-page__info-value--price'>
                  {formatCurrency(activity.price)}
                </span>
              </div>
              <div className='activity-detail-page__info-item'>
                <span className='activity-detail-page__info-label'>
                  ID de Categoría:
                </span>
                <span className='activity-detail-page__info-value activity-detail-page__info-value--mono'>
                  {activity.categoryId}
                </span>
              </div>
            </div>
          </div>

          {/* Información de auditoría */}
          <div className='activity-detail-page__section'>
            <h2 className='activity-detail-page__section-title'>
              Información del Sistema
            </h2>
            <div className='activity-detail-page__info-grid'>
              <div className='activity-detail-page__info-item'>
                <span className='activity-detail-page__info-label'>
                  ID de la Actividad:
                </span>
                <span className='activity-detail-page__info-value activity-detail-page__info-value--mono'>
                  {activity.id}
                </span>
              </div>
              <div className='activity-detail-page__info-item'>
                <span className='activity-detail-page__info-label'>
                  Fecha de Creación:
                </span>
                <span className='activity-detail-page__info-value'>
                  {formatDate(activity.createdAt)}
                </span>
              </div>
              <div className='activity-detail-page__info-item'>
                <span className='activity-detail-page__info-label'>
                  Última Actualización:
                </span>
                <span className='activity-detail-page__info-value'>
                  {formatDate(activity.updatedAt)}
                </span>
              </div>
              <div className='activity-detail-page__info-item'>
                <span className='activity-detail-page__info-label'>
                  Creado por:
                </span>
                <span className='activity-detail-page__info-value'>
                  {activity.createdBy}
                </span>
              </div>
              <div className='activity-detail-page__info-item'>
                <span className='activity-detail-page__info-label'>
                  Actualizado por:
                </span>
                <span className='activity-detail-page__info-value'>
                  {activity.updatedBy}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className='activity-detail-page__section'>
            <h2 className='activity-detail-page__section-title'>Acciones</h2>
            <div className='activity-detail-page__actions'>
              <button
                onClick={handleEdit}
                className='activity-detail-page__action-button activity-detail-page__action-button--edit'
              >
                ✏️ Editar Actividad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
