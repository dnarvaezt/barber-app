// ============================================================================
// TRACK ACTIVITY PROVIDER - Provider de React para el sistema de actividad
// ============================================================================

import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { IActivityConfiguration } from '../application'

import {
  ActivityConfigurationFactory,
  ActivityConfigurationService,
  ActivityEventBus,
  ActivityEventService,
  ActivityRecordMemoryRepository,
  ActivityRecordService,
  ActivityValidator,
} from '../application'

import {
  useTrackActivity,
  type UseTrackActivityOptions,
} from './track-activity.hook'

import {
  TrackActivityContext,
  type TrackActivityContextValue,
} from './track-activity.context'

export interface TrackActivityProviderProps {
  children: ReactNode
  configuration?: Partial<IActivityConfiguration>
  options?: UseTrackActivityOptions
  autoStart?: boolean
}

// ============================================================================
// PROVIDER PRINCIPAL
// ============================================================================

export function TrackActivityProvider({
  children,
  configuration = {},
  options = {},
  autoStart = false,
}: TrackActivityProviderProps) {
  // ============================================================================
  // CREACIÓN DE SERVICIOS
  // ============================================================================

  const services = useMemo(() => {
    // Crear repositorio
    const repository = new ActivityRecordMemoryRepository()

    // Crear bus de eventos
    const eventBus = new ActivityEventBus()

    // Crear validador
    const validator = new ActivityValidator()

    // Crear factories (no utilizados actualmente)
    // const recordFactory = new ActivityRecordFactory()
    // const eventFactory = new ActivityEventFactory()

    // Crear configuración
    const config = ActivityConfigurationFactory.createFromPartial(configuration)

    // Crear servicios
    const configService = new ActivityConfigurationService()
    const eventService = new ActivityEventService(config)
    const recordService = new ActivityRecordService(
      repository,
      eventBus,
      validator,
      config
    )

    return {
      recordService,
      eventService,
      configService,
    }
  }, [configuration])

  // ============================================================================
  // HOOK DE ACTIVIDAD
  // ============================================================================

  const [state, actions] = useTrackActivity(
    services.recordService,
    services.eventService,
    services.configService,
    {
      autoStart,
      configuration,
      ...options,
    }
  )

  // ============================================================================
  // VALOR DEL CONTEXTO
  // ============================================================================

  const contextValue: TrackActivityContextValue = useMemo(
    () => ({
      state,
      actions,
      services,
    }),
    [state, actions, services]
  )

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <TrackActivityContext.Provider value={contextValue}>
      {children}
    </TrackActivityContext.Provider>
  )
}

// ============================================================================
// HOOK DE USO DEL CONTEXTO
// ============================================================================

// useTrackActivityContext se ha movido a track-activity.hooks.ts

// Los hooks específicos se han movido a track-activity.hooks.ts
