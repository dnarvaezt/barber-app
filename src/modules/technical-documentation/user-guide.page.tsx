import { useEffect } from 'react'
import { useLayout } from '../../components'

export const UserGuidePage = () => {
  const { setHeaderTitle, setHeaderActions } = useLayout()

  useEffect(() => {
    setHeaderTitle('Guía de Usuario')

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setHeaderActions])

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg border border-gray-300 shadow-sm p-8 mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Guía de Usuario
          </h1>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Aprende a utilizar Filter Docs de manera efectiva con esta guía
            completa.
          </p>
        </div>

        <div className='bg-white rounded-lg border border-gray-300 shadow-sm p-8'>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-700 mb-6'>
              Esta guía te ayudará a utilizar Filter Docs de manera efectiva.
            </p>
            <div className='bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200'>
              <h2 className='text-xl font-semibold text-blue-800 mb-4'>
                Primeros Pasos
              </h2>
              <ol className='space-y-3 text-blue-700'>
                <li className='flex items-start'>
                  <span className='bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 border border-blue-300'>
                    1
                  </span>
                  <span>
                    Navega por la documentación usando el menú lateral
                  </span>
                </li>
                <li className='flex items-start'>
                  <span className='bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 border border-blue-300'>
                    2
                  </span>
                  <span>
                    Utiliza la barra de búsqueda para encontrar contenido
                    específico
                  </span>
                </li>
                <li className='flex items-start'>
                  <span className='bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 border border-blue-300'>
                    3
                  </span>
                  <span>Explora las diferentes secciones de documentación</span>
                </li>
              </ol>
            </div>
            <div className='bg-green-50 rounded-lg p-6 mb-6 border border-green-200'>
              <h2 className='text-xl font-semibold text-green-800 mb-4'>
                Características Principales
              </h2>
              <ul className='space-y-3 text-green-700'>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0 border border-green-600'></span>
                  <span>Navegación intuitiva con menú colapsible</span>
                </li>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0 border border-green-600'></span>
                  <span>Búsqueda rápida de contenido</span>
                </li>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0 border border-green-600'></span>
                  <span>Diseño responsive para todos los dispositivos</span>
                </li>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0 border border-green-600'></span>
                  <span>Documentación actualizada regularmente</span>
                </li>
              </ul>
            </div>
            <p className='text-gray-700'>
              Para obtener ayuda adicional, consulta la sección de API
              Documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
