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
  const {
    title,
    visible,
    actions,
    sidebarVisible,
    open,
    items,
    closeSidebar,
    toggleSidebar,
  } = useLayout()

  return (
    <div className='layout'>
      {sidebarVisible && (
        <Sidebar
          items={items}
          isOpen={open}
          isVisible={sidebarVisible}
          onClose={closeSidebar}
          onToggle={toggleSidebar}
        />
      )}

      <div className='layout__container'>
        <Header
          title={title}
          visible={visible}
          actions={actions}
          onMenuToggle={toggleSidebar}
          showMenuButton={sidebarVisible}
        />
        <main className='layout__main'>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
