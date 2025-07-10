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
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6'>
            Guía de Usuario
          </h1>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-4'>
              Esta guía te ayudará a utilizar Filter Docs de manera efectiva.
            </p>
            <div className='bg-blue-50 rounded-lg p-4 mb-6'>
              <h2 className='text-xl font-semibold text-blue-800 mb-3'>
                Primeros Pasos
              </h2>
              <ol className='space-y-2 text-blue-700'>
                <li>1. Navega por la documentación usando el menú lateral</li>
                <li>
                  2. Utiliza la barra de búsqueda para encontrar contenido
                  específico
                </li>
                <li>3. Explora las diferentes secciones de documentación</li>
              </ol>
            </div>
            <div className='bg-green-50 rounded-lg p-4 mb-6'>
              <h2 className='text-xl font-semibold text-green-800 mb-3'>
                Características Principales
              </h2>
              <ul className='space-y-2 text-green-700'>
                <li>• Navegación intuitiva con menú colapsible</li>
                <li>• Búsqueda rápida de contenido</li>
                <li>• Diseño responsive para todos los dispositivos</li>
                <li>• Documentación actualizada regularmente</li>
              </ul>
            </div>
            <p className='text-gray-600'>
              Para obtener ayuda adicional, consulta la sección de API
              Documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
