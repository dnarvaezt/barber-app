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
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <MarkdownViewer>{homeInfo}</MarkdownViewer>
      </div>
    </div>
  )
}
