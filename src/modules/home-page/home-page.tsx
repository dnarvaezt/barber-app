import { useEffect } from 'react'
import { MarkdownViewer, useLayout } from '../../components'
import info from './home-page.info.md'
import './home-page.scss'

export const HomePage = () => {
  const { setHeaderTitle, setHeaderActions } = useLayout()

  useEffect(() => {
    setHeaderTitle('Información')

    return () => {
      setHeaderActions(undefined)
    }
  }, [setHeaderTitle, setHeaderActions])

  return (
    <div className='home-page'>
      <div className='home-page__content'>
        <div className='home-page__card'>
          <MarkdownViewer>{info}</MarkdownViewer>
        </div>
      </div>
    </div>
  )
}
