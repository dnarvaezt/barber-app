import type { ReactNode } from 'react'
import type { RouteItem } from '../../routes'
import { createLayoutProvider } from './layout.context'
import { createDefaultLayoutFactory } from './layout.factory'
import type { ILayoutState } from './layout.types'

// ============================================================================
// LAYOUT PROVIDER - Provider simplificado y desacoplado
// ============================================================================

interface LayoutProviderProps {
  children: ReactNode
  initialSidebarItems?: RouteItem[]
  initialState?: Partial<ILayoutState>
}

export const LayoutProvider = ({
  children,
  initialSidebarItems = [],
  initialState = {},
}: LayoutProviderProps) => {
  // Crear factory y estado inicial
  const factory = createDefaultLayoutFactory(initialSidebarItems)
  const layoutState = factory.createLayoutState(initialState)

  // Crear provider usando factory
  const Provider = createLayoutProvider(layoutState)

  return <Provider>{children}</Provider>
}

// ============================================================================
// SPECIALIZED PROVIDERS - Providers específicos
// ============================================================================

export const MinimalLayoutProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const factory = createDefaultLayoutFactory()
  const layoutState = factory.createMinimalLayoutState()
  const Provider = createLayoutProvider(layoutState)

  return <Provider>{children}</Provider>
}

export const MobileLayoutProvider = ({
  children,
  sidebarItems = [],
}: {
  children: ReactNode
  sidebarItems?: RouteItem[]
}) => {
  const factory = createDefaultLayoutFactory(sidebarItems)
  const layoutState = factory.createMobileLayoutState(sidebarItems)
  const Provider = createLayoutProvider(layoutState)

  return <Provider>{children}</Provider>
}

export const AdminLayoutProvider = ({
  children,
  sidebarItems = [],
}: {
  children: ReactNode
  sidebarItems?: RouteItem[]
}) => {
  const factory = createDefaultLayoutFactory(sidebarItems)
  const layoutState = factory.createFullLayoutState(sidebarItems)
  const Provider = createLayoutProvider(layoutState)

  return <Provider>{children}</Provider>
}
