import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RouteIds, useRoutes } from '../../routes'
import './not-found.scss'

export const NotFoundPage = () => {
  const navigate = useNavigate()
  const { getRoutePathById } = useRoutes()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  return (
    <div className='not-found-page'>
      <div className='not-found-page__content'>
        <div className='not-found-page__error'>
          <div className='not-found-page__error-icon'>404</div>
          <h1 className='not-found-page__error-title'>Página No Encontrada</h1>
          <p className='not-found-page__error-message'>
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <div className='not-found-page__actions'>
            <button
              onClick={() => window.history.back()}
              className='not-found-page__button not-found-page__button--secondary'
            >
              ← Volver
            </button>
            <button
              onClick={() => {
                const clientListPath = getRoutePathById(RouteIds.CLIENT)
                if (clientListPath) {
                  navigate(clientListPath)
                }
              }}
              className='not-found-page__button not-found-page__button--primary'
            >
              Ir a Clientes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
