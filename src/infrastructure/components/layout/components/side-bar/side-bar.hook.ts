import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import type { RouteItem } from '../../../../routes'

export interface SideBarState {
  expandedItems: Set<string>
  isItemActive: (item: RouteItem, parentPath?: string) => boolean
  isExpanded: (itemId: string) => boolean
  toggleItem: (itemId: string) => void
  handleItemClick: (item: RouteItem, event: React.MouseEvent) => void
  handleExpandClick: (item: RouteItem, event: React.MouseEvent) => void
  getFullPath: (item: RouteItem, parentPath?: string) => string
}

export interface UseSideBarProps {
  sidebarItems: RouteItem[]
  onClose?: () => void
  onNavigate?: (path: string) => void
}

export const useSideBar = (props: UseSideBarProps): SideBarState => {
  const { sidebarItems, onClose, onNavigate } = props
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const isMobile = useRef(false)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth < 1024
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Función helper para calcular el path completo de un item
  const getFullPath = useCallback(
    (item: RouteItem, parentPath: string = ''): string => {
      if (!item.path) return parentPath

      if (item.inheritPath && parentPath) {
        return parentPath + item.path
      }

      return item.path
    },
    []
  )

  // Función para verificar si un item o sus hijos están activos
  const isItemActive = useCallback(
    (item: RouteItem, parentPath: string = ''): boolean => {
      const fullPath = getFullPath(item, parentPath)

      if (fullPath && location.pathname === fullPath) {
        return true
      }

      if (item.children) {
        return item.children.some(child => isItemActive(child, fullPath))
      }

      return false
    },
    [location.pathname, getFullPath]
  )

  // Función para obtener todos los IDs de padres de un path activo
  const getParentIds = useCallback(
    (path: string, items: RouteItem[], parentPath: string = ''): string[] => {
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
    },
    [getFullPath]
  )

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
  }, [location.pathname, sidebarItems, getParentIds])

  const toggleItem = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId)
      } else {
        newExpanded.add(itemId)
      }
      return newExpanded
    })
  }, [])

  const isExpanded = useCallback(
    (itemId: string): boolean => {
      return expandedItems.has(itemId)
    },
    [expandedItems]
  )

  // Función para manejar la navegación
  const handleNavigation = useCallback(
    (path: string) => {
      if (onNavigate) {
        onNavigate(path)
      } else {
        // Fallback: usar window.location si no hay callback
        window.location.href = path
      }
    },
    [onNavigate]
  )

  // Función para determinar el tipo de item y manejar el click
  const handleItemClick = useCallback(
    (item: RouteItem, event: React.MouseEvent) => {
      const hasPath = !!item.path
      const hasChildren = item.children && item.children.length > 0

      if (hasPath && hasChildren) {
        // Item con path y children: el click principal navega
        if (event.button === 0 && !event.ctrlKey && !event.metaKey) {
          // Click principal: navegar
          const fullPath = getFullPath(item)
          if (fullPath) {
            handleNavigation(fullPath)
            if (isMobile.current && onClose) {
              onClose()
            }
          }
        }
      } else if (hasPath && !hasChildren) {
        // Item solo con path: navegar
        const fullPath = getFullPath(item)
        if (fullPath) {
          handleNavigation(fullPath)
          if (isMobile.current && onClose) {
            onClose()
          }
        }
      } else if (!hasPath && hasChildren) {
        // Item sin path pero con children: expandir/contraer
        toggleItem(item.id)
      }
      // Si no tiene path ni children, no hace nada
    },
    [getFullPath, handleNavigation, toggleItem, onClose]
  )

  // Función para manejar el click en el botón de expandir
  const handleExpandClick = useCallback(
    (item: RouteItem, event: React.MouseEvent) => {
      event.stopPropagation()
      toggleItem(item.id)
    },
    [toggleItem]
  )

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
