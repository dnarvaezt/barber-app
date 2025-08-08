import type {
  IEvent,
  IEventBus,
  IEventHandler,
} from '../domain/entity.interface'

// ============================================================================
// EVENT BUS IMPLEMENTATION - Patrón Observer + Mediator
// ============================================================================

export class EventBus implements IEventBus {
  private static instance: EventBus
  private handlers = new Map<string, IEventHandler[]>()

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  async publish(event: IEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || []

    // Ejecutar todos los handlers de forma asíncrona
    const promises = handlers.map(handler =>
      handler.handle(event).catch(error => {
        console.error(`Error handling event ${event.type}:`, error)
      })
    )

    await Promise.all(promises)
  }

  subscribe(eventType: string, handler: IEventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType)!.push(handler)
  }

  unsubscribe(eventType: string, handler: IEventHandler): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  clear(): void {
    this.handlers.clear()
  }

  getHandlerCount(eventType: string): number {
    return this.handlers.get(eventType)?.length || 0
  }
}

// ============================================================================
// EVENT FACTORY - Patrón Factory para crear eventos
// ============================================================================

export class EventFactory {
  static create<T = any>(type: string, payload: T, timestamp?: Date): IEvent {
    return {
      type,
      payload,
      timestamp: timestamp || new Date(),
    }
  }

  static createEntityCreated(entity: any, entityType: string): IEvent {
    return this.create(`${entityType}.created`, { entity })
  }

  static createEntityUpdated(entity: any, entityType: string): IEvent {
    return this.create(`${entityType}.updated`, { entity })
  }

  static createEntityDeleted(entityId: string, entityType: string): IEvent {
    return this.create(`${entityType}.deleted`, { entityId })
  }

  static createValidationFailed(
    errors: Record<string, string>,
    entityType: string
  ): IEvent {
    return this.create(`${entityType}.validation.failed`, { errors })
  }

  static createSearchPerformed(searchTerm: string, entityType: string): IEvent {
    return this.create(`${entityType}.search.performed`, { searchTerm })
  }
}

// Nota: Se eliminaron handlers, decoradores y constantes de eventos no utilizados
