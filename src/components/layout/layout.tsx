import { Footer } from '../footer'
import { Header } from '../header'
import { Sidebar } from '../side-bar'
import { useLayout } from './layout.hook'
import './layout.scss'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = (props: LayoutProps) => {
  const { children } = props
  const { sidebarVisible, overlayVisible, overlayContent } = useLayout()

  return (
    <div className='layout'>
      {sidebarVisible && <Sidebar />}

      <div className='layout__container'>
        <Header />
        <main className='layout__main'>{children}</main>
        <Footer />
      </div>

      {overlayVisible && (
        <div className='layout__overlay'>{overlayContent}</div>
      )}
    </div>
  )
}
