import type { RouteItem } from '../../routes'
import type {
  IHeaderCommands,
  IHeaderState,
  ILayoutCommands,
  ILayoutEvent,
  ILayoutObserver,
  ILayoutState,
  ISidebarCommands,
  ISidebarState,
} from './layout.types'

// ============================================================================
// LAYOUT STORE - Patrón Observer + Command
// ============================================================================

export class LayoutStore {
  private state: ILayoutState
  private observers: ILayoutObserver[] = []
  private events: ILayoutEvent[] = []

  constructor(initialState: ILayoutState) {
    this.state = initialState
  }

  // ============================================================================
  // OBSERVER PATTERN IMPLEMENTATION
  // ============================================================================

  addObserver(observer: ILayoutObserver): void {
    this.observers.push(observer)
  }

  removeObserver(observer: ILayoutObserver): void {
    const index = this.observers.indexOf(observer)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  private notifyObservers(event: ILayoutEvent): void {
    this.events.push(event)

    // Limitar el historial de eventos para evitar memory leaks
    if (this.events.length > 100) {
      this.events = this.events.slice(-50)
    }

    this.observers.forEach(observer => {
      try {
        switch (event.type) {
          case 'header-change':
            observer.onHeaderChange?.(this.state.header)
            break
          case 'sidebar-change':
            observer.onSidebarChange?.(this.state.sidebar)
            break
          case 'layout-reset':
            observer.onLayoutChange?.(this.state)
            break
        }
      } catch (error) {
        console.error('Error notifying observer:', error)
      }
    })
  }

  // ============================================================================
  // STATE GETTERS
  // ============================================================================

  getState(): ILayoutState {
    return { ...this.state }
  }

  getHeaderState(): IHeaderState {
    return { ...this.state.header }
  }

  getSidebarState(): ISidebarState {
    return { ...this.state.sidebar }
  }

  getEvents(): ILayoutEvent[] {
    return [...this.events]
  }

  // ============================================================================
  // HEADER COMMANDS IMPLEMENTATION
  // ============================================================================

  private createHeaderCommands(): IHeaderCommands {
    return {
      setTitle: (title: string) => {
        this.state.header.title = title
        this.notifyObservers({
          type: 'header-change',
          payload: { title },
          timestamp: Date.now(),
        })
      },

      setSubtitle: (subtitle: string) => {
        this.state.header.subtitle = subtitle
        this.notifyObservers({
          type: 'header-change',
          payload: { subtitle },
          timestamp: Date.now(),
        })
      },

      setActions: (actions: React.ReactNode) => {
        this.state.header.actions = actions
        this.notifyObservers({
          type: 'header-change',
          payload: { actions },
          timestamp: Date.now(),
        })
      },

      setVisible: (visible: boolean) => {
        this.state.header.visible = visible
        this.notifyObservers({
          type: 'header-change',
          payload: { visible },
          timestamp: Date.now(),
        })
      },
    }
  }

  // ============================================================================
  // SIDEBAR COMMANDS IMPLEMENTATION
  // ============================================================================

  private createSidebarCommands(): ISidebarCommands {
    return {
      toggle: () => {
        this.state.sidebar.open = !this.state.sidebar.open
        this.notifyObservers({
          type: 'sidebar-change',
          payload: { open: this.state.sidebar.open },
          timestamp: Date.now(),
        })
      },

      open: () => {
        this.state.sidebar.open = true
        this.notifyObservers({
          type: 'sidebar-change',
          payload: { open: true },
          timestamp: Date.now(),
        })
      },

      close: () => {
        this.state.sidebar.open = false
        this.notifyObservers({
          type: 'sidebar-change',
          payload: { open: false },
          timestamp: Date.now(),
        })
      },

      setItems: (items: RouteItem[]) => {
        this.state.sidebar.items = items
        this.notifyObservers({
          type: 'sidebar-change',
          payload: { items },
          timestamp: Date.now(),
        })
      },

      setVisible: (visible: boolean) => {
        this.state.sidebar.visible = visible
        this.notifyObservers({
          type: 'sidebar-change',
          payload: { visible },
          timestamp: Date.now(),
        })
      },
    }
  }

  // ============================================================================
  // LAYOUT COMMANDS IMPLEMENTATION
  // ============================================================================

  private createLayoutCommands(): ILayoutCommands {
    return {
      reset: () => {
        // Reset to initial state
        this.state = {
          header: {
            title: 'Barber App',
            subtitle: undefined,
            visible: true,
            actions: undefined,
          },
          sidebar: {
            open: true,
            items: [],
            visible: true,
          },
        }

        this.notifyObservers({
          type: 'layout-reset',
          payload: this.state,
          timestamp: Date.now(),
        })
      },
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  getCommands() {
    return {
      headerCommands: this.createHeaderCommands(),
      sidebarCommands: this.createSidebarCommands(),
      layoutCommands: this.createLayoutCommands(),
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  subscribe(callback: (state: ILayoutState) => void): () => void {
    const observer: ILayoutObserver = {
      onLayoutChange: callback,
    }

    this.addObserver(observer)

    // Return unsubscribe function
    return () => this.removeObserver(observer)
  }

  destroy(): void {
    this.observers = []
    this.events = []
  }
}
