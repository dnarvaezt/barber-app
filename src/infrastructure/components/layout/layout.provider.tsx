import { useCallback, useEffect, useMemo, useState } from 'react'
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

const filterInternalRoutes = (routes: RouteItem[]): RouteItem[] => {
  const filtered = routes
    .filter(route => !route.internal)
    .map(route => ({
      ...route,
      children: route.children
        ? filterInternalRoutes(route.children)
        : undefined,
    }))
  return filtered
}

export const LayoutProvider: React.FC<{
  children: ReactNode
  initialSidebarItems?: RouteItem[]
}> = ({ children, initialSidebarItems = [] }) => {
  const [state, setState] = useState<LayoutState>(initialState)

  useEffect(() => {
    if (initialSidebarItems.length > 0) {
      const filteredItems = filterInternalRoutes(initialSidebarItems)
      setState(prev => ({
        ...prev,
        sidebar: {
          ...prev.sidebar,
          items: filteredItems,
        },
      }))
    }
  }, [initialSidebarItems])

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
      title: state.header.title,
      subtitle: state.header.subtitle,
      visible: state.header.visible,
      actions: state.header.actions,
      open: state.sidebar.open,
      items: state.sidebar.items,
      sidebarVisible: state.sidebar.sidebarVisible,
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
      state.header.title,
      state.header.subtitle,
      state.header.visible,
      state.header.actions,
      state.sidebar.open,
      state.sidebar.sidebarVisible,
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
