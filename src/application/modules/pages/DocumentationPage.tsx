import { useEffect } from 'react'
import { Icon } from '../../components/icons'
import { useLayout } from '../../components/useLayout'

const DocumentationPage = () => {
  const { setHeaderTitle, setHeaderSubtitle, setHeaderActions } = useLayout()

  useEffect(() => {
    setHeaderTitle('Documentación')
    setHeaderSubtitle('Guías y referencias de API')

    setHeaderActions(
      <div className='flex items-center space-x-2'>
        <button className='px-3 py-1 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 transition-all'>
          <Icon name='download' size='sm' className='mr-1' />
          Descargar PDF
        </button>
      </div>
    )

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setHeaderSubtitle, setHeaderActions])

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Documentación de Filter
          </h1>
          <p className='text-lg text-gray-600'>
            Guías completas para implementar y personalizar el componente Filter
            en tu aplicación.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 mb-12'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex items-center mb-4'>
              <Icon name='file' size='lg' className='text-blue-600 mr-3' />
              <h2 className='text-xl font-semibold text-gray-900'>
                Instalación
              </h2>
            </div>
            <p className='text-gray-600 mb-4'>
              Aprende cómo instalar y configurar el componente Filter en tu
              proyecto.
            </p>
            <ul className='text-sm text-gray-500 space-y-1'>
              <li>• Instalación via npm</li>
              <li>• Configuración inicial</li>
              <li>• Dependencias requeridas</li>
              <li>• Configuración de TypeScript</li>
            </ul>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex items-center mb-4'>
              <Icon name='code' size='lg' className='text-green-600 mr-3' />
              <h2 className='text-xl font-semibold text-gray-900'>
                Inicio Rápido
              </h2>
            </div>
            <p className='text-gray-600 mb-4'>
              Implementa tu primer filtro en minutos con ejemplos prácticos.
            </p>
            <ul className='text-sm text-gray-500 space-y-1'>
              <li>• Componente básico</li>
              <li>• Configuración de filtros</li>
              <li>• Manejo de eventos</li>
              <li>• Personalización básica</li>
            </ul>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            API Reference
          </h2>

          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Props del Componente
              </h3>
              <div className='bg-gray-50 p-4 rounded-md'>
                <code className='text-sm text-gray-800'>
                  {`interface FilterProps {
  data: any[];
  filters: FilterConfig[];
  onFilterChange: (filteredData: any[]) => void;
  className?: string;
}`}
                </code>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Configuración de Filtros
              </h3>
              <div className='bg-gray-50 p-4 rounded-md'>
                <code className='text-sm text-gray-800'>
                  {`interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: string[];
}`}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4 text-center'>
            ¿Necesitas ayuda?
          </h2>
          <p className='text-gray-600 text-center mb-6'>
            Si tienes preguntas o necesitas soporte, no dudes en contactarnos.
          </p>
          <div className='flex justify-center space-x-4'>
            <button className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'>
              <Icon name='github' size='sm' className='mr-2' />
              Ver en GitHub
            </button>
            <button className='border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors'>
              <Icon name='discord' size='sm' className='mr-2' />
              Unirse a Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentationPage
