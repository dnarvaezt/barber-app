import type { ReactNode } from 'react'
import type { RouteItem } from '../../routes'

// ============================================================================
// DOMAIN INTERFACES - Principio de Inversión de Dependencias
// ============================================================================

export interface IHeaderState {
  title: string
  subtitle?: string
  visible: boolean
  actions?: ReactNode
}

export interface ISidebarState {
  open: boolean
  items: RouteItem[]
  visible: boolean
}

export interface ILayoutState {
  header: IHeaderState
  sidebar: ISidebarState
}

// ============================================================================
// COMMAND INTERFACES - Patrón Command para operaciones
// ============================================================================

export interface IHeaderCommands {
  setTitle: (title: string) => void
  setSubtitle: (subtitle: string) => void
  setActions: (actions: ReactNode) => void
  setVisible: (visible: boolean) => void
}

export interface ISidebarCommands {
  toggle: () => void
  open: () => void
  close: () => void
  setItems: (items: RouteItem[]) => void
  setVisible: (visible: boolean) => void
}

export interface ILayoutCommands {
  reset: () => void
}

// ============================================================================
// OBSERVER INTERFACES - Patrón Observer para notificaciones
// ============================================================================

export interface ILayoutObserver {
  onHeaderChange?: (state: IHeaderState) => void
  onSidebarChange?: (state: ISidebarState) => void
  onLayoutChange?: (state: ILayoutState) => void
}

// ============================================================================
// FACTORY INTERFACES - Patrón Factory para creación
// ============================================================================

export interface ILayoutFactory {
  createHeaderState: (config?: Partial<IHeaderState>) => IHeaderState
  createSidebarState: (config?: Partial<ISidebarState>) => ISidebarState
  createLayoutState: (config?: Partial<ILayoutState>) => ILayoutState
}

// ============================================================================
// STRATEGY INTERFACES - Patrón Strategy para comportamientos
// ============================================================================

export interface IRouteFilterStrategy {
  filter: (routes: RouteItem[]) => RouteItem[]
}

export interface ILayoutStrategy {
  shouldShowSidebar: (state: ISidebarState) => boolean
  shouldShowHeader: (state: IHeaderState) => boolean
}

// ============================================================================
// COMPOSITE INTERFACES - Patrón Composite para estructura
// ============================================================================

export interface ILayoutComponent {
  render: (props: any) => ReactNode
  isVisible: (state: ILayoutState) => boolean
}

// ============================================================================
// CONTEXT TYPES - Para React Context
// ============================================================================

export interface ILayoutContextValue {
  // State
  header: IHeaderState
  sidebar: ISidebarState

  // Commands
  headerCommands: IHeaderCommands
  sidebarCommands: ISidebarCommands
  layoutCommands: ILayoutCommands

  // Observers
  observers: ILayoutObserver[]
  addObserver: (observer: ILayoutObserver) => void
  removeObserver: (observer: ILayoutObserver) => void
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface ILayoutConfig {
  header?: Partial<IHeaderState>
  sidebar?: Partial<ISidebarState>
  routeFilter?: IRouteFilterStrategy
  layoutStrategy?: ILayoutStrategy
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface ILayoutEvent {
  type: 'header-change' | 'sidebar-change' | 'layout-reset'
  payload: any
  timestamp: number
}
