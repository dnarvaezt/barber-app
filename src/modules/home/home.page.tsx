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
        <div className='bg-white rounded-lg border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600'>
          <MarkdownViewer>{homeInfo}</MarkdownViewer>
        </div>
      </div>
    </div>
  )
}
