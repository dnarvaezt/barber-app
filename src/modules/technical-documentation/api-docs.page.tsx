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
    <div className='container mx-auto px-6 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg border border-gray-300 shadow-sm p-8 mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            API Documentation
          </h1>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Documentación completa de la API de Filter Docs para
            desarrolladores.
          </p>
        </div>

        <div className='bg-white rounded-lg border border-gray-300 shadow-sm p-8'>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-700 mb-6'>
              Esta sección contiene la documentación completa de la API de
              Filter Docs.
            </p>
            <div className='bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                Endpoints Principales
              </h2>
              <ul className='space-y-3 text-gray-700'>
                <li className='flex items-start'>
                  <code className='bg-gray-200 px-3 py-1.5 rounded text-sm font-mono text-gray-800 mr-3 border border-gray-300'>
                    GET /api/docs
                  </code>
                  <span>Obtener documentación</span>
                </li>
                <li className='flex items-start'>
                  <code className='bg-gray-200 px-3 py-1.5 rounded text-sm font-mono text-gray-800 mr-3 border border-gray-300'>
                    POST /api/filter
                  </code>
                  <span>Aplicar filtros</span>
                </li>
                <li className='flex items-start'>
                  <code className='bg-gray-200 px-3 py-1.5 rounded text-sm font-mono text-gray-800 mr-3 border border-gray-300'>
                    GET /api/status
                  </code>
                  <span>Estado del servicio</span>
                </li>
              </ul>
            </div>
            <p className='text-gray-700'>
              La documentación completa estará disponible próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
