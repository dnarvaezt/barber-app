import type { MenuProps } from 'antd'
import { Button, Drawer, Grid, Layout, Menu, Space, Typography } from 'antd'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { RouteItem } from '../../../../routes/routes.types'
import { Icon } from '../../../icons'
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
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.lg
  const location = useLocation()

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleNavigate = useCallback(
    (path: string) => {
      onNavigate?.(path)
      // Cerrar automáticamente en móvil
      if (window.innerWidth < 1024) {
        handleClose()
      }
    },
    [onNavigate, handleClose]
  )

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

  // Construye los elementos del menú de Ant Design a partir de las rutas
  type ItemType = Required<MenuProps>['items'][number]

  const buildMenuItems = useCallback(
    (routes: RouteItem[], parentPath = ''): ItemType[] => {
      return routes
        .filter(route => !route.hideSidebar)
        .map(route => {
          const fullPath = sideBarState.getFullPath(route, parentPath)
          const hasChildren = !!route.children && route.children.length > 0

          const labelContent = (
            <div className='side-bar__menu-label'>
              {route.icon ? (
                <span className='side-bar-item__icon'>{route.icon}</span>
              ) : null}
              {route.path && route.component ? (
                <Link
                  to={fullPath}
                  onClick={e => {
                    e.stopPropagation()
                    handleNavigate(fullPath)
                  }}
                  className='side-bar-item__link'
                >
                  {route.title}
                </Link>
              ) : (
                <span className='side-bar-item__text'>{route.title}</span>
              )}
            </div>
          )

          if (hasChildren) {
            return {
              key: route.id,
              label: labelContent,
              children: buildMenuItems(route.children!, fullPath),
            }
          }

          return {
            key: route.id,
            label: labelContent,
          }
        })
    },
    [handleNavigate, sideBarState]
  )

  const menuItems = useMemo(
    () => buildMenuItems(items),
    [buildMenuItems, items]
  )

  // Mapea el estado de expansión propio al API controlado de Menu
  const openKeys = useMemo(
    () => Array.from(sideBarState.expandedItems),
    [sideBarState.expandedItems]
  )

  const handleOpenChange: MenuProps['onOpenChange'] = keys => {
    const prev = sideBarState.expandedItems
    const next = new Set(Array.isArray(keys) ? (keys as string[]) : [])
    prev.forEach(id => {
      if (!next.has(id)) sideBarState.toggleItem(id)
    })
    next.forEach(id => {
      if (!prev.has(id)) sideBarState.toggleItem(id)
    })
  }

  // Selección actual basada en la URL
  const selectedKeys = useMemo(() => {
    const findActive = (
      routes: RouteItem[],
      parentPath = ''
    ): string | null => {
      for (const route of routes) {
        const fullPath = sideBarState.getFullPath(route, parentPath)
        if (fullPath && location.pathname === fullPath) return route.id
        if (route.children && route.children.length > 0) {
          const childActive = findActive(route.children, fullPath)
          if (childActive) return childActive
        }
      }
      return null
    }

    const activeKey = findActive(items)
    return activeKey ? [activeKey] : []
  }, [items, location.pathname, sideBarState])

  const SidebarContent = (
    <div className={`side-bar ${isOpen ? 'side-bar--open' : ''}`}>
      <div className='side-bar__header'>
        <div className='side-bar__header-content'>
          <div className='side-bar__logo'>
            <Icon name='book' className='text-white' size='sm' />
          </div>
          <Typography.Text className='side-bar__title' strong>
            {title}
          </Typography.Text>
        </div>
        <Button
          onClick={handleClose}
          className='side-bar__header-close-button'
          aria-label='Cerrar menú lateral'
          type='text'
          shape='circle'
          icon={<Icon name='times' size='sm' />}
        />
      </div>

      <div className='side-bar__content'>
        <nav className='side-bar__navigation'>
          <Menu
            mode='inline'
            items={menuItems}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            selectedKeys={selectedKeys}
          />
        </nav>

        <div className='side-bar__footer'>
          <Space direction='vertical' size={4} className='side-bar__space'>
            <div className='side-bar__version'>v{version}</div>
          </Space>
        </div>
      </div>
    </div>
  )

  if (!isVisible) {
    return null
  }

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onClose={handleOverlayClick}
        placement='left'
        width={280}
        rootClassName='side-bar__drawer'
      >
        {SidebarContent}
      </Drawer>
    )
  }

  return (
    <Layout.Sider width={250} theme='light' className='side-bar__sider'>
      {SidebarContent}
    </Layout.Sider>
  )
})
