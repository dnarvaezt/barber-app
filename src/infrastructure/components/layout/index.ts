// ============================================================================
// LAYOUT MODULE EXPORTS - Arquitectura limpia y desacoplada
// ============================================================================

// Componentes principales
export { Layout } from './layout'
export {
  AdminLayoutProvider,
  LayoutProvider,
  MinimalLayoutProvider,
  MobileLayoutProvider,
} from './layout.provider'

// Hooks especializados
export {
  useHeader,
  useLayout,
  useLayoutObserver,
  useLayoutReset,
  useLayoutVisibility,
  useSidebar,
} from './layout.hook'

// Contexto y tipos
export { LayoutContext, createLayoutProvider } from './layout.context'
export type {
  IHeaderCommands,
  IHeaderState,
  ILayoutCommands,
  ILayoutComponent,
  ILayoutConfig,
  ILayoutContextValue,
  ILayoutEvent,
  ILayoutFactory,
  ILayoutObserver,
  ILayoutState,
  ILayoutStrategy,
  IRouteFilterStrategy,
  ISidebarCommands,
  ISidebarState,
} from './layout.types'

// Factories y estrategias
export {
  LayoutFactory,
  createAdminLayoutFactory,
  createDefaultLayoutFactory,
  createMinimalLayoutFactory,
  createMobileLayoutFactory,
} from './layout.factory'

export {
  AdminRouteFilterStrategy,
  DefaultLayoutStrategy,
  DefaultRouteFilterStrategy,
  LayoutStrategyFactory,
  MinimalLayoutStrategy,
  MobileLayoutStrategy,
  PublicRouteFilterStrategy,
} from './layout.strategies'

// Store
export { LayoutStore } from './layout.store'
