import type { ReactNode } from 'react'
import { createContext, useEffect, useRef } from 'react'

import { LayoutStore } from './layout.store'
import type {
  ILayoutContextValue,
  ILayoutObserver,
  ILayoutState,
} from './layout.types'

// ============================================================================
// LAYOUT CONTEXT - Contexto React desacoplado
// ============================================================================

export const LayoutContext = createContext<ILayoutContextValue | undefined>(
  undefined
)

// ============================================================================
// CONTEXT PROVIDER FACTORY - Patrón Factory
// ============================================================================

export interface LayoutProviderFactory {
  createProvider: (
    initialState: ILayoutState
  ) => React.FC<{ children: ReactNode }>
}

export class DefaultLayoutProviderFactory implements LayoutProviderFactory {
  createProvider(
    initialState: ILayoutState
  ): React.FC<{ children: ReactNode }> {
    return ({ children }) => {
      const storeRef = useRef<LayoutStore | null>(null)
      const stateRef = useRef<ILayoutState>(initialState)

      // Inicializar store una sola vez
      if (!storeRef.current) {
        storeRef.current = new LayoutStore(initialState)
      }

      // Suscribirse a cambios del store
      useEffect(() => {
        const store = storeRef.current!
        const unsubscribe = store.subscribe(newState => {
          stateRef.current = newState
        })

        return () => {
          unsubscribe()
          store.destroy()
        }
      }, [])

      // Crear valor del contexto estable
      const contextValue: ILayoutContextValue = {
        // State - siempre actualizado
        get header() {
          return stateRef.current.header
        },
        get sidebar() {
          return stateRef.current.sidebar
        },

        // Commands - estables (no cambian)
        get headerCommands() {
          return storeRef.current!.getCommands().headerCommands
        },
        get sidebarCommands() {
          return storeRef.current!.getCommands().sidebarCommands
        },
        get layoutCommands() {
          return storeRef.current!.getCommands().layoutCommands
        },

        // Observers - estables
        get observers() {
          return [] // Los observers se manejan internamente en el store
        },
        addObserver: (observer: ILayoutObserver) => {
          storeRef.current!.addObserver(observer)
        },
        removeObserver: (observer: ILayoutObserver) => {
          storeRef.current!.removeObserver(observer)
        },
      }

      return (
        <LayoutContext.Provider value={contextValue}>
          {children}
        </LayoutContext.Provider>
      )
    }
  }
}

// ============================================================================
// PROVIDER INSTANCES PREDEFINIDAS
// ============================================================================

export const createLayoutProvider = (initialState: ILayoutState) => {
  const factory = new DefaultLayoutProviderFactory()
  return factory.createProvider(initialState)
}

// ============================================================================
// EXPORTACIONES COMPATIBILIDAD
// ============================================================================

// Re-exportar tipos para compatibilidad
export type {
  IHeaderState,
  ILayoutContextValue,
  ILayoutObserver,
  ILayoutState,
  ISidebarState,
} from './layout.types'
