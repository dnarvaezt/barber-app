import type { RouteItem } from '../../routes'
import type {
  IHeaderState,
  ILayoutStrategy,
  IRouteFilterStrategy,
  ISidebarState,
} from './layout.types'

// ============================================================================
// ROUTE FILTER STRATEGIES - Patrón Strategy
// ============================================================================

export class DefaultRouteFilterStrategy implements IRouteFilterStrategy {
  filter(routes: RouteItem[]): RouteItem[] {
    return routes
      .filter(route => !route.hideSidebar)
      .map(route => ({
        ...route,
        children: route.children ? this.filter(route.children) : undefined,
      }))
  }
}

export class PublicRouteFilterStrategy implements IRouteFilterStrategy {
  filter(routes: RouteItem[]): RouteItem[] {
    return routes
      .filter(route => !route.hideSidebar)
      .map(route => ({
        ...route,
        children: route.children ? this.filter(route.children) : undefined,
      }))
  }
}

export class AdminRouteFilterStrategy implements IRouteFilterStrategy {
  filter(routes: RouteItem[]): RouteItem[] {
    return routes
      .filter(route => !route.hideSidebar)
      .map(route => ({
        ...route,
        children: route.children ? this.filter(route.children) : undefined,
      }))
  }
}

// ============================================================================
// LAYOUT STRATEGIES - Patrón Strategy
// ============================================================================

export class DefaultLayoutStrategy implements ILayoutStrategy {
  shouldShowSidebar(state: ISidebarState): boolean {
    return state.visible && state.items.length > 0
  }

  shouldShowHeader(state: IHeaderState): boolean {
    return state.visible
  }
}

export class MobileLayoutStrategy implements ILayoutStrategy {
  shouldShowSidebar(state: ISidebarState): boolean {
    return state.visible && state.open && state.items.length > 0
  }

  shouldShowHeader(state: IHeaderState): boolean {
    return state.visible
  }
}

export class MinimalLayoutStrategy implements ILayoutStrategy {
  shouldShowSidebar(): boolean {
    return false // No mostrar sidebar en layout minimal
  }

  shouldShowHeader(state: IHeaderState): boolean {
    return state.visible
  }
}

// ============================================================================
// STRATEGY FACTORY - Patrón Factory
// ============================================================================

export class LayoutStrategyFactory {
  static createRouteFilter(
    type: 'default' | 'public' | 'admin'
  ): IRouteFilterStrategy {
    switch (type) {
      case 'public':
        return new PublicRouteFilterStrategy()
      case 'admin':
        return new AdminRouteFilterStrategy()
      default:
        return new DefaultRouteFilterStrategy()
    }
  }

  static createLayoutStrategy(
    type: 'default' | 'mobile' | 'minimal'
  ): ILayoutStrategy {
    switch (type) {
      case 'mobile':
        return new MobileLayoutStrategy()
      case 'minimal':
        return new MinimalLayoutStrategy()
      default:
        return new DefaultLayoutStrategy()
    }
  }
}
