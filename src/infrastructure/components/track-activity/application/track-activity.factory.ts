// ============================================================================
// TRACK ACTIVITY FACTORIES - Patrón Factory para creación de objetos
// ============================================================================

import {
  ActivityState,
  DEFAULT_ACTIVITY_CONFIGURATION,
  EventType,
  InteractionType,
  TimeValueObject,
} from './track-activity.model'

import type {
  IActivityConfiguration,
  IActivityEvent,
  IActivityEventFactory,
  IActivityRecord,
  IActivityRecordFactory,
} from './track-activity.model'

import { ActivityConfigurationInvalidException } from './track-activity.exceptions'

// ============================================================================
// ACTIVITY RECORD FACTORY - Factory para registros de actividad
// ============================================================================

export class ActivityRecordFactory implements IActivityRecordFactory {
  createRecord(
    eventType: EventType,
    interactionType?: InteractionType,
    config: IActivityConfiguration = DEFAULT_ACTIVITY_CONFIGURATION
  ): IActivityRecord {
    const now = new Date()
    const id = this.generateId()

    return {
      id,
      minimumTime: config.minimumTime,
      activeTime: TimeValueObject.zero(),
      idleTime: TimeValueObject.zero(),
      totalTime: config.minimumTime,
      state: ActivityState.ACTIVE,
      lastInteractionTime: now,
      lastInteractionType: interactionType || null,
      startEventType: eventType,
      startTime: now,
      isVisible: true,
      isFocused: true,
      createdAt: now,
      updatedAt: now,
    }
  }

  createFromData(data: Partial<IActivityRecord>): IActivityRecord {
    const now = new Date()
    const id = data.id || this.generateId()

    return {
      id,
      minimumTime: data.minimumTime || TimeValueObject.zero(),
      activeTime: data.activeTime || TimeValueObject.zero(),
      idleTime: data.idleTime || TimeValueObject.zero(),
      totalTime: data.totalTime || TimeValueObject.zero(),
      state: data.state || ActivityState.INACTIVE,
      lastInteractionTime: data.lastInteractionTime || now,
      lastInteractionType: data.lastInteractionType || null,
      startEventType: data.startEventType || EventType.USER_INTERACTION,
      startTime: data.startTime || now,
      endTime: data.endTime,
      isVisible: data.isVisible ?? true,
      isFocused: data.isFocused ?? true,
      createdAt: data.createdAt || now,
      updatedAt: now,
    }
  }

  private generateId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// ============================================================================
// ACTIVITY EVENT FACTORY - Factory para eventos de actividad
// ============================================================================

export class ActivityEventFactory implements IActivityEventFactory {
  createEvent(
    type: EventType,
    interactionType?: InteractionType,
    payload?: Record<string, any>
  ): IActivityEvent {
    return {
      type,
      interactionType: interactionType || undefined,
      timestamp: new Date(),
      payload,
    }
  }

  createFromDOMEvent(domEvent: Event): IActivityEvent | null {
    const eventType = this.mapDOMEventToEventType(domEvent)
    const interactionType = this.mapDOMEventToInteractionType(domEvent)

    if (!eventType) {
      return null
    }

    return {
      type: eventType,
      interactionType: interactionType || undefined,
      timestamp: new Date(),
      payload: this.extractEventPayload(domEvent),
    }
  }

  private mapDOMEventToEventType(domEvent: Event): EventType | null {
    switch (domEvent.type) {
      case 'click':
      case 'mousedown':
      case 'mouseup':
      case 'keydown':
      case 'keyup':
      case 'input':
      case 'change':
      case 'focus':
      case 'blur':
      case 'scroll':
      case 'touchstart':
      case 'touchmove':
      case 'touchend':
        return EventType.USER_INTERACTION

      case 'visibilitychange':
        return EventType.TAB_VISIBILITY_CHANGE

      case 'focusin':
      case 'focusout':
        return EventType.TAB_FOCUS_CHANGE

      default:
        return null
    }
  }

  private mapDOMEventToInteractionType(
    domEvent: Event
  ): InteractionType | null {
    switch (domEvent.type) {
      case 'click':
      case 'mousedown':
      case 'mouseup':
        return InteractionType.CLICK

      case 'keydown':
      case 'keyup':
        return InteractionType.KEY_PRESS

      case 'input':
      case 'change':
        return InteractionType.FORM_INPUT

      case 'focus':
      case 'focusin':
        return InteractionType.FOCUS

      case 'blur':
      case 'focusout':
        return InteractionType.BLUR

      case 'scroll':
        return InteractionType.SCROLL

      case 'touchstart':
      case 'touchmove':
      case 'touchend':
        return InteractionType.TOUCH

      case 'mousemove':
        return InteractionType.MOUSE_MOVE

      default:
        return null
    }
  }

  private extractEventPayload(domEvent: Event): Record<string, any> {
    const payload: Record<string, any> = {
      eventType: domEvent.type,
      target: domEvent.target ? (domEvent.target as HTMLElement).tagName : null,
      timestamp: domEvent.timeStamp,
    }

    // Extraer información específica según el tipo de evento
    if (domEvent instanceof KeyboardEvent) {
      payload.key = domEvent.key
      payload.code = domEvent.code
      payload.ctrlKey = domEvent.ctrlKey
      payload.shiftKey = domEvent.shiftKey
      payload.altKey = domEvent.altKey
      payload.metaKey = domEvent.metaKey
    }

    if (domEvent instanceof MouseEvent) {
      payload.clientX = domEvent.clientX
      payload.clientY = domEvent.clientY
      payload.button = domEvent.button
    }

    if (domEvent instanceof TouchEvent) {
      payload.touches = domEvent.touches.length
    }

    if (domEvent instanceof FocusEvent) {
      payload.relatedTarget = domEvent.relatedTarget
    }

    return payload
  }
}

// ============================================================================
// ACTIVITY CONFIGURATION FACTORY - Factory para configuraciones
// ============================================================================

export class ActivityConfigurationFactory {
  static createDefault(): IActivityConfiguration {
    return { ...DEFAULT_ACTIVITY_CONFIGURATION }
  }

  static createFromPartial(
    partial: Partial<IActivityConfiguration>
  ): IActivityConfiguration {
    const config = { ...DEFAULT_ACTIVITY_CONFIGURATION, ...partial }

    // Validar configuración
    if (config.maxIdleTime.isLessThan(config.minimumTime)) {
      throw new ActivityConfigurationInvalidException(
        'Max idle time must be greater than minimum time'
      )
    }

    if (config.updateInterval.milliseconds < 100) {
      throw new ActivityConfigurationInvalidException(
        'Update interval must be at least 100ms'
      )
    }

    return config
  }

  static createForDevelopment(): IActivityConfiguration {
    return this.createFromPartial({
      minimumTime: TimeValueObject.fromSeconds(2),
      maxIdleTime: TimeValueObject.fromMinutes(5),
      updateInterval: TimeValueObject.fromSeconds(1),
    })
  }

  static createForProduction(): IActivityConfiguration {
    return this.createFromPartial({
      minimumTime: TimeValueObject.fromSeconds(10),
      maxIdleTime: TimeValueObject.fromMinutes(60),
      updateInterval: TimeValueObject.fromSeconds(5),
    })
  }

  static createForTesting(): IActivityConfiguration {
    return this.createFromPartial({
      minimumTime: TimeValueObject.fromSeconds(1),
      maxIdleTime: TimeValueObject.fromMinutes(1),
      updateInterval: TimeValueObject.fromSeconds(0.5),
    })
  }
}

// ============================================================================
// TIME VALUE FACTORY - Factory para objetos de tiempo
// ============================================================================

export class TimeValueFactory {
  static fromMilliseconds(milliseconds: number): TimeValueObject {
    if (milliseconds < 0) {
      throw new Error('Time value cannot be negative')
    }
    return new TimeValueObject(milliseconds)
  }

  static fromSeconds(seconds: number): TimeValueObject {
    return this.fromMilliseconds(seconds * 1000)
  }

  static fromMinutes(minutes: number): TimeValueObject {
    return this.fromSeconds(minutes * 60)
  }

  static fromHours(hours: number): TimeValueObject {
    return this.fromMinutes(hours * 60)
  }

  static zero(): TimeValueObject {
    return new TimeValueObject(0)
  }

  static parse(timeString: string): TimeValueObject {
    const match = timeString.match(/^(\d+)(ms|s|m|h)$/)
    if (!match) {
      throw new Error(`Invalid time format: ${timeString}`)
    }

    const value = parseInt(match[1], 10)
    const unit = match[2]

    switch (unit) {
      case 'ms':
        return this.fromMilliseconds(value)
      case 's':
        return this.fromSeconds(value)
      case 'm':
        return this.fromMinutes(value)
      case 'h':
        return this.fromHours(value)
      default:
        throw new Error(`Unknown time unit: ${unit}`)
    }
  }
}
