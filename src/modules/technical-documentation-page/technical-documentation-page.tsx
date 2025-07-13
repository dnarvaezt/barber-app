import { useEffect } from 'react'
import { MarkdownViewer, useLayout } from '../../components'
import './technical-documentation-page.scss'
import info from './technical-documentation.info.md'

export const TechnicalDocumentationPage = () => {
  const { setHeaderTitle, setHeaderActions, setOverlayVisible } = useLayout()

  useEffect(() => {
    setHeaderTitle('Información')

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setOverlayVisible])

  return (
    <div className='technical-documentation-page'>
      <div className='technical-documentation-page__content'>
        <div className='technical-documentation-page__card'>
          <MarkdownViewer>{info}</MarkdownViewer>
        </div>
      </div>
    </div>
  )
}
