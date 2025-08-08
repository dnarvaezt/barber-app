// ============================================================================
// TRACK ACTIVITY SERVICES - Servicios de aplicación
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
  IActivityConfigurationService,
  IActivityEvent,
  IActivityEventBus,
  IActivityEventService,
  IActivityRecord,
  IActivityRecordRepository,
  IActivityRecordService,
  IActivityValidator,
} from './track-activity.model'

import {
  ActivityConfigurationInvalidException,
  ActivityEventInvalidException,
  ActivityRecordInvalidStateException,
  ActivityRecordNotFoundException,
} from './track-activity.exceptions'

import { ActivityRecordFactory } from './track-activity.factory'

// ============================================================================
// ACTIVITY RECORD SERVICE - Servicio principal de registros
// ============================================================================

export class ActivityRecordService implements IActivityRecordService {
  private readonly recordFactory: ActivityRecordFactory

  constructor(
    private readonly repository: IActivityRecordRepository,
    private readonly eventBus: IActivityEventBus,
    private readonly validator: IActivityValidator,
    private readonly configuration: IActivityConfiguration = DEFAULT_ACTIVITY_CONFIGURATION
  ) {
    this.recordFactory = new ActivityRecordFactory()
  }

  async startRecord(
    eventType: EventType,
    interactionType?: InteractionType
  ): Promise<IActivityRecord> {
    // Verificar si ya existe un registro activo
    const activeRecord = await this.getActiveRecord()
    if (activeRecord) {
      throw new ActivityRecordInvalidStateException(
        'active',
        'inactive',
        'Cannot start new record while another is active'
      )
    }

    // Crear nuevo registro usando el factory
    const record = this.recordFactory.createRecord(
      eventType,
      interactionType,
      this.configuration
    )

    // Validar registro antes de crear
    const validation = this.validator.validateRecord(record)
    if (!validation.isValid) {
      throw new ActivityConfigurationInvalidException(
        `Invalid record: ${Object.values(validation.errors).join(', ')}`
      )
    }

    const createdRecord = await this.repository.create(record)

    // Publicar evento de inicio
    await this.eventBus.publishActivityStarted(createdRecord)

    return createdRecord
  }

  async updateRecord(
    recordId: string,
    event: IActivityEvent
  ): Promise<IActivityRecord> {
    const record = await this.repository.findById(recordId)
    if (!record) {
      throw new ActivityRecordNotFoundException(recordId)
    }

    if (record.state !== ActivityState.ACTIVE) {
      throw new ActivityRecordInvalidStateException(
        recordId,
        record.state,
        ActivityState.ACTIVE
      )
    }

    // Validar evento
    const eventValidation = this.validator.validateEvent(event)
    if (!eventValidation.isValid) {
      throw new ActivityEventInvalidException(
        event.type,
        Object.values(eventValidation.errors).join(', ')
      )
    }

    // Calcular tiempos actualizados
    const now = new Date()
    const timeSinceLastInteraction =
      now.getTime() - record.lastInteractionTime.getTime()
    const idleTime = TimeValueObject.fromSeconds(
      timeSinceLastInteraction / 1000
    )

    // Verificar si se debe finalizar por inactividad
    if (idleTime.isGreaterThan(this.configuration.maxIdleTime)) {
      return await this.finishRecord(recordId, EventType.IDLE_TIMEOUT)
    }

    // Actualizar tiempos
    const shouldUpdateInteraction =
      !event.interactionType ||
      this.configuration.enabledInteractions.includes(event.interactionType)
    const updatedRecord = await this.repository.update(recordId, {
      activeTime: event.interactionType
        ? record.activeTime.add(TimeValueObject.fromSeconds(1))
        : record.activeTime,
      idleTime: idleTime,
      totalTime: this.calculateTotalTime({
        ...record,
        idleTime: idleTime,
        activeTime: event.interactionType
          ? record.activeTime.add(TimeValueObject.fromSeconds(1))
          : record.activeTime,
      }),
      lastInteractionTime: event.interactionType
        ? now
        : record.lastInteractionTime,
      lastInteractionType: shouldUpdateInteraction
        ? event.interactionType || record.lastInteractionType
        : record.lastInteractionType,
      isVisible:
        event.type === EventType.TAB_VISIBILITY_CHANGE
          ? (event.payload?.isVisible ?? record.isVisible)
          : record.isVisible,
      isFocused:
        event.type === EventType.TAB_FOCUS_CHANGE
          ? (event.payload?.isFocused ?? record.isFocused)
          : record.isFocused,
    })

    // Publicar evento de actualización
    await this.eventBus.publishActivityUpdated(updatedRecord)

    return updatedRecord
  }

  async finishRecord(
    recordId: string,
    reason: EventType
  ): Promise<IActivityRecord> {
    const record = await this.repository.findById(recordId)
    if (!record) {
      throw new ActivityRecordNotFoundException(recordId)
    }

    if (record.state === ActivityState.FINISHED) {
      return record // Ya está finalizado
    }

    const updatedRecord = await this.repository.update(recordId, {
      state: ActivityState.FINISHED,
      endTime: new Date(),
      totalTime: this.calculateTotalTime(record),
    })

    // Publicar evento de finalización
    await this.eventBus.publishActivityFinished(updatedRecord)

    return updatedRecord
  }

  async suspendRecord(
    recordId: string,
    reason: EventType
  ): Promise<IActivityRecord> {
    const record = await this.repository.findById(recordId)
    if (!record) {
      throw new ActivityRecordNotFoundException(recordId)
    }

    if (record.state !== ActivityState.ACTIVE) {
      throw new ActivityRecordInvalidStateException(
        recordId,
        record.state,
        ActivityState.ACTIVE
      )
    }

    const updatedRecord = await this.repository.update(recordId, {
      state: ActivityState.SUSPENDED,
    })

    // Publicar evento de suspensión
    await this.eventBus.publishActivitySuspended(updatedRecord)

    return updatedRecord
  }

  async resumeRecord(recordId: string): Promise<IActivityRecord> {
    const record = await this.repository.findById(recordId)
    if (!record) {
      throw new ActivityRecordNotFoundException(recordId)
    }

    if (record.state !== ActivityState.SUSPENDED) {
      throw new ActivityRecordInvalidStateException(
        recordId,
        record.state,
        ActivityState.SUSPENDED
      )
    }

    const updatedRecord = await this.repository.update(recordId, {
      state: ActivityState.ACTIVE,
      lastInteractionTime: new Date(),
    })

    // Publicar evento de reanudación
    await this.eventBus.publishActivityResumed(updatedRecord)

    return updatedRecord
  }

  async getActiveRecord(): Promise<IActivityRecord | null> {
    return await this.repository.findActive()
  }

  validateRecord(record: IActivityRecord): boolean {
    const validation = this.validator.validateRecord(record)
    return validation.isValid
  }

  calculateTotalTime(record: IActivityRecord): TimeValueObject {
    return record.minimumTime.add(record.activeTime).add(record.idleTime)
  }
}

// ============================================================================
// ACTIVITY EVENT SERVICE - Servicio de eventos
// ============================================================================

export class ActivityEventService implements IActivityEventService {
  constructor(
    private readonly configuration: IActivityConfiguration = DEFAULT_ACTIVITY_CONFIGURATION
  ) {}

  createEvent(
    type: EventType,
    interactionType?: InteractionType,
    payload?: Record<string, any>
  ): IActivityEvent {
    return {
      type,
      interactionType,
      timestamp: new Date(),
      payload,
    }
  }

  isValidEvent(event: IActivityEvent): boolean {
    // Verificar que el tipo de evento esté habilitado
    if (!this.configuration.enabledEvents.includes(event.type)) {
      return false
    }

    // Verificar que el tipo de interacción esté habilitado (si aplica)
    if (
      event.interactionType &&
      !this.configuration.enabledInteractions.includes(event.interactionType)
    ) {
      return false
    }

    // Verificar que el timestamp sea válido
    if (
      !(event.timestamp instanceof Date) ||
      isNaN(event.timestamp.getTime())
    ) {
      return false
    }

    return true
  }

  shouldStartRecord(event: IActivityEvent): boolean {
    return [
      EventType.USER_INTERACTION,
      EventType.PAGE_LOAD,
      EventType.SCRIPT_REQUEST,
    ].includes(event.type)
  }

  shouldSuspendRecord(event: IActivityEvent): boolean {
    return [
      EventType.TAB_VISIBILITY_CHANGE,
      EventType.TAB_FOCUS_CHANGE,
    ].includes(event.type)
  }

  shouldFinishRecord(event: IActivityEvent): boolean {
    return event.type === EventType.IDLE_TIMEOUT
  }
}

// ============================================================================
// ACTIVITY CONFIGURATION SERVICE - Servicio de configuración
// ============================================================================

export class ActivityConfigurationService
  implements IActivityConfigurationService
{
  private configuration: IActivityConfiguration = DEFAULT_ACTIVITY_CONFIGURATION

  getConfiguration(): IActivityConfiguration {
    return { ...this.configuration }
  }

  async updateConfiguration(
    config: Partial<IActivityConfiguration>
  ): Promise<void> {
    const newConfig = { ...this.configuration, ...config }

    if (!this.validateConfiguration(newConfig)) {
      throw new ActivityConfigurationInvalidException(
        'Invalid configuration provided'
      )
    }

    this.configuration = newConfig
  }

  validateConfiguration(config: IActivityConfiguration): boolean {
    // Validar tiempos
    if (config.minimumTime.milliseconds < 0) {
      return false
    }

    if (config.maxIdleTime.milliseconds < 0) {
      return false
    }

    if (config.updateInterval.milliseconds < 100) {
      // Mínimo 100ms
      return false
    }

    // Validar que maxIdleTime sea mayor que minimumTime
    if (config.maxIdleTime.isLessThan(config.minimumTime)) {
      return false
    }

    // Validar arrays de eventos e interacciones
    if (
      !Array.isArray(config.enabledEvents) ||
      config.enabledEvents.length === 0
    ) {
      return false
    }

    if (
      !Array.isArray(config.enabledInteractions) ||
      config.enabledInteractions.length === 0
    ) {
      return false
    }

    return true
  }

  isEventEnabled(eventType: EventType): boolean {
    return this.configuration.enabledEvents.includes(eventType)
  }

  isInteractionEnabled(interactionType: InteractionType): boolean {
    return this.configuration.enabledInteractions.includes(interactionType)
  }
}
