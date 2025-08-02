// ============================================================================
// TRACK ACTIVITY VALIDATOR - Validaciones del dominio
// ============================================================================

import {
  ActivityState,
  EventType,
  InteractionType,
  TimeValueObject,
} from './track-activity.model'

import type {
  IActivityConfiguration,
  IActivityEvent,
  IActivityRecord,
  IActivityValidator,
  ValidationResult,
} from './track-activity.model'

// ============================================================================
// ACTIVITY VALIDATOR - Validador principal
// ============================================================================

export class ActivityValidator implements IActivityValidator {
  validateRecord(record: IActivityRecord): ValidationResult {
    const errors: Record<string, string> = {}

    // Validar ID
    if (!record.id || typeof record.id !== 'string') {
      errors.id = 'Record ID is required and must be a string'
    }

    // Validar tiempos
    if (!this.isValidTimeValue(record.minimumTime)) {
      errors.minimumTime = 'Invalid minimum time value'
    }

    if (!this.isValidTimeValue(record.activeTime)) {
      errors.activeTime = 'Invalid active time value'
    }

    if (!this.isValidTimeValue(record.idleTime)) {
      errors.idleTime = 'Invalid idle time value'
    }

    if (!this.isValidTimeValue(record.totalTime)) {
      errors.totalTime = 'Invalid total time value'
    }

    // Validar estado
    if (!Object.values(ActivityState).includes(record.state)) {
      errors.state = 'Invalid activity state'
    }

    // Validar fechas
    if (
      !(record.lastInteractionTime instanceof Date) ||
      isNaN(record.lastInteractionTime.getTime())
    ) {
      errors.lastInteractionTime = 'Invalid last interaction time'
    }

    if (
      !(record.startTime instanceof Date) ||
      isNaN(record.startTime.getTime())
    ) {
      errors.startTime = 'Invalid start time'
    }

    if (
      record.endTime &&
      (!(record.endTime instanceof Date) || isNaN(record.endTime.getTime()))
    ) {
      errors.endTime = 'Invalid end time'
    }

    // Validar tipos de evento e interacción
    if (!Object.values(EventType).includes(record.startEventType)) {
      errors.startEventType = 'Invalid start event type'
    }

    if (
      record.lastInteractionType &&
      !Object.values(InteractionType).includes(record.lastInteractionType)
    ) {
      errors.lastInteractionType = 'Invalid last interaction type'
    }

    // Validar booleanos
    if (typeof record.isVisible !== 'boolean') {
      errors.isVisible = 'isVisible must be a boolean'
    }

    if (typeof record.isFocused !== 'boolean') {
      errors.isFocused = 'isFocused must be a boolean'
    }

    // Validar coherencia de datos
    if (record.state === ActivityState.FINISHED && !record.endTime) {
      errors.endTime = 'End time is required for finished records'
    }

    if (record.state === ActivityState.ACTIVE && record.endTime) {
      errors.endTime = 'Active records should not have an end time'
    }

    // Validar que el tiempo total sea coherente
    const calculatedTotal = record.minimumTime
      .add(record.activeTime)
      .add(record.idleTime)
    if (!calculatedTotal.equals(record.totalTime)) {
      errors.totalTime = 'Total time does not match the sum of component times'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  validateEvent(event: IActivityEvent): ValidationResult {
    const errors: Record<string, string> = {}

    // Validar tipo de evento
    if (!Object.values(EventType).includes(event.type)) {
      errors.type = 'Invalid event type'
    }

    // Validar tipo de interacción (si está presente)
    if (
      event.interactionType &&
      !Object.values(InteractionType).includes(event.interactionType)
    ) {
      errors.interactionType = 'Invalid interaction type'
    }

    // Validar timestamp
    if (
      !(event.timestamp instanceof Date) ||
      isNaN(event.timestamp.getTime())
    ) {
      errors.timestamp = 'Invalid timestamp'
    }

    // Validar que el timestamp no sea futuro
    if (event.timestamp > new Date()) {
      errors.timestamp = 'Timestamp cannot be in the future'
    }

    // Validar payload (si está presente)
    if (event.payload && typeof event.payload !== 'object') {
      errors.payload = 'Payload must be an object'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  validateConfiguration(config: IActivityConfiguration): ValidationResult {
    const errors: Record<string, string> = {}

    // Validar tiempos
    if (!this.isValidTimeValue(config.minimumTime)) {
      errors.minimumTime = 'Invalid minimum time value'
    }

    if (!this.isValidTimeValue(config.maxIdleTime)) {
      errors.maxIdleTime = 'Invalid max idle time value'
    }

    if (!this.isValidTimeValue(config.updateInterval)) {
      errors.updateInterval = 'Invalid update interval value'
    }

    // Validar que maxIdleTime sea mayor que minimumTime
    if (config.maxIdleTime.isLessThan(config.minimumTime)) {
      errors.maxIdleTime = 'Max idle time must be greater than minimum time'
    }

    // Validar que updateInterval sea razonable
    if (config.updateInterval.milliseconds < 100) {
      errors.updateInterval = 'Update interval must be at least 100ms'
    }

    if (config.updateInterval.milliseconds > 60000) {
      // 1 minuto
      errors.updateInterval = 'Update interval must be less than 1 minute'
    }

    // Validar arrays de eventos
    if (!Array.isArray(config.enabledEvents)) {
      errors.enabledEvents = 'Enabled events must be an array'
    } else if (config.enabledEvents.length === 0) {
      errors.enabledEvents = 'At least one event type must be enabled'
    } else {
      for (const eventType of config.enabledEvents) {
        if (!Object.values(EventType).includes(eventType)) {
          errors.enabledEvents = `Invalid event type: ${eventType}`
          break
        }
      }
    }

    // Validar arrays de interacciones
    if (!Array.isArray(config.enabledInteractions)) {
      errors.enabledInteractions = 'Enabled interactions must be an array'
    } else if (config.enabledInteractions.length === 0) {
      errors.enabledInteractions =
        'At least one interaction type must be enabled'
    } else {
      for (const interactionType of config.enabledInteractions) {
        if (!Object.values(InteractionType).includes(interactionType)) {
          errors.enabledInteractions = `Invalid interaction type: ${interactionType}`
          break
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  private isValidTimeValue(timeValue: TimeValueObject): boolean {
    return (
      timeValue instanceof TimeValueObject &&
      typeof timeValue.milliseconds === 'number' &&
      !isNaN(timeValue.milliseconds) &&
      timeValue.milliseconds >= 0
    )
  }
}

// ============================================================================
// VALIDATION HELPERS - Funciones auxiliares de validación
// ============================================================================

export class ValidationHelpers {
  static isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }

  static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime())
  }

  static isFutureDate(date: Date): boolean {
    return date > new Date()
  }

  static isPastDate(date: Date): boolean {
    return date < new Date()
  }

  static isValidTimeRange(startTime: Date, endTime: Date): boolean {
    return startTime < endTime
  }

  static isValidActivityState(state: string): boolean {
    return Object.values(ActivityState).includes(state as ActivityState)
  }

  static isValidEventType(eventType: string): boolean {
    return Object.values(EventType).includes(eventType as EventType)
  }

  static isValidInteractionType(interactionType: string): boolean {
    return Object.values(InteractionType).includes(
      interactionType as InteractionType
    )
  }
}
