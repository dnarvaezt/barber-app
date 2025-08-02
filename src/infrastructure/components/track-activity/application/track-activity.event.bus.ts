// ============================================================================
// TRACK ACTIVITY EVENT BUS - Bus de eventos específico para actividad
// ============================================================================

import type {
  IActivityEventBus,
  IActivityRecord,
  InteractionType,
} from './track-activity.model'

import {
  EventBus,
  EventFactory,
} from '../../../../application/core/events/event.bus'

// ============================================================================
// ACTIVITY EVENT BUS - Implementación del bus de eventos de actividad
// ============================================================================

export class ActivityEventBus implements IActivityEventBus {
  private eventBus: EventBus

  constructor() {
    this.eventBus = EventBus.getInstance()
  }

  async publishActivityStarted(record: IActivityRecord): Promise<void> {
    const event = EventFactory.create('activity.started', {
      recordId: record.id,
      eventType: record.startEventType,
      interactionType: record.lastInteractionType,
      startTime: record.startTime,
      minimumTime: record.minimumTime,
      activeTime: record.activeTime,
      idleTime: record.idleTime,
      totalTime: record.totalTime,
      isVisible: record.isVisible,
      isFocused: record.isFocused,
    })

    await this.eventBus.publish(event)
  }

  async publishActivityUpdated(record: IActivityRecord): Promise<void> {
    const event = EventFactory.create('activity.updated', {
      recordId: record.id,
      reviewTime: new Date(),
      activeTime: record.activeTime,
      idleTime: record.idleTime,
      totalTime: record.totalTime,
      lastInteractionTime: record.lastInteractionTime,
      lastInteractionType: record.lastInteractionType,
      isVisible: record.isVisible,
      isFocused: record.isFocused,
    })

    await this.eventBus.publish(event)
  }

  async publishActivityFinished(record: IActivityRecord): Promise<void> {
    const event = EventFactory.create('activity.finished', {
      recordId: record.id,
      endTime: record.endTime,
      finalActiveTime: record.activeTime,
      finalIdleTime: record.idleTime,
      finalTotalTime: record.totalTime,
      lastInteractionTime: record.lastInteractionTime,
      lastInteractionType: record.lastInteractionType,
      isVisible: record.isVisible,
      isFocused: record.isFocused,
      finished: true,
    })

    await this.eventBus.publish(event)
  }

  async publishActivitySuspended(record: IActivityRecord): Promise<void> {
    const event = EventFactory.create('activity.suspended', {
      recordId: record.id,
      suspendTime: new Date(),
      activeTime: record.activeTime,
      idleTime: record.idleTime,
      totalTime: record.totalTime,
      lastInteractionTime: record.lastInteractionTime,
      lastInteractionType: record.lastInteractionType,
      isVisible: record.isVisible,
      isFocused: record.isFocused,
    })

    await this.eventBus.publish(event)
  }

  async publishActivityResumed(record: IActivityRecord): Promise<void> {
    const event = EventFactory.create('activity.resumed', {
      recordId: record.id,
      resumeTime: new Date(),
      activeTime: record.activeTime,
      idleTime: record.idleTime,
      totalTime: record.totalTime,
      lastInteractionTime: record.lastInteractionTime,
      lastInteractionType: record.lastInteractionType,
      isVisible: record.isVisible,
      isFocused: record.isFocused,
    })

    await this.eventBus.publish(event)
  }
}

// ============================================================================
// ACTIVITY EVENT HANDLERS - Manejadores específicos de eventos de actividad
// ============================================================================

export class ActivityEventHandler {
  constructor(private eventBus: EventBus = EventBus.getInstance()) {}

  handleActivityStarted = async (event: any): Promise<void> => {
    console.log('🟢 Activity started:', {
      recordId: event.payload.recordId,
      eventType: event.payload.eventType,
      startTime: event.payload.startTime,
    })

    // Aquí se pueden agregar acciones específicas cuando inicia una actividad
    // Por ejemplo: enviar analytics, notificar a otros componentes, etc.
  }

  handleActivityUpdated = async (event: any): Promise<void> => {
    console.log('🔄 Activity updated:', {
      recordId: event.payload.recordId,
      activeTime: event.payload.activeTime.seconds,
      idleTime: event.payload.idleTime.seconds,
      totalTime: event.payload.totalTime.seconds,
    })

    // Aquí se pueden agregar acciones específicas cuando se actualiza una actividad
    // Por ejemplo: actualizar UI, enviar métricas, etc.
  }

  handleActivityFinished = async (event: any): Promise<void> => {
    console.log('🔴 Activity finished:', {
      recordId: event.payload.recordId,
      finalTotalTime: event.payload.finalTotalTime.seconds,
      endTime: event.payload.endTime,
    })

    // Aquí se pueden agregar acciones específicas cuando finaliza una actividad
    // Por ejemplo: guardar en base de datos, enviar reporte, etc.
  }

  handleActivitySuspended = async (event: any): Promise<void> => {
    console.log('⏸️ Activity suspended:', {
      recordId: event.payload.recordId,
      suspendTime: event.payload.suspendTime,
    })

    // Aquí se pueden agregar acciones específicas cuando se suspende una actividad
    // Por ejemplo: pausar timers, notificar al usuario, etc.
  }

  handleActivityResumed = async (event: any): Promise<void> => {
    console.log('▶️ Activity resumed:', {
      recordId: event.payload.recordId,
      resumeTime: event.payload.resumeTime,
    })

    // Aquí se pueden agregar acciones específicas cuando se reanuda una actividad
    // Por ejemplo: reanudar timers, actualizar estado, etc.
  }

  // ============================================================================
  // MÉTODO DE REGISTRO DE HANDLERS
  // ============================================================================

  registerHandlers(): void {
    this.eventBus.subscribe('activity.started', {
      handle: this.handleActivityStarted,
    })
    this.eventBus.subscribe('activity.updated', {
      handle: this.handleActivityUpdated,
    })
    this.eventBus.subscribe('activity.finished', {
      handle: this.handleActivityFinished,
    })
    this.eventBus.subscribe('activity.suspended', {
      handle: this.handleActivitySuspended,
    })
    this.eventBus.subscribe('activity.resumed', {
      handle: this.handleActivityResumed,
    })
  }

  unregisterHandlers(): void {
    this.eventBus.unsubscribe('activity.started', {
      handle: this.handleActivityStarted,
    })
    this.eventBus.unsubscribe('activity.updated', {
      handle: this.handleActivityUpdated,
    })
    this.eventBus.unsubscribe('activity.finished', {
      handle: this.handleActivityFinished,
    })
    this.eventBus.unsubscribe('activity.suspended', {
      handle: this.handleActivitySuspended,
    })
    this.eventBus.unsubscribe('activity.resumed', {
      handle: this.handleActivityResumed,
    })
  }
}

// ============================================================================
// ACTIVITY EVENT TYPES - Tipos de eventos específicos de actividad
// ============================================================================

export const ActivityEventTypes = {
  // Eventos de ciclo de vida
  ACTIVITY_STARTED: 'activity.started',
  ACTIVITY_UPDATED: 'activity.updated',
  ACTIVITY_FINISHED: 'activity.finished',
  ACTIVITY_SUSPENDED: 'activity.suspended',
  ACTIVITY_RESUMED: 'activity.resumed',

  // Eventos de interacción
  USER_INTERACTION_DETECTED: 'user.interaction.detected',
  IDLE_TIMEOUT_REACHED: 'idle.timeout.reached',
  TAB_VISIBILITY_CHANGED: 'tab.visibility.changed',
  TAB_FOCUS_CHANGED: 'tab.focus.changed',

  // Eventos de configuración
  CONFIGURATION_UPDATED: 'activity.configuration.updated',
  MONITORING_STARTED: 'activity.monitoring.started',
  MONITORING_STOPPED: 'activity.monitoring.stopped',

  // Eventos de error
  ACTIVITY_ERROR: 'activity.error',
  VALIDATION_FAILED: 'activity.validation.failed',
} as const

// ============================================================================
// ACTIVITY EVENT FACTORY - Factory para eventos de actividad
// ============================================================================

export class ActivityEventFactory {
  static createUserInteractionEvent(
    recordId: string,
    interactionType: InteractionType,
    payload?: Record<string, any>
  ) {
    return EventFactory.create(ActivityEventTypes.USER_INTERACTION_DETECTED, {
      recordId,
      interactionType,
      timestamp: new Date(),
      payload,
    })
  }

  static createIdleTimeoutEvent(recordId: string, idleTime: any) {
    return EventFactory.create(ActivityEventTypes.IDLE_TIMEOUT_REACHED, {
      recordId,
      idleTime,
      timestamp: new Date(),
    })
  }

  static createTabVisibilityEvent(isVisible: boolean) {
    return EventFactory.create(ActivityEventTypes.TAB_VISIBILITY_CHANGED, {
      isVisible,
      timestamp: new Date(),
    })
  }

  static createTabFocusEvent(isFocused: boolean) {
    return EventFactory.create(ActivityEventTypes.TAB_FOCUS_CHANGED, {
      isFocused,
      timestamp: new Date(),
    })
  }

  static createConfigurationUpdatedEvent(config: any) {
    return EventFactory.create(ActivityEventTypes.CONFIGURATION_UPDATED, {
      config,
      timestamp: new Date(),
    })
  }

  static createMonitoringStartedEvent() {
    return EventFactory.create(ActivityEventTypes.MONITORING_STARTED, {
      timestamp: new Date(),
    })
  }

  static createMonitoringStoppedEvent() {
    return EventFactory.create(ActivityEventTypes.MONITORING_STOPPED, {
      timestamp: new Date(),
    })
  }

  static createErrorEvent(error: Error, context?: Record<string, any>) {
    return EventFactory.create(ActivityEventTypes.ACTIVITY_ERROR, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
      timestamp: new Date(),
    })
  }

  static createValidationFailedEvent(
    errors: Record<string, string>,
    context?: Record<string, any>
  ) {
    return EventFactory.create(ActivityEventTypes.VALIDATION_FAILED, {
      errors,
      context,
      timestamp: new Date(),
    })
  }
}
