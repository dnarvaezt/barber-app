// ============================================================================
// TRACK ACTIVITY HOOK - Hook de React para el sistema de actividad
// ============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityState, TimeValueObject } from '../application'

import type {
  IActivityConfiguration,
  IActivityConfigurationService,
  IActivityEventService,
  IActivityRecord,
  IActivityRecordService,
} from '../application'

import { ActivityMonitor } from '../infrastructure'

// ============================================================================
// INTERFACES DEL HOOK
// ============================================================================

export interface UseTrackActivityOptions {
  autoStart?: boolean
  configuration?: Partial<IActivityConfiguration>
  onActivityStarted?: (record: IActivityRecord) => void
  onActivityUpdated?: (record: IActivityRecord) => void
  onActivityFinished?: (record: IActivityRecord) => void
  onActivitySuspended?: (record: IActivityRecord) => void
  onActivityResumed?: (record: IActivityRecord) => void
  onError?: (error: Error) => void
}

export interface TrackActivityState {
  isMonitoring: boolean
  activeRecord: IActivityRecord | null
  lastInteractionTime: Date | null
  isTabVisible: boolean
  isTabFocused: boolean
  configuration: IActivityConfiguration
  stats: {
    totalRecords: number
    totalActiveTime: TimeValueObject
    totalIdleTime: TimeValueObject
    averageSessionTime: TimeValueObject
    longestSession: TimeValueObject
    shortestSession: TimeValueObject
  }
}

export interface TrackActivityActions {
  startMonitoring: () => Promise<void>
  stopMonitoring: () => Promise<void>
  updateConfiguration: (
    config: Partial<IActivityConfiguration>
  ) => Promise<void>
  getActiveRecord: () => Promise<IActivityRecord | null>
  getAllRecords: () => Promise<IActivityRecord[]>
  clearRecords: () => Promise<void>
  getStats: () => Promise<TrackActivityState['stats']>
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useTrackActivity(
  recordService: IActivityRecordService,
  eventService: IActivityEventService,
  configService: IActivityConfigurationService,
  options: UseTrackActivityOptions = {}
): [TrackActivityState, TrackActivityActions] {
  const {
    autoStart = false,
    configuration = {},
    onActivityStarted,
    onActivityUpdated,
    onActivityFinished,
    onActivitySuspended,
    onActivityResumed,
    onError,
  } = options

  // ============================================================================
  // ESTADOS
  // ============================================================================

  const [state, setState] = useState<TrackActivityState>({
    isMonitoring: false,
    activeRecord: null,
    lastInteractionTime: null,
    isTabVisible: true,
    isTabFocused: true,
    configuration: configService.getConfiguration(),
    stats: {
      totalRecords: 0,
      totalActiveTime: TimeValueObject.zero(),
      totalIdleTime: TimeValueObject.zero(),
      averageSessionTime: TimeValueObject.zero(),
      longestSession: TimeValueObject.zero(),
      shortestSession: TimeValueObject.zero(),
    },
  })

  // ============================================================================
  // REFS
  // ============================================================================

  const monitorRef = useRef<ActivityMonitor | null>(null)
  const updateIntervalRef = useRef<number | null>(null)

  // ============================================================================
  // INICIALIZACIÓN
  // ============================================================================

  // Nota: el efecto de inicialización se declara al final del hook para evitar TDZ en dependencias

  // ============================================================================
  // CONFIGURACIÓN DE CALLBACKS
  // ============================================================================

  const setupMonitorCallbacks = useCallback(() => {
    if (!monitorRef.current) return

    // Aquí se podrían configurar callbacks específicos del monitor
    // Por ahora, usamos los callbacks del hook
  }, [])

  // ==========================================================================
  // FUNCIONES BASE NECESARIAS EN OTRAS CALLBACKS (para evitar TDZ)
  // ==========================================================================

  const getActiveRecord =
    useCallback(async (): Promise<IActivityRecord | null> => {
      try {
        return await recordService.getActiveRecord()
      } catch (error) {
        onError?.(error as Error)
        throw error
      }
    }, [recordService, onError])

  const startStateUpdateInterval = useCallback(() => {
    updateIntervalRef.current = window.setInterval(async () => {
      try {
        // Actualizar registro activo
        const activeRecord = await getActiveRecord()

        // Actualizar estado del monitor
        if (monitorRef.current) {
          setState(prev => ({
            ...prev,
            activeRecord,
            lastInteractionTime: monitorRef.current!.getLastInteractionTime(),
            isTabVisible: monitorRef.current!.isTabVisible(),
            isTabFocused: monitorRef.current!.isTabFocused(),
          }))
        }

        // Llamar callbacks si hay cambios
        if (activeRecord && activeRecord !== state.activeRecord) {
          if (
            activeRecord.state === ActivityState.ACTIVE &&
            state.activeRecord?.state !== ActivityState.ACTIVE
          ) {
            onActivityResumed?.(activeRecord)
          } else if (
            activeRecord.state === ActivityState.SUSPENDED &&
            state.activeRecord?.state === ActivityState.ACTIVE
          ) {
            onActivitySuspended?.(activeRecord)
          } else if (
            activeRecord.state === ActivityState.FINISHED &&
            state.activeRecord?.state !== ActivityState.FINISHED
          ) {
            onActivityFinished?.(activeRecord)
          } else {
            onActivityUpdated?.(activeRecord)
          }
        }
      } catch (error) {
        onError?.(error as Error)
      }
    }, 1000) // Actualizar cada segundo
  }, [
    getActiveRecord,
    onActivityResumed,
    onActivitySuspended,
    onActivityFinished,
    onActivityUpdated,
    onError,
    state.activeRecord,
  ])

  const stopStateUpdateInterval = useCallback(() => {
    if (updateIntervalRef.current !== null) {
      clearInterval(updateIntervalRef.current)
      updateIntervalRef.current = null
    }
  }, [])

  // ============================================================================
  // ACCIONES PRINCIPALES
  // ============================================================================

  const startMonitoring = useCallback(async () => {
    try {
      if (!monitorRef.current) {
        throw new Error('Monitor not initialized')
      }

      await monitorRef.current.startMonitoring()

      setState(prev => ({
        ...prev,
        isMonitoring: true,
      }))

      // Iniciar intervalo de actualización de estado
      startStateUpdateInterval()

      onActivityStarted?.(state.activeRecord!)
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }, [onActivityStarted, onError, state.activeRecord, startStateUpdateInterval])

  const stopMonitoring = useCallback(async () => {
    try {
      if (!monitorRef.current) {
        throw new Error('Monitor not initialized')
      }

      await monitorRef.current.stopMonitoring()

      setState(prev => ({
        ...prev,
        isMonitoring: false,
      }))

      // Detener intervalo de actualización
      stopStateUpdateInterval()

      onActivityFinished?.(state.activeRecord!)
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }, [onActivityFinished, onError, state.activeRecord, stopStateUpdateInterval])

  const updateConfiguration = useCallback(
    async (config: Partial<IActivityConfiguration>) => {
      try {
        if (!monitorRef.current) {
          throw new Error('Monitor not initialized')
        }

        await monitorRef.current.updateConfiguration(config)

        setState(prev => ({
          ...prev,
          configuration: monitorRef.current!.getConfiguration(),
        }))
      } catch (error) {
        onError?.(error as Error)
        throw error
      }
    },
    [onError]
  )

  const getAllRecords = useCallback(async (): Promise<IActivityRecord[]> => {
    try {
      // Asumiendo que el repositorio tiene un método findAll
      const repository = (recordService as any).repository
      if (repository && typeof repository.findAll === 'function') {
        return await repository.findAll()
      }
      return []
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }, [recordService, onError])

  const getStats = useCallback(async (): Promise<
    TrackActivityState['stats']
  > => {
    try {
      const repository = (recordService as any).repository
      if (repository && typeof repository.getStats === 'function') {
        const stats = await repository.getStats()
        return {
          totalRecords: stats.total,
          totalActiveTime: TimeValueObject.fromSeconds(
            (stats.averageSessionTime * stats.finished) / 1000
          ),
          totalIdleTime: TimeValueObject.fromSeconds(0), // Calcular basado en registros
          averageSessionTime: TimeValueObject.fromSeconds(
            stats.averageSessionTime / 1000
          ),
          longestSession: TimeValueObject.fromSeconds(
            stats.longestSession / 1000
          ),
          shortestSession: TimeValueObject.fromSeconds(
            stats.shortestSession / 1000
          ),
        }
      }
      return state.stats
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }, [recordService, onError, state.stats])

  // ============================================================================
  // MÉTODOS AUXILIARES
  // ============================================================================

  const loadInitialStats = useCallback(async () => {
    try {
      const stats = await getStats()
      setState(prev => ({
        ...prev,
        stats,
      }))
    } catch (error) {
      onError?.(error as Error)
    }
  }, [getStats, onError])

  const loadStats = useCallback(async () => {
    try {
      const stats = await getStats()
      setState(prev => ({
        ...prev,
        stats,
      }))
    } catch (error) {
      onError?.(error as Error)
    }
  }, [getStats, onError])

  const clearRecords = useCallback(async () => {
    try {
      const repository = (recordService as any).repository
      if (repository && typeof repository.clear === 'function') {
        await repository.clear()
        await loadStats()
      }
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }, [recordService, onError, loadStats])

  const cleanup = useCallback(() => {
    stopStateUpdateInterval()
    if (monitorRef.current && state.isMonitoring) {
      monitorRef.current.stopMonitoring()
    }
  }, [stopStateUpdateInterval, state.isMonitoring])

  // ============================================================================
  // INICIALIZACIÓN (declarado al final para evitar TDZ)
  // ============================================================================

  useEffect(() => {
    // Crear monitor
    monitorRef.current = new ActivityMonitor(
      recordService,
      eventService,
      configService,
      { ...configService.getConfiguration(), ...configuration }
    )

    // Configurar callbacks del monitor
    setupMonitorCallbacks()

    // Auto-iniciar si está configurado
    if (autoStart) {
      startMonitoring()
    }

    // Cargar estadísticas iniciales
    loadInitialStats()

    return () => {
      cleanup()
    }
  }, [
    autoStart,
    configService,
    configuration,
    eventService,
    recordService,
    setupMonitorCallbacks,
    startMonitoring,
    loadInitialStats,
    cleanup,
  ])

  // ============================================================================
  // RETORNO
  // ============================================================================

  const actions: TrackActivityActions = {
    startMonitoring,
    stopMonitoring,
    updateConfiguration,
    getActiveRecord,
    getAllRecords,
    clearRecords,
    getStats,
  }

  return [state, actions]
}
