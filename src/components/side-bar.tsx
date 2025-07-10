import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from './icons'
import { useLayout } from './layout/useLayout'

import type { RouteItem } from '../routes'

// Usar RouteItem directamente en lugar de duplicar la interfaz
export type SidebarItem = RouteItem

export const Sidebar = () => {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const version = __APP_VERSION__

  const { sidebarItems, sidebarOpen, sidebarVisible, closeSidebar } =
    useLayout()

  // Función helper para calcular el path completo de un item
  const getFullPath = (item: RouteItem, parentPath: string = ''): string => {
    if (!item.path) return parentPath

    if (item.inheritPath && parentPath) {
      return parentPath + item.path
    }

    return item.path
  }

  // Función para verificar si un item o sus hijos están activos
  const isItemActive = (item: RouteItem, parentPath: string = ''): boolean => {
    const fullPath = getFullPath(item, parentPath)

    if (fullPath && location.pathname === fullPath) {
      return true
    }

    if (item.children) {
      return item.children.some(child => isItemActive(child, fullPath))
    }

    return false
  }

  // Función para obtener todos los IDs de padres de un path activo
  const getParentIds = (
    path: string,
    items: RouteItem[],
    parentPath: string = ''
  ): string[] => {
    const parentIds: string[] = []

    const findParents = (
      items: RouteItem[],
      targetPath: string,
      currentParentPath: string = ''
    ): boolean => {
      for (const item of items) {
        const fullPath = getFullPath(item, currentParentPath)

        if (fullPath === targetPath) {
          return true
        }

        if (item.children && item.children.length > 0) {
          if (findParents(item.children, targetPath, fullPath)) {
            parentIds.unshift(item.id)
            return true
          }
        }
      }
      return false
    }

    findParents(items, path, parentPath)
    return parentIds
  }

  // Expandir automáticamente los padres del item activo
  useEffect(() => {
    const parentIds = getParentIds(location.pathname, sidebarItems)
    if (parentIds.length > 0) {
      setExpandedItems(prev => {
        const newExpanded = new Set(prev)
        parentIds.forEach(id => newExpanded.add(id))
        return newExpanded
      })
    }
  }, [location.pathname, sidebarItems])

  if (!sidebarVisible) {
    return null
  }

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  // Función para determinar el tipo de item y manejar el click
  const handleItemClick = (item: RouteItem, event: React.MouseEvent) => {
    const hasPath = !!item.path
    const hasChildren = item.children && item.children.length > 0

    if (hasPath && hasChildren) {
      // Item con path y children: el click principal navega
      if (event.button === 0 && !event.ctrlKey && !event.metaKey) {
        // Click principal: navegar
        if (window.innerWidth < 1024) closeSidebar()
      }
    } else if (hasPath && !hasChildren) {
      // Item solo con path: navegar
      if (window.innerWidth < 1024) closeSidebar()
    } else if (!hasPath && hasChildren) {
      // Item sin path pero con children: expandir/contraer
      toggleItem(item.id)
    }
    // Si no tiene path ni children, no hace nada
  }

  // Función para manejar el click en el botón de expandir
  const handleExpandClick = (item: RouteItem, event: React.MouseEvent) => {
    event.stopPropagation()
    toggleItem(item.id)
  }

  const renderItem = (
    item: RouteItem,
    level: number = 0,
    parentPath: string = ''
  ) => {
    const isExpanded = expandedItems.has(item.id)
    const isActive = isItemActive(item, parentPath)
    const hasChildren = item.children && item.children.length > 0
    const hasPath = !!item.path
    const fullPath = getFullPath(item, parentPath)

    return (
      <div key={item.id}>
        <div
          className={`
            flex items-center justify-between px-3 py-2 text-sm font-normal transition-colors duration-150 cursor-pointer
            ${level > 0 ? 'ml-6' : ''}
            ${
              isActive
                ? 'bg-blue-100 text-blue-800 border-r-2 border-blue-500'
                : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
          onClick={e => handleItemClick(item, e)}
        >
          <div className='flex items-center space-x-3 flex-1 min-w-0'>
            {item.icon && (
              <div
                className={`flex-shrink-0 w-4 h-4 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {item.icon}
              </div>
            )}
            {hasPath ? (
              <Link
                to={fullPath}
                className='flex-1 truncate'
                onClick={e => e.stopPropagation()}
              >
                {item.title}
              </Link>
            ) : (
              <span className='flex-1 truncate'>{item.title}</span>
            )}
          </div>

          {/* Botón de expandir/contraer */}
          {hasChildren && (
            <button
              onClick={e => handleExpandClick(item, e)}
              className={`
                flex-shrink-0 ml-2 p-1 rounded transition-colors duration-150
                ${
                  isActive
                    ? 'text-blue-600 hover:bg-blue-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }
              `}
              title={isExpanded ? 'Contraer' : 'Expandir'}
            >
              <Icon
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                className='transition-transform duration-150'
                size='sm'
              />
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className='mt-1 border-l border-gray-200 ml-3'>
            {item.children!.map(child =>
              renderItem(child, level + 1, fullPath)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300'
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-300 shadow-sm transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header del sidebar */}
        <div className='flex items-center h-14 px-4 border-b border-gray-300 bg-gray-50'>
          <div className='flex items-center space-x-3 flex-1 min-w-0'>
            <div className='w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm'>
              <Icon name='book' className='text-white' size='sm' />
            </div>
            <span className='text-gray-900 font-semibold text-sm truncate'>
              Filter Docs
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className='lg:hidden ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors duration-150 flex items-center justify-center h-9 w-9'
            style={{ minHeight: 0 }}
          >
            <Icon name='times' size='sm' />
          </button>
        </div>

        {/* Contenido del sidebar */}
        <div className='flex flex-col h-full'>
          {/* Navegación */}
          <nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto'>
            {sidebarItems.map(item => renderItem(item))}
          </nav>

          {/* Footer del sidebar */}
          <div className='px-4 py-3 border-t border-gray-300 bg-gray-50'>
            <div className='text-xs text-gray-500 text-center font-medium'>
              v{version}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
