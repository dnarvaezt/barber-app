import type { RouteItem } from '../../routes'
import { LayoutStrategyFactory } from './layout.strategies'
import type {
  IHeaderState,
  ILayoutConfig,
  ILayoutFactory,
  ILayoutState,
  ISidebarState,
} from './layout.types'

// ============================================================================
// LAYOUT FACTORY - Patrón Factory
// ============================================================================

export class LayoutFactory implements ILayoutFactory {
  private config: ILayoutConfig

  constructor(config: ILayoutConfig = {}) {
    this.config = config
  }

  createHeaderState(config?: Partial<IHeaderState>): IHeaderState {
    const defaultState: IHeaderState = {
      title: 'Barber App',
      subtitle: undefined,
      visible: true,
      actions: undefined,
    }

    return {
      ...defaultState,
      ...this.config.header,
      ...config,
    }
  }

  createSidebarState(config?: Partial<ISidebarState>): ISidebarState {
    const defaultState: ISidebarState = {
      open: true,
      items: [],
      visible: true,
    }

    const mergedState = {
      ...defaultState,
      ...this.config.sidebar,
      ...config,
    }

    // Aplicar filtro de rutas si se proporciona
    if (this.config.routeFilter && mergedState.items.length > 0) {
      mergedState.items = this.config.routeFilter.filter(mergedState.items)
    }

    return mergedState
  }

  createLayoutState(config?: Partial<ILayoutState>): ILayoutState {
    return {
      header: this.createHeaderState(config?.header),
      sidebar: this.createSidebarState(config?.sidebar),
    }
  }

  // Métodos de conveniencia para crear estados específicos
  createMinimalLayoutState(): ILayoutState {
    return this.createLayoutState({
      header: { title: 'Barber App', visible: true },
      sidebar: { visible: false, open: false, items: [] },
    })
  }

  createFullLayoutState(sidebarItems: RouteItem[]): ILayoutState {
    return this.createLayoutState({
      sidebar: { items: sidebarItems, visible: true, open: true },
    })
  }

  createMobileLayoutState(sidebarItems: RouteItem[]): ILayoutState {
    return this.createLayoutState({
      sidebar: { items: sidebarItems, visible: true, open: false },
    })
  }
}

// ============================================================================
// FACTORY INSTANCES PREDEFINIDAS
// ============================================================================

export const createDefaultLayoutFactory = (
  sidebarItems: RouteItem[] = []
): LayoutFactory => {
  return new LayoutFactory({
    routeFilter: LayoutStrategyFactory.createRouteFilter('default'),
    layoutStrategy: LayoutStrategyFactory.createLayoutStrategy('default'),
    sidebar: { items: sidebarItems },
  })
}

export const createMobileLayoutFactory = (
  sidebarItems: RouteItem[] = []
): LayoutFactory => {
  return new LayoutFactory({
    routeFilter: LayoutStrategyFactory.createRouteFilter('default'),
    layoutStrategy: LayoutStrategyFactory.createLayoutStrategy('mobile'),
    sidebar: { items: sidebarItems, open: false },
  })
}

export const createMinimalLayoutFactory = (): LayoutFactory => {
  return new LayoutFactory({
    layoutStrategy: LayoutStrategyFactory.createLayoutStrategy('minimal'),
    sidebar: { visible: false, open: false },
  })
}

export const createAdminLayoutFactory = (
  sidebarItems: RouteItem[] = []
): LayoutFactory => {
  return new LayoutFactory({
    routeFilter: LayoutStrategyFactory.createRouteFilter('admin'),
    layoutStrategy: LayoutStrategyFactory.createLayoutStrategy('default'),
    sidebar: { items: sidebarItems },
  })
}
