import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import type { RouteItem } from '../../routes/routes.types'
import { Icon } from '../icons'
import { SideBarItem } from './side-bar-item'
import { useSideBar } from './side-bar.hook'
import './side-bar.scss'

const version = __APP_VERSION__

export interface SidebarProps {
  items: RouteItem[]
  isVisible?: boolean
  title?: string
  onNavigate?: (path: string) => void
}

export interface SidebarRef {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
}

export const Sidebar = forwardRef<SidebarRef, SidebarProps>((props, ref) => {
  const { items, isVisible = true, title = 'Barber App', onNavigate } = props

  // Estado interno autónomo
  const [isOpen, setIsOpen] = useState(false)

  function handleClose() {
    setIsOpen(false)
  }

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

  function handleNavigate(path: string) {
    onNavigate?.(path)
    // Cerrar automáticamente en móvil
    if (window.innerWidth < 1024) {
      handleClose()
    }
  }

  const sideBarState = useSideBar({
    sidebarItems: items,
    onClose: handleClose,
    onNavigate: handleNavigate,
  })

  // Exponer métodos a través de ref
  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => handleToggle(),
      isOpen: () => isOpen,
    }),
    [isOpen, handleToggle]
  )

  function handleOverlayClick() {
    handleClose()
  }

  if (!isVisible) {
    return null
  }

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div className='side-bar__overlay' onClick={handleOverlayClick} />
      )}

      <aside
        className={`
          side-bar__container
          ${isOpen ? 'side-bar__container--open' : 'side-bar__container--closed'}
        `}
      >
        {/* Header del sidebar */}
        <div className='side-bar__header'>
          <div className='side-bar__header-content'>
            <div className='side-bar__logo'>
              <Icon name='book' className='text-white' size='sm' />
            </div>
            <span className='side-bar__title'>{title}</span>
          </div>
          <button
            onClick={handleClose}
            className='side-bar__close-button'
            aria-label='Cerrar menú lateral'
          >
            <Icon name='times' size='sm' />
          </button>
        </div>

        {/* Contenido del sidebar */}
        <div className='side-bar__content'>
          {/* Navegación */}
          <nav className='side-bar__navigation'>
            {items.map(item => (
              <SideBarItem
                key={item.id}
                item={item}
                sideBarState={sideBarState}
                onNavigate={handleNavigate}
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
})
