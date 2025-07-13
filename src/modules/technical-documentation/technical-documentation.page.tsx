import { useEffect } from 'react'
import { MarkdownViewer, useLayout } from '../../components'
import homeInfo from './home.info.md'

export const TechnicalDocumentation = () => {
  const { setHeaderTitle, setHeaderActions, setOverlayVisible } = useLayout()

  useEffect(() => {
    setHeaderTitle('Documentación Técnica')

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setOverlayVisible])

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg border border-gray-300 shadow-sm p-8 mb-8 dark:bg-gray-800 dark:border-gray-600'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4 dark:text-gray-200'>
            Documentación Técnica
          </h1>
          <p className='text-lg text-gray-700 leading-relaxed dark:text-gray-300'>
            Información detallada sobre la arquitectura, APIs y componentes del
            sistema.
          </p>
        </div>

        <div className='bg-white rounded-lg border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600'>
          <MarkdownViewer>{homeInfo}</MarkdownViewer>
        </div>
      </div>
    </div>
  )
}
