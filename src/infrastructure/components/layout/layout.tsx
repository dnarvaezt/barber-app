import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer, Header, Sidebar, type SidebarRef } from './components'
import './layout.scss'

interface LayoutProps {
  children: React.ReactNode
  sidebarItems?: any[]
}

export const Layout = (props: LayoutProps) => {
  const { children, sidebarItems = [] } = props

  const navigate = useNavigate()
  const headerRef = useRef<any>(null)
  const sidebarRef = useRef<SidebarRef>(null)
  const [headerTitle] = useState('Barber App')

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <div className='layout'>
      <Sidebar
        ref={sidebarRef}
        items={sidebarItems}
        isVisible={true}
        onNavigate={handleNavigate}
      />

      <div className='layout__container'>
        <Header
          ref={headerRef}
          title={headerTitle}
          visible={true}
          actions={undefined}
          showMenuButton={true}
        />

        <div className='layout__body'>
          <main className='layout__main'>{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
