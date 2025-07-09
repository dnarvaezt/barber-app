import { useCallback, useMemo, useState } from 'react'
import { LayoutContext } from './LayoutContextDef'

import type { LayoutContextType } from './LayoutContextDef'

import type { ReactNode } from 'react'
import type { SidebarItem } from '../side-bar'

// Tipos para el contexto
interface LayoutState {
  // Header
  headerTitle: string
  headerSubtitle?: string
  headerVisible: boolean
  headerActions?: ReactNode

  // Sidebar
  sidebarOpen: boolean
  sidebarItems: SidebarItem[]
  sidebarVisible: boolean

  // Overlay
  overlayVisible: boolean
  overlayContent?: ReactNode
}

// Estado inicial
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

// Provider del contexto
export const LayoutProvider: React.FC<{
  children: ReactNode
  initialSidebarItems?: SidebarItem[]
}> = ({ children, initialSidebarItems = [] }) => {
  const [state, setState] = useState<LayoutState>({
    ...initialState,
    sidebarItems: initialSidebarItems,
  })

  // Header actions
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

  // Sidebar actions
  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))
  }, [])

  const openSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: true }))
  }, [])

  const closeSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: false }))
  }, [])

  const setSidebarItems = useCallback((items: SidebarItem[]) => {
    setState(prev => ({ ...prev, sidebarItems: items }))
  }, [])

  const setSidebarVisible = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, sidebarVisible: visible }))
  }, [])

  // Overlay actions
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

  // Utility actions
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
