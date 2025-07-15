import { useCallback, useMemo, useState } from 'react'
import { LayoutContext } from './layout.context'

import type { LayoutContextType, LayoutState } from './layout.context'

import type { ReactNode } from 'react'
import type { RouteItem } from '../../routes'

const initialState: LayoutState = {
  headerTitle: 'Filter Docs',
  headerSubtitle: undefined,
  headerVisible: true,
  headerActions: undefined,
  sidebarOpen: false,
  sidebarItems: [],
  sidebarVisible: true,
  overlayVisible: false,
  overlayContent: undefined,
}

export const LayoutProvider: React.FC<{
  children: ReactNode
  initialSidebarItems?: RouteItem[]
}> = ({ children, initialSidebarItems = [] }) => {
  const [state, setState] = useState<LayoutState>({
    ...initialState,
    sidebarItems: initialSidebarItems,
  })

  const setHeaderTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, headerTitle: title }))
  }, [])

  const setHeaderSubtitle = useCallback((subtitle: string) => {
    setState(prev => ({ ...prev, headerSubtitle: subtitle }))
  }, [])

  const setHeaderActions = useCallback((actions: ReactNode) => {
    setState(prev => ({ ...prev, headerActions: actions }))
  }, [])

  const setHeaderVisible = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, headerVisible: visible }))
  }, [])

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))
  }, [])

  const openSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: true }))
  }, [])

  const closeSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: false }))
  }, [])

  const setSidebarItems = useCallback((items: RouteItem[]) => {
    setState(prev => ({ ...prev, sidebarItems: items }))
  }, [])

  const setSidebarVisible = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, sidebarVisible: visible }))
  }, [])

  const setOverlayVisible = useCallback(
    (visible: boolean, content?: ReactNode) => {
      setState(prev => ({
        ...prev,
        overlayVisible: visible,
        overlayContent: content,
      }))
    },
    []
  )

  const hideOverlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      overlayVisible: false,
      overlayContent: undefined,
    }))
  }, [])

  const resetLayout = useCallback(() => {
    setState(initialState)
  }, [])

  const contextValue: LayoutContextType = useMemo(
    () => ({
      ...state,
      setHeaderTitle,
      setHeaderSubtitle,
      setHeaderActions,
      setHeaderVisible,
      toggleSidebar,
      openSidebar,
      closeSidebar,
      setSidebarItems,
      setSidebarVisible,
      setOverlayVisible,
      hideOverlay,
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
      setOverlayVisible,
      hideOverlay,
      resetLayout,
    ]
  )

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  )
}
