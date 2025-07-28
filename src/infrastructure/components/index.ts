// ============================================================================
// COMPONENTS EXPORTS - Exportaciones centralizadas de componentes
// ============================================================================

// Layout components
export { Layout, LayoutProvider, useLayout } from './layout'

// Theme components
export { ThemeProvider } from './theme'

// Icon components
export { Icon } from './icons'

// Form components
export { SortControls } from './sort-controls'

// Navigation components
export { Footer } from './footer'
export { Header } from './header'
export { Sidebar } from './side-bar'

// Content components
export { MarkdownViewer } from './markdown-viewer'
export { Pagination } from './pagination'

// Entity components
export { EntityList } from './entity/entity-list'
export type { EntityListProps } from './entity/entity-list'

// ============================================================================
// COMPONENT TYPES - Tipos exportados para componentes
// ============================================================================

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
} from './layout/layout.types'
