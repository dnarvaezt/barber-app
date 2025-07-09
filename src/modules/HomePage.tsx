import { useEffect } from 'react'
import { Icon, useLayout } from '../components'

const HomePage = () => {
  const { setHeaderTitle, setHeaderActions, setOverlayVisible } = useLayout()

  useEffect(() => {
    setHeaderTitle('Información')

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setOverlayVisible])

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Bienvenido a Filter Docs
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Documentación completa y ejemplos para implementar la librería de
            filtrado avanzado
          </p>
          <div className='flex justify-center space-x-4'>
            <button className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'>
              Comenzar
            </button>
            <button className='border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors'>
              Ver Ejemplos
            </button>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-8 mb-12'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
              <Icon name='book' size='lg' className='text-blue-600' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Documentación Completa
            </h3>
            <p className='text-gray-600'>
              Guías detalladas, ejemplos prácticos y referencias de API para
              implementar filtros avanzados.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
              <Icon name='code' size='lg' className='text-green-600' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Ejemplos Prácticos
            </h3>
            <p className='text-gray-600'>
              Código funcional y casos de uso reales para diferentes escenarios
              de filtrado.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
              <Icon name='lightbulb' size='lg' className='text-purple-600' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Rendimiento Optimizado
            </h3>
            <p className='text-gray-600'>
              Componentes optimizados para manejar grandes volúmenes de datos
              con filtrado eficiente.
            </p>
          </div>
        </div>

        <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4 text-center'>
            ¿Listo para comenzar?
          </h2>
          <p className='text-gray-600 text-center mb-6'>
            Explora la documentación, revisa los ejemplos y comienza a
            implementar filtros avanzados en tu aplicación.
          </p>
          <div className='flex justify-center'>
            <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all'>
              Explorar Documentación
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
