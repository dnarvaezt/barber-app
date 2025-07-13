import { useEffect } from 'react'
import { MarkdownViewer, useLayout } from '../../components'
import homeInfo from './home-page.info.md'
import './home-page.scss'

export const HomePage = () => {
  const { setHeaderTitle, setHeaderActions, setOverlayVisible } = useLayout()

  useEffect(() => {
    setHeaderTitle('Información')

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setOverlayVisible])

  return (
    <div className='home-page'>
      <div className='home-page__content'>
        <div className='home-page__card'>
          <MarkdownViewer>{homeInfo}</MarkdownViewer>
        </div>
      </div>
    </div>
  )
}
