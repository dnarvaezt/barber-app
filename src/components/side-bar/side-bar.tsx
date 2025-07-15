import { Icon } from '../icons'
import { useLayout } from '../layout/layout.hook'
import { SideBarItem } from './side-bar-item'
import { useSideBar } from './side-bar.hook'
import './side-bar.scss'

const version = __APP_VERSION__

export const Sidebar = () => {
  const { sidebarItems, sidebarOpen, sidebarVisible, closeSidebar } =
    useLayout()
  const sideBarState = useSideBar()

  if (!sidebarVisible) {
    return null
  }

  return (
    <>
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div className='side-bar__overlay' onClick={closeSidebar} />
      )}

      <aside
        className={`
          side-bar__container
          ${sidebarOpen ? 'side-bar__container--open' : 'side-bar__container--closed'}
        `}
      >
        {/* Header del sidebar */}
        <div className='side-bar__header'>
          <div className='side-bar__header-content'>
            <div className='side-bar__logo'>
              <Icon name='book' className='text-white' size='sm' />
            </div>
            <span className='side-bar__title'>Filter Docs</span>
          </div>
          <button onClick={closeSidebar} className='side-bar__close-button'>
            <Icon name='times' size='sm' />
          </button>
        </div>

        {/* Contenido del sidebar */}
        <div className='side-bar__content'>
          {/* Navegación */}
          <nav className='side-bar__navigation'>
            {sidebarItems.map(item => (
              <SideBarItem
                key={item.id}
                item={item}
                sideBarState={sideBarState}
              />
            ))}
          </nav>

          {/* Footer del sidebar */}
          <div className='side-bar__footer'>
            <div className='side-bar__version'>v{version}</div>
          </div>
        </div>
      </aside>
    </>
  )
}
