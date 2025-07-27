import { useCallback, useContext, useMemo } from 'react'
import { LayoutContext } from './layout.context'
import type { ILayoutContextValue, ILayoutObserver } from './layout.types'

// ============================================================================
// LAYOUT HOOK - Hook desacoplado y optimizado
// ============================================================================

export const useLayout = (): ILayoutContextValue => {
  const context = useContext(LayoutContext)

  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }

  return context
}

// ============================================================================
// SPECIALIZED HOOKS - Hooks específicos para cada responsabilidad
// ============================================================================

export const useHeader = () => {
  const { header, headerCommands } = useLayout()

  return useMemo(
    () => ({
      state: header,
      commands: headerCommands,
    }),
    [header, headerCommands]
  )
}

export const useSidebar = () => {
  const { sidebar, sidebarCommands } = useLayout()

  return useMemo(
    () => ({
      state: sidebar,
      commands: sidebarCommands,
    }),
    [sidebar, sidebarCommands]
  )
}

export const useLayoutObserver = (observer: ILayoutObserver) => {
  const { addObserver, removeObserver } = useLayout()

  const subscribe = useCallback(() => {
    addObserver(observer)
  }, [addObserver, observer])

  const unsubscribe = useCallback(() => {
    removeObserver(observer)
  }, [removeObserver, observer])

  return useMemo(
    () => ({
      subscribe,
      unsubscribe,
    }),
    [subscribe, unsubscribe]
  )
}

// ============================================================================
// UTILITY HOOKS - Hooks de utilidad
// ============================================================================

export const useLayoutReset = () => {
  const { layoutCommands } = useLayout()

  return useCallback(() => {
    layoutCommands.reset()
  }, [layoutCommands])
}

export const useLayoutVisibility = () => {
  const { header, sidebar } = useLayout()

  return useMemo(
    () => ({
      headerVisible: header.visible,
      sidebarVisible: sidebar.visible,
      sidebarOpen: sidebar.open,
    }),
    [header.visible, sidebar.visible, sidebar.open]
  )
}
