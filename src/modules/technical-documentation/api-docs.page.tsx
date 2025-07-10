import { useEffect } from 'react'
import { useLayout } from '../../components'

export const ApiDocsPage = () => {
  const { setHeaderTitle, setHeaderActions } = useLayout()

  useEffect(() => {
    setHeaderTitle('API Documentation')

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setHeaderActions])

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6'>
            API Documentation
          </h1>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-4'>
              Esta sección contiene la documentación completa de la API de
              Filter Docs.
            </p>
            <div className='bg-gray-50 rounded-lg p-4 mb-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-3'>
                Endpoints Principales
              </h2>
              <ul className='space-y-2 text-gray-700'>
                <li>
                  <strong>GET /api/docs</strong> - Obtener documentación
                </li>
                <li>
                  <strong>POST /api/filter</strong> - Aplicar filtros
                </li>
                <li>
                  <strong>GET /api/status</strong> - Estado del servicio
                </li>
              </ul>
            </div>
            <p className='text-gray-600'>
              La documentación completa estará disponible próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
