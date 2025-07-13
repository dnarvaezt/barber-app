import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLayout } from '../layout/useLayout'

import type { RouteItem } from '../../routes'

export interface SideBarState {
  expandedItems: Set<string>
  isItemActive: (item: RouteItem, parentPath?: string) => boolean
  isExpanded: (itemId: string) => boolean
  toggleItem: (itemId: string) => void
  handleItemClick: (item: RouteItem, event: React.MouseEvent) => void
  handleExpandClick: (item: RouteItem, event: React.MouseEvent) => void
  getFullPath: (item: RouteItem, parentPath?: string) => string
}

export const useSideBar = (): SideBarState => {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const { sidebarItems, closeSidebar } = useLayout()

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

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const isExpanded = (itemId: string): boolean => {
    return expandedItems.has(itemId)
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

  return {
    expandedItems,
    isItemActive,
    isExpanded,
    toggleItem,
    handleItemClick,
    handleExpandClick,
    getFullPath,
  }
}
