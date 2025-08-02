import { createContext } from 'react'

// ============================================================================
// INTERFACES DEL CONTEXTO
// ============================================================================

export interface TrackActivityContextValue {
  state: any // TODO: Tipar correctamente
  actions: any // TODO: Tipar correctamente
  services: {
    recordService: any
    eventService: any
    configService: any
  }
}

// ============================================================================
// CONTEXTO
// ============================================================================

export const TrackActivityContext =
  createContext<TrackActivityContextValue | null>(null)
