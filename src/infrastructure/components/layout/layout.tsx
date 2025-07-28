import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../footer'
import { Header } from '../header'
import { Sidebar, type SidebarRef } from '../side-bar'
import './layout.scss'

// ============================================================================
// LAYOUT COMPONENT - Componente autónomo y desacoplado
// ============================================================================

interface LayoutProps {
  children: React.ReactNode
  sidebarItems?: any[]
}

export const Layout = ({ children, sidebarItems = [] }: LayoutProps) => {
  const navigate = useNavigate()
  const headerRef = useRef<any>(null)
  const sidebarRef = useRef<SidebarRef>(null)
  const [headerTitle] = useState('Barber App')

  // Coordinación entre componentes autónomos
  useEffect(() => {
    // Los componentes son autónomos y se comunican a través de refs
    // El header puede controlar el sidebar cuando sea necesario
  }, [])

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
        <main className='layout__main'>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
