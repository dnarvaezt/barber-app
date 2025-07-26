import { useCallback, useMemo, useState } from 'react'
import { LayoutContext } from './layout.context'

import type { LayoutContextType, LayoutState } from './layout.context'

import type { ReactNode } from 'react'
import type { RouteItem } from '../../routes'

const initialState: LayoutState = {
  header: {
    title: 'Filter Docs',
    subtitle: undefined,
    visible: true,
    actions: undefined,
  },
  sidebar: {
    open: false,
    items: [],
    sidebarVisible: true,
  },
}

// Función helper para filtrar rutas internas recursivamente
const filterInternalRoutes = (routes: RouteItem[]): RouteItem[] => {
  return routes
    .filter(route => !route.internal) // Filtrar rutas con internal: true
    .map(route => ({
      ...route,
      children: route.children
        ? filterInternalRoutes(route.children)
        : undefined,
    }))
}

export const LayoutProvider: React.FC<{
  children: ReactNode
  initialSidebarItems?: RouteItem[]
}> = ({ children, initialSidebarItems = [] }) => {
  // Filtrar rutas internas antes de inicializar el estado
  const filteredSidebarItems = useMemo(
    () => filterInternalRoutes(initialSidebarItems),
    [initialSidebarItems]
  )

  const [state, setState] = useState<LayoutState>({
    ...initialState,
    sidebar: {
      ...initialState.sidebar,
      items: filteredSidebarItems,
    },
  })

  const setHeaderTitle = useCallback((title: string) => {
    setState(prev => ({
      ...prev,
      header: { ...prev.header, title },
    }))
  }, [])

  const setHeaderSubtitle = useCallback((subtitle: string) => {
    setState(prev => ({
      ...prev,
      header: { ...prev.header, subtitle },
    }))
  }, [])

  const setHeaderActions = useCallback((actions: ReactNode) => {
    setState(prev => ({
      ...prev,
      header: { ...prev.header, actions },
    }))
  }, [])

  const setHeaderVisible = useCallback((visible: boolean) => {
    setState(prev => ({
      ...prev,
      header: { ...prev.header, visible },
    }))
  }, [])

  const toggleSidebar = useCallback(() => {
    setState(prev => ({
      ...prev,
      sidebar: { ...prev.sidebar, open: !prev.sidebar.open },
    }))
  }, [])

  const openSidebar = useCallback(() => {
    setState(prev => ({
      ...prev,
      sidebar: { ...prev.sidebar, open: true },
    }))
  }, [])

  const closeSidebar = useCallback(() => {
    setState(prev => ({
      ...prev,
      sidebar: { ...prev.sidebar, open: false },
    }))
  }, [])

  const setSidebarItems = useCallback((items: RouteItem[]) => {
    // Filtrar rutas internas antes de actualizar el estado
    const filteredItems = filterInternalRoutes(items)
    setState(prev => ({
      ...prev,
      sidebar: { ...prev.sidebar, items: filteredItems },
    }))
  }, [])

  const setSidebarVisible = useCallback((visible: boolean) => {
    setState(prev => ({
      ...prev,
      sidebar: { ...prev.sidebar, sidebarVisible: visible },
    }))
  }, [])

  const resetLayout = useCallback(() => {
    setState(initialState)
  }, [])

  const contextValue: LayoutContextType = useMemo(
    () => ({
      // Header state
      title: state.header.title,
      subtitle: state.header.subtitle,
      visible: state.header.visible,
      actions: state.header.actions,
      // Sidebar state
      open: state.sidebar.open,
      items: state.sidebar.items,
      sidebarVisible: state.sidebar.sidebarVisible,
      // Methods
      setHeaderTitle,
      setHeaderSubtitle,
      setHeaderActions,
      setHeaderVisible,
      toggleSidebar,
      openSidebar,
      closeSidebar,
      setSidebarItems,
      setSidebarVisible,
      resetLayout,
    }),
    [
      state,
      setHeaderTitle,
      setHeaderSubtitle,
      setHeaderActions,
      setHeaderVisible,
      toggleSidebar,
      openSidebar,
      closeSidebar,
      setSidebarItems,
      setSidebarVisible,
      resetLayout,
    ]
  )

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  )
}
