import { useEffect } from 'react'
import { MarkdownViewer, useLayout } from '../../components'
import homeInfo from './home.info.md'

export const HomePage = () => {
  const { setHeaderTitle, setHeaderActions, setOverlayVisible } = useLayout()

  useEffect(() => {
    setHeaderTitle('Información')

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setOverlayVisible])

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg border border-gray-300 shadow-sm p-8 mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Bienvenido a Filter Docs
          </h1>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Una aplicación moderna para gestionar y visualizar documentación
            técnica de manera eficiente.
          </p>
        </div>

        <div className='bg-white rounded-lg border border-gray-300 shadow-sm'>
          <MarkdownViewer>{homeInfo}</MarkdownViewer>
        </div>
      </div>
    </div>
  )
}
