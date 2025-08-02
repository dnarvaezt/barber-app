import { useContext } from 'react'
import {
  TrackActivityContext,
  type TrackActivityContextValue,
} from './track-activity.context'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function useTrackActivityContext(): TrackActivityContextValue {
  const context = useContext(TrackActivityContext)
  if (!context) {
    throw new Error(
      'useTrackActivityContext must be used within a TrackActivityProvider'
    )
  }
  return context
}

// ============================================================================
// HOOKS ESPECÍFICOS
// ============================================================================

export function useTrackActivityState() {
  const context = useTrackActivityContext()
  return context.state
}

export function useTrackActivityActions() {
  const context = useTrackActivityContext()
  return context.actions
}

export function useTrackActivityServices() {
  const context = useTrackActivityContext()
  return context.services
}

export function useTrackActivityMonitoring() {
  const context = useTrackActivityContext()

  return {
    isMonitoring: context.state.isMonitoring,
    startMonitoring: context.actions.startMonitoring,
    stopMonitoring: context.actions.stopMonitoring,
  }
}

export function useTrackActivityConfiguration() {
  const context = useTrackActivityContext()

  return {
    configuration: context.state.configuration,
    updateConfiguration: context.actions.updateConfiguration,
  }
}

export function useTrackActivityStats() {
  const context = useTrackActivityContext()

  return {
    stats: context.state.stats,
    getStats: context.actions.getStats,
    clearRecords: context.actions.clearRecords,
  }
}

export function useTrackActivityRecords() {
  const context = useTrackActivityContext()

  return {
    getActiveRecord: context.actions.getActiveRecord,
    getAllRecords: context.actions.getAllRecords,
    clearRecords: context.actions.clearRecords,
  }
}

// ============================================================================
// HOOKS DE EVENTOS
// ============================================================================

export function useTrackActivityEvents() {
  const context = useTrackActivityContext()

  return {
    activeRecord: context.state.activeRecord,
    lastInteractionTime: context.state.lastInteractionTime,
    isTabVisible: context.state.isTabVisible,
    isTabFocused: context.state.isTabFocused,
  }
}

// ============================================================================
// HOOKS DE CONFIGURACIÓN AVANZADA
// ============================================================================

export function useTrackActivityWithCallbacks(
  callbacks: {
    onActivityStarted?: (record: any) => void
    onActivityUpdated?: (record: any) => void
    onActivityFinished?: (record: any) => void
    onActivitySuspended?: (record: any) => void
    onActivityResumed?: (record: any) => void
    onError?: (error: Error) => void
  } = {}
) {
  const context = useTrackActivityContext()

  // Aquí se podrían agregar efectos para manejar los callbacks
  // Por ahora, retornamos el estado y acciones básicas

  return {
    state: context.state,
    actions: context.actions,
    callbacks,
  }
}

// ============================================================================
// HOOKS DE DESARROLLO
// ============================================================================

export function useTrackActivityDebug() {
  const context = useTrackActivityContext()

  const debugInfo = {
    isMonitoring: context.state.isMonitoring,
    hasActiveRecord: !!context.state.activeRecord,
    activeRecordId: context.state.activeRecord?.id,
    activeRecordState: context.state.activeRecord?.state,
    lastInteractionTime: context.state.lastInteractionTime,
    isTabVisible: context.state.isTabVisible,
    isTabFocused: context.state.isTabFocused,
    configuration: context.state.configuration,
    stats: context.state.stats,
  }

  const debugActions = {
    ...context.actions,
    // Acciones adicionales para debugging
    logState: () => console.log('Track Activity State:', debugInfo),
    logActiveRecord: () =>
      console.log('Active Record:', context.state.activeRecord),
    logStats: () => console.log('Stats:', context.state.stats),
    logConfiguration: () =>
      console.log('Configuration:', context.state.configuration),
  }

  return {
    debugInfo,
    debugActions,
  }
}
