import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Icon } from '../icons'
import { SideBarItem } from './side-bar-item'
import { useSideBar } from './side-bar.hook'
import './side-bar.scss'

import type { RouteItem } from '../../routes'

const version = __APP_VERSION__

export interface SidebarProps {
  items: RouteItem[]
  isOpen?: boolean
  isVisible?: boolean
  title?: string
  onClose?: () => void
  onNavigate?: (path: string) => void
  onToggle?: (isOpen: boolean) => void
}

export interface SidebarRef {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
}

export const Sidebar = forwardRef<SidebarRef, SidebarProps>((props, ref) => {
  const {
    items,
    isOpen = false,
    isVisible = true,
    title = 'Barber App',
    onClose,
    onNavigate,
    onToggle,
  } = props

  const internalIsOpen = useRef(isOpen)

  function handleClose() {
    internalIsOpen.current = false
    onToggle?.(false)
    onClose?.()
  }

  const sideBarState = useSideBar({
    sidebarItems: items,
    onClose: handleClose,
    onNavigate,
  })

  // Exponer métodos a través de ref
  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        internalIsOpen.current = true
        onToggle?.(true)
      },
      close: () => {
        internalIsOpen.current = false
        onToggle?.(false)
        onClose?.()
      },
      toggle: () => {
        const newState = !internalIsOpen.current
        internalIsOpen.current = newState
        onToggle?.(newState)
        if (!newState) {
          onClose?.()
        }
      },
      isOpen: () => internalIsOpen.current,
    }),
    [onClose, onToggle]
  )

  function handleOverlayClick() {
    handleClose()
  }

  // Sincronizar estado interno con props
  if (isOpen !== internalIsOpen.current) {
    internalIsOpen.current = isOpen
  }

  if (!isVisible) {
    return null
  }

  return (
    <>
      {/* Overlay para móvil */}
      {internalIsOpen.current && (
        <div className='side-bar__overlay' onClick={handleOverlayClick} />
      )}

      <aside
        className={`
          side-bar__container
          ${internalIsOpen.current ? 'side-bar__container--open' : 'side-bar__container--closed'}
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
