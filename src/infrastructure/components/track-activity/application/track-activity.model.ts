// ============================================================================
// TRACK ACTIVITY DOMAIN MODEL - Arquitectura Hexagonal
// ============================================================================

import type { IEntity } from '../../../../application/core/domain/entity.interface'

// ============================================================================
// VALUE OBJECTS - Objetos de valor para tiempos y estados
// ============================================================================

export interface TimeValue {
  readonly milliseconds: number
  readonly seconds: number
  readonly minutes: number
}

export class TimeValueObject implements TimeValue {
  constructor(public readonly milliseconds: number) {}

  get seconds(): number {
    return Math.floor(this.milliseconds / 1000)
  }

  get minutes(): number {
    return Math.floor(this.seconds / 60)
  }

  add(other: TimeValue): TimeValueObject {
    return new TimeValueObject(this.milliseconds + other.milliseconds)
  }

  subtract(other: TimeValue): TimeValueObject {
    return new TimeValueObject(
      Math.max(0, this.milliseconds - other.milliseconds)
    )
  }

  isGreaterThan(other: TimeValue): boolean {
    return this.milliseconds > other.milliseconds
  }

  isLessThan(other: TimeValue): boolean {
    return this.milliseconds < other.milliseconds
  }

  equals(other: TimeValue): boolean {
    return this.milliseconds === other.milliseconds
  }

  static fromSeconds(seconds: number): TimeValueObject {
    return new TimeValueObject(seconds * 1000)
  }

  static fromMinutes(minutes: number): TimeValueObject {
    return new TimeValueObject(minutes * 60 * 1000)
  }

  static zero(): TimeValueObject {
    return new TimeValueObject(0)
  }
}

// ============================================================================
// ENUMERATIONS - Estados y tipos de eventos
// ============================================================================

export enum ActivityState {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  FINISHED = 'finished',
}

export enum EventType {
  USER_INTERACTION = 'user_interaction',
  PAGE_LOAD = 'page_load',
  SCRIPT_REQUEST = 'script_request',
  TAB_VISIBILITY_CHANGE = 'tab_visibility_change',
  TAB_FOCUS_CHANGE = 'tab_focus_change',
  IDLE_TIMEOUT = 'idle_timeout',
}

export enum InteractionType {
  CLICK = 'click',
  SCROLL = 'scroll',
  KEY_PRESS = 'key_press',
  MOUSE_MOVE = 'mouse_move',
  TOUCH = 'touch',
  FORM_INPUT = 'form_input',
  FOCUS = 'focus',
  BLUR = 'blur',
}

// ============================================================================
// DOMAIN ENTITIES - Entidades principales del dominio
// ============================================================================

export interface IActivityRecord extends IEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  minimumTime: TimeValueObject
  activeTime: TimeValueObject
  idleTime: TimeValueObject
  totalTime: TimeValueObject
  state: ActivityState
  lastInteractionTime: Date
  lastInteractionType: InteractionType | null
  startEventType: EventType
  startTime: Date
  endTime?: Date
  isVisible: boolean
  isFocused: boolean
}

export interface IActivityEvent {
  type: EventType
  interactionType?: InteractionType
  timestamp: Date
  payload?: Record<string, any>
}

export interface IActivityConfiguration {
  minimumTime: TimeValueObject
  maxIdleTime: TimeValueObject
  updateInterval: TimeValueObject
  enabledEvents: EventType[]
  enabledInteractions: InteractionType[]
}

// ============================================================================
// DOMAIN SERVICES - Servicios de dominio
// ============================================================================

export interface IActivityRecordService {
  startRecord(
    eventType: EventType,
    interactionType?: InteractionType
  ): Promise<IActivityRecord>
  updateRecord(
    recordId: string,
    event: IActivityEvent
  ): Promise<IActivityRecord>
  finishRecord(recordId: string, reason: EventType): Promise<IActivityRecord>
  suspendRecord(recordId: string, reason: EventType): Promise<IActivityRecord>
  resumeRecord(recordId: string): Promise<IActivityRecord>
  getActiveRecord(): Promise<IActivityRecord | null>
  validateRecord(record: IActivityRecord): boolean
  calculateTotalTime(record: IActivityRecord): TimeValueObject
}

export interface IActivityEventService {
  createEvent(
    type: EventType,
    interactionType?: InteractionType,
    payload?: Record<string, any>
  ): IActivityEvent
  isValidEvent(event: IActivityEvent): boolean
  shouldStartRecord(event: IActivityEvent): boolean
  shouldSuspendRecord(event: IActivityEvent): boolean
  shouldFinishRecord(event: IActivityEvent): boolean
}

export interface IActivityConfigurationService {
  getConfiguration(): IActivityConfiguration
  updateConfiguration(config: Partial<IActivityConfiguration>): Promise<void>
  validateConfiguration(config: IActivityConfiguration): boolean
  isEventEnabled(eventType: EventType): boolean
  isInteractionEnabled(interactionType: InteractionType): boolean
}

// ============================================================================
// REPOSITORY INTERFACES - Patrón Repository
// ============================================================================

export interface IActivityRecordRepository {
  create(
    record: Omit<IActivityRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IActivityRecord>
  update(id: string, record: Partial<IActivityRecord>): Promise<IActivityRecord>
  findById(id: string): Promise<IActivityRecord | null>
  findActive(): Promise<IActivityRecord | null>
  findAll(): Promise<IActivityRecord[]>
  delete(id: string): Promise<boolean>
  clear(): Promise<void>
}

// ============================================================================
// EVENT INTERFACES - Patrón Observer
// ============================================================================

export interface IActivityEventBus {
  publishActivityStarted(record: IActivityRecord): Promise<void>
  publishActivityUpdated(record: IActivityRecord): Promise<void>
  publishActivityFinished(record: IActivityRecord): Promise<void>
  publishActivitySuspended(record: IActivityRecord): Promise<void>
  publishActivityResumed(record: IActivityRecord): Promise<void>
}

// ============================================================================
// VALIDATION INTERFACES - Patrón Validator
// ============================================================================

export interface IActivityValidator {
  validateRecord(record: IActivityRecord): ValidationResult
  validateEvent(event: IActivityEvent): ValidationResult
  validateConfiguration(config: IActivityConfiguration): ValidationResult
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// ============================================================================
// FACTORY INTERFACES - Patrón Factory
// ============================================================================

export interface IActivityRecordFactory {
  createRecord(
    eventType: EventType,
    interactionType?: InteractionType,
    config?: IActivityConfiguration
  ): IActivityRecord
  createFromData(data: Partial<IActivityRecord>): IActivityRecord
}

export interface IActivityEventFactory {
  createEvent(
    type: EventType,
    interactionType?: InteractionType,
    payload?: Record<string, any>
  ): IActivityEvent
  createFromDOMEvent(domEvent: Event): IActivityEvent | null
}

// ============================================================================
// COMMAND INTERFACES - Patrón Command
// ============================================================================

export interface IStartActivityCommand {
  execute(
    eventType: EventType,
    interactionType?: InteractionType
  ): Promise<IActivityRecord>
}

export interface IUpdateActivityCommand {
  execute(recordId: string, event: IActivityEvent): Promise<IActivityRecord>
}

export interface IFinishActivityCommand {
  execute(recordId: string, reason: EventType): Promise<IActivityRecord>
}

export interface ISuspendActivityCommand {
  execute(recordId: string, reason: EventType): Promise<IActivityRecord>
}

// ============================================================================
// QUERY INTERFACES - Patrón Query
// ============================================================================

export interface IGetActiveRecordQuery {
  execute(): Promise<IActivityRecord | null>
}

export interface IGetActivityHistoryQuery {
  execute(limit?: number): Promise<IActivityRecord[]>
}

export interface IGetActivityStatsQuery {
  execute(): Promise<ActivityStats>
}

export interface ActivityStats {
  totalRecords: number
  totalActiveTime: TimeValueObject
  totalIdleTime: TimeValueObject
  averageSessionTime: TimeValueObject
  longestSession: TimeValueObject
  shortestSession: TimeValueObject
}

// ============================================================================
// EXCEPTIONS - Excepciones del dominio
// ============================================================================

export class ActivityRecordException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ActivityRecordException'
  }
}

export class ActivityConfigurationException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ActivityConfigurationException'
  }
}

export class ActivityEventException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ActivityEventException'
  }
}

// ============================================================================
// CONSTANTS - Constantes del dominio
// ============================================================================

export const DEFAULT_ACTIVITY_CONFIGURATION: IActivityConfiguration = {
  minimumTime: TimeValueObject.fromSeconds(5),
  maxIdleTime: TimeValueObject.fromMinutes(30),
  updateInterval: TimeValueObject.fromSeconds(1),
  enabledEvents: [
    EventType.USER_INTERACTION,
    EventType.PAGE_LOAD,
    EventType.SCRIPT_REQUEST,
    EventType.TAB_VISIBILITY_CHANGE,
    EventType.TAB_FOCUS_CHANGE,
    EventType.IDLE_TIMEOUT,
  ],
  enabledInteractions: [
    InteractionType.CLICK,
    InteractionType.SCROLL,
    InteractionType.KEY_PRESS,
    InteractionType.MOUSE_MOVE,
    InteractionType.TOUCH,
    InteractionType.FORM_INPUT,
    InteractionType.FOCUS,
    InteractionType.BLUR,
  ],
}
