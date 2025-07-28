import { useEffect } from 'react'
import { useClientDetail } from './client-detail.hook'
import './client-detail.scss'

export const ClientDetail = () => {
  const {
    loading,
    isValidating,
    isValidClient,
    client,
    error,
    handleEdit,
    handleBack,
    formatDate,
    formatPhone,
    getAge,
    getBirthMonth,
  } = useClientDetail()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el clientId
  if (isValidating) {
    return (
      <div className='client-detail-page'>
        <div className='client-detail-page__content'>
          <div className='client-detail-page__loading'>
            <div className='client-detail-page__loading-spinner'></div>
            <p>Validando cliente...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si el clientId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidClient) {
    return null
  }

  if (loading) {
    return (
      <div className='client-detail-page'>
        <div className='client-detail-page__content'>
          <div className='client-detail-page__loading'>
            <div className='client-detail-page__loading-spinner'></div>
            <p>Cargando cliente...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className='client-detail-page'>
        <div className='client-detail-page__content'>
          <div className='client-detail-page__error'>
            <div className='client-detail-page__error-icon'>⚠️</div>
            <h3 className='client-detail-page__error-title'>Error</h3>
            <p className='client-detail-page__error-message'>
              {error || 'Cliente no encontrado'}
            </p>
            <button
              onClick={handleBack}
              className='client-detail-page__button client-detail-page__button--primary'
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='client-detail-page'>
      <div className='client-detail-page__content'>
        <div className='client-detail-page__card'>
          {/* Información principal */}
          <div className='client-detail-page__section'>
            <h2 className='client-detail-page__section-title'>
              Información Personal
            </h2>
            <div className='client-detail-page__info-grid'>
              <div className='client-detail-page__info-item'>
                <span className='client-detail-page__info-label'>Nombre:</span>
                <span className='client-detail-page__info-value'>
                  {client.name}
                </span>
              </div>
              <div className='client-detail-page__info-item'>
                <span className='client-detail-page__info-label'>
                  Teléfono:
                </span>
                <span className='client-detail-page__info-value'>
                  <a
                    href={`tel:${client.phoneNumber}`}
                    className='client-detail-page__phone-link'
                  >
                    {formatPhone(client.phoneNumber)}
                  </a>
                </span>
              </div>
              <div className='client-detail-page__info-item'>
                <span className='client-detail-page__info-label'>
                  Fecha de Nacimiento:
                </span>
                <span className='client-detail-page__info-value'>
                  {formatDate(client.birthDate)} ({getAge(client.birthDate)}{' '}
                  años)
                </span>
              </div>
              <div className='client-detail-page__info-item'>
                <span className='client-detail-page__info-label'>
                  Mes de Cumpleaños:
                </span>
                <span className='client-detail-page__info-value'>
                  {getBirthMonth(client.birthDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Información de auditoría */}
          <div className='client-detail-page__section'>
            <h2 className='client-detail-page__section-title'>
              Información del Sistema
            </h2>
            <div className='client-detail-page__info-grid'>
              <div className='client-detail-page__info-item'>
                <span className='client-detail-page__info-label'>
                  ID del Cliente:
                </span>
                <span className='client-detail-page__info-value client-detail-page__info-value--mono'>
                  {client.id}
                </span>
              </div>
              <div className='client-detail-page__info-item'>
                <span className='client-detail-page__info-label'>
                  Fecha de Creación:
                </span>
                <span className='client-detail-page__info-value'>
                  {formatDate(client.createdAt)}
                </span>
              </div>
              <div className='client-detail-page__info-item'>
                <span className='client-detail-page__info-label'>
                  Última Actualización:
                </span>
                <span className='client-detail-page__info-value'>
                  {formatDate(client.updatedAt)}
                </span>
              </div>
              <div className='client-detail-page__info-item'>
                <span className='client-detail-page__info-label'>
                  Creado por:
                </span>
                <span className='client-detail-page__info-value'>
                  {client.createdBy}
                </span>
              </div>
              <div className='client-detail-page__info-item'>
                <span className='client-detail-page__info-label'>
                  Actualizado por:
                </span>
                <span className='client-detail-page__info-value'>
                  {client.updatedBy}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className='client-detail-page__section'>
            <h2 className='client-detail-page__section-title'>Acciones</h2>
            <div className='client-detail-page__actions'>
              <button
                onClick={handleEdit}
                className='client-detail-page__action-button client-detail-page__action-button--edit'
              >
                ✏️ Editar Cliente
              </button>
              <button
                onClick={() =>
                  window.open(`tel:${client.phoneNumber}`, '_self')
                }
                className='client-detail-page__action-button client-detail-page__action-button--call'
              >
                📞 Llamar
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${client.phoneNumber.replace('+', '')}`,
                    '_blank'
                  )
                }
                className='client-detail-page__action-button client-detail-page__action-button--whatsapp'
              >
                💬 WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
