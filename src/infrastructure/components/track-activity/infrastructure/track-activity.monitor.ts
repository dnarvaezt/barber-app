// ============================================================================
// TRACK ACTIVITY MONITOR - Monitor principal de actividad
// ============================================================================

import {
  DEFAULT_ACTIVITY_CONFIGURATION,
  EventType,
  InteractionType,
} from '../application/track-activity.model'

import type {
  IActivityConfiguration,
  IActivityConfigurationService,
  IActivityEventService,
  IActivityRecordService,
} from '../application/track-activity.model'

import {
  ActivityEventInvalidException,
  ActivityMonitoringAlreadyStartedException,
  ActivityMonitoringNotStartedException,
} from '../application/track-activity.exceptions'

import { ActivityRecoveryService } from '../application/track-activity.recovery.service'

// ============================================================================
// CLASE PRINCIPAL - Monitor de Actividad
// ============================================================================

export class ActivityMonitor {
  private isMonitoring: boolean = false
  private updateInterval: number | null = null
  private lastInteractionTime: Date = new Date()
  private _isTabVisible: boolean = true
  private _isTabFocused: boolean = true
  private recoveryService: ActivityRecoveryService | null = null

  constructor(
    private readonly recordService: IActivityRecordService,
    private readonly eventService: IActivityEventService,
    private readonly configService: IActivityConfigurationService,
    private readonly configuration: IActivityConfiguration = DEFAULT_ACTIVITY_CONFIGURATION
  ) {
    this.setupEventListeners()
  }

  // ============================================================================
  // MÉTODOS PRINCIPALES
  // ============================================================================

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      throw new ActivityMonitoringAlreadyStartedException()
    }

    this.isMonitoring = true
    this.lastInteractionTime = new Date()

    // Recuperar registros pendientes antes de iniciar
    await this.recoverPendingRecords()

    // Iniciar monitoreo con evento de script
    await this.handleEvent(
      this.eventService.createEvent(EventType.SCRIPT_REQUEST)
    )

    // Iniciar intervalo de actualización
    this.startUpdateInterval()

    console.log('🟢 Activity monitoring started')
  }

  async stopMonitoring(): Promise<void> {
    if (!this.isMonitoring) {
      throw new ActivityMonitoringNotStartedException()
    }

    this.isMonitoring = false
    this.stopUpdateInterval()

    // Finalizar registro activo si existe
    const activeRecord = await this.recordService.getActiveRecord()
    if (activeRecord) {
      await this.recordService.finishRecord(
        activeRecord.id,
        EventType.SCRIPT_REQUEST
      )
    }

    console.log('🔴 Activity monitoring stopped')
  }

  async handleEvent(event: any): Promise<void> {
    if (!this.isMonitoring) {
      return
    }

    // Validar evento
    if (!this.eventService.isValidEvent(event)) {
      throw new ActivityEventInvalidException(event.type, 'Invalid event')
    }

    // Verificar si el evento está habilitado
    if (!this.configService.isEventEnabled(event.type)) {
      return
    }

    // Verificar si el evento tiene interacción habilitada
    if (
      event.interactionType &&
      !this.configService.isInteractionEnabled(event.interactionType)
    ) {
      return
    }

    // Actualizar tiempo de última interacción si es una interacción del usuario
    if (event.interactionType) {
      this.lastInteractionTime = new Date()
    }

    // Obtener registro activo
    let activeRecord = await this.recordService.getActiveRecord()

    // Si no hay registro activo y el evento debe iniciar uno
    if (!activeRecord && this.eventService.shouldStartRecord(event)) {
      activeRecord = await this.recordService.startRecord(
        event.type,
        event.interactionType
      )
    }

    // Si hay registro activo, actualizarlo solo si el evento es válido y no tiene interacciones deshabilitadas
    if (activeRecord) {
      // Verificar si se debe suspender
      if (this.eventService.shouldSuspendRecord(event)) {
        await this.recordService.suspendRecord(activeRecord.id, event.type)
      }
      // Verificar si se debe finalizar
      else if (this.eventService.shouldFinishRecord(event)) {
        await this.recordService.finishRecord(activeRecord.id, event.type)
      }
      // Actualizar registro solo si el evento es válido y no tiene interacciones deshabilitadas
      else if (
        this.eventService.isValidEvent(event) &&
        (!event.interactionType ||
          this.configService.isInteractionEnabled(event.interactionType))
      ) {
        await this.recordService.updateRecord(activeRecord.id, event)
      }
    }
  }

  // ============================================================================
  // RECUPERACIÓN DE REGISTROS PENDIENTES
  // ============================================================================

  private async recoverPendingRecords(): Promise<void> {
    try {
      // Crear servicio de recuperación si no existe
      if (!this.recoveryService) {
        this.recoveryService = new ActivityRecoveryService(
          (this.recordService as any).repository, // Acceder al repositorio del servicio
          {
            validateRecord: () => ({
              isValid: true,
              errors: {},
            }),
            validateEvent: () => ({
              isValid: true,
              errors: {},
            }),
            validateConfiguration: () => ({
              isValid: true,
              errors: {},
            }),
          },
          {
            cleanupInvalidRecords: true,
            minimumTime: this.configuration.minimumTime.seconds,
            validateRecords: true,
          }
        )
      }

      // Ejecutar recuperación
      const recoveryResult = await this.recoveryService.recoverPendingRecords()

      if (recoveryResult.recoveredRecords.length > 0) {
        console.log(
          `🔄 Recovered ${recoveryResult.recoveredRecords.length} pending records`
        )
      }

      if (recoveryResult.cleanedRecords > 0) {
        console.log(
          `🧹 Cleaned up ${recoveryResult.cleanedRecords} invalid records`
        )
      }

      if (recoveryResult.errors.length > 0) {
        console.warn('⚠️ Recovery errors:', recoveryResult.errors)
      }
    } catch (error) {
      console.error('❌ Error during recovery:', error)
      // No fallar el inicio del monitoreo por errores de recuperación
    }
  }

  // ============================================================================
  // CONFIGURACIÓN Y ESTADO
  // ============================================================================

  async updateConfiguration(
    config: Partial<IActivityConfiguration>
  ): Promise<void> {
    await this.configService.updateConfiguration(config)
    Object.assign(this.configuration, config)
  }

  getConfiguration(): IActivityConfiguration {
    return this.configuration
  }

  isMonitoringActive(): boolean {
    return this.isMonitoring
  }

  getLastInteractionTime(): Date {
    return this.lastInteractionTime
  }

  isTabVisible(): boolean {
    return this._isTabVisible
  }

  isTabFocused(): boolean {
    return this._isTabFocused
  }

  // ============================================================================
  // CONFIGURACIÓN DE EVENT LISTENERS
  // ============================================================================

  private setupEventListeners(): void {
    // Eventos de interacción del usuario
    this.addEventListener('click', InteractionType.CLICK)
    this.addEventListener('keydown', InteractionType.KEY_PRESS)
    this.addEventListener('input', InteractionType.FORM_INPUT)
    this.addEventListener('scroll', InteractionType.SCROLL)
    this.addEventListener('mousemove', InteractionType.MOUSE_MOVE)
    this.addEventListener('touchstart', InteractionType.TOUCH)
    this.addEventListener('focus', InteractionType.FOCUS)
    this.addEventListener('blur', InteractionType.BLUR)

    // Eventos de visibilidad y foco de pestaña
    this.addVisibilityChangeListener()
    this.addFocusChangeListener()

    // Evento de carga de página
    this.addPageLoadListener()
  }

  private addEventListener(
    eventType: string,
    interactionType: InteractionType
  ): void {
    document.addEventListener(
      eventType,
      event => {
        if (this.isMonitoring) {
          const activityEvent = this.eventService.createEvent(
            EventType.USER_INTERACTION,
            interactionType,
            this.extractEventPayload(event)
          )

          this.handleEvent(activityEvent).catch(error => {
            console.error(`❌ Error handling ${eventType} event:`, error)
          })
        }
      },
      { passive: true }
    )
  }

  private addVisibilityChangeListener(): void {
    document.addEventListener(
      'visibilitychange',
      () => {
        const isVisible = !document.hidden
        this._isTabVisible = isVisible

        if (this.isMonitoring) {
          const activityEvent = this.eventService.createEvent(
            EventType.TAB_VISIBILITY_CHANGE,
            undefined,
            { isVisible }
          )

          this.handleEvent(activityEvent).catch(error => {
            console.error('❌ Error handling visibility change:', error)
          })
        }
      },
      { passive: true }
    )
  }

  private addFocusChangeListener(): void {
    window.addEventListener(
      'focus',
      () => {
        this._isTabFocused = true

        if (this.isMonitoring) {
          const activityEvent = this.eventService.createEvent(
            EventType.TAB_FOCUS_CHANGE,
            undefined,
            { isFocused: true }
          )

          this.handleEvent(activityEvent).catch(error => {
            console.error('❌ Error handling focus event:', error)
          })
        }
      },
      { passive: true }
    )

    window.addEventListener(
      'blur',
      () => {
        this._isTabFocused = false

        if (this.isMonitoring) {
          const activityEvent = this.eventService.createEvent(
            EventType.TAB_FOCUS_CHANGE,
            undefined,
            { isFocused: false }
          )

          this.handleEvent(activityEvent).catch(error => {
            console.error('❌ Error handling blur event:', error)
          })
        }
      },
      { passive: true }
    )
  }

  private addPageLoadListener(): void {
    if (document.readyState === 'complete') {
      // La página ya está cargada
      if (this.isMonitoring) {
        const activityEvent = this.eventService.createEvent(EventType.PAGE_LOAD)
        this.handleEvent(activityEvent).catch(error => {
          console.error('❌ Error handling page load:', error)
        })
      }
    } else {
      // Esperar a que la página se cargue
      window.addEventListener(
        'load',
        () => {
          if (this.isMonitoring) {
            const activityEvent = this.eventService.createEvent(
              EventType.PAGE_LOAD
            )
            this.handleEvent(activityEvent).catch(error => {
              console.error('❌ Error handling page load:', error)
            })
          }
        },
        { passive: true }
      )
    }
  }

  private extractEventPayload(event: Event): Record<string, any> {
    const payload: Record<string, any> = {
      eventType: event.type,
      timestamp: new Date(),
    }

    if (event instanceof MouseEvent) {
      payload.clientX = event.clientX
      payload.clientY = event.clientY
      payload.button = event.button
    } else if (event instanceof KeyboardEvent) {
      payload.key = event.key
      payload.code = event.code
      payload.ctrlKey = event.ctrlKey
      payload.altKey = event.altKey
      payload.shiftKey = event.shiftKey
    } else if (event instanceof TouchEvent) {
      payload.touches = event.touches.length
    } else if (event instanceof FocusEvent) {
      payload.relatedTarget = event.relatedTarget
    }

    return payload
  }

  // ============================================================================
  // INTERVALO DE ACTUALIZACIÓN
  // ============================================================================

  private startUpdateInterval(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }

    this.updateInterval = window.setInterval(async () => {
      if (!this.isMonitoring) {
        return
      }

      try {
        const activeRecord = await this.recordService.getActiveRecord()
        if (activeRecord) {
          // Crear evento de actualización periódica
          const updateEvent = this.eventService.createEvent(
            EventType.USER_INTERACTION,
            undefined,
            { periodic: true }
          )

          await this.handleEvent(updateEvent)
        }
      } catch (error) {
        console.error('❌ Error in update interval:', error)
      }
    }, this.configuration.updateInterval.seconds * 1000)
  }

  private stopUpdateInterval(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }
}
