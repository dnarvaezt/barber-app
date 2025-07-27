import { useNavigate } from 'react-router-dom'
import { Footer } from '../footer'
import { Header } from '../header'
import { Sidebar } from '../side-bar'
import { useLayout, useLayoutVisibility } from './layout.hook'
import './layout.scss'

// ============================================================================
// LAYOUT COMPONENT - Componente principal desacoplado
// ============================================================================

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate()
  const { sidebar, sidebarCommands } = useLayout()
  const { headerVisible, sidebarVisible, sidebarOpen } = useLayoutVisibility()

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <div className='layout'>
      {sidebarVisible && (
        <Sidebar
          items={sidebar.items} // Obtener items del store
          isOpen={sidebarOpen}
          isVisible={sidebarVisible}
          onClose={sidebarCommands.close}
          onToggle={sidebarCommands.toggle}
          onNavigate={handleNavigate}
        />
      )}

      <div className='layout__container'>
        {headerVisible && (
          <Header
            title='' // El título se maneja internamente en el store
            visible={headerVisible}
            actions={undefined} // Las acciones se manejan internamente
            onMenuToggle={sidebarCommands.toggle}
            showMenuButton={sidebarVisible}
          />
        )}
        <main className='layout__main'>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
