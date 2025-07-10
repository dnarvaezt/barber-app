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
            flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-all duration-200 cursor-pointer
            ${level > 0 ? 'ml-6' : ''}
            ${
              isActive
                ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
          onClick={e => handleItemClick(item, e)}
        >
          <div className='flex items-center space-x-3 flex-1 min-w-0'>
            {item.icon && (
              <div className='flex-shrink-0 w-5 h-5'>{item.icon}</div>
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

          {/* Botón de expandir/contraer con indicador visual integrado */}
          {hasChildren && (
            <button
              onClick={e => handleExpandClick(item, e)}
              className={`
                flex-shrink-0 ml-2 p-2 rounded-md transition-all duration-200 hover:scale-110
                ${
                  isActive
                    ? 'text-blue-600 hover:bg-blue-200 hover:text-blue-700'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }
              `}
              title={isExpanded ? 'Contraer' : 'Expandir'}
            >
              <Icon
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                className='transition-transform duration-200'
                size='sm'
              />
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className='mt-1'>
            {item.children!.map(child =>
              renderItem(child, level + 1, fullPath)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 w-64 h-screen bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-40
      `}
    >
      <div className='h-full flex flex-col'>
        <div className='p-4 border-b border-gray-200 flex-shrink-0 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>Filter Docs</h2>
          <button
            onClick={closeSidebar}
            className='lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          >
            <Icon name='times' size='lg' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto py-4'>
          <nav className='space-y-1'>
            {sidebarItems.map(item => renderItem(item))}
          </nav>
        </div>

        <div className='p-4 border-t border-gray-200 flex-shrink-0'>
          <div className='text-xs text-gray-500 text-center'>
            Versión: {version}
          </div>
        </div>
      </div>
    </aside>
  )
}
