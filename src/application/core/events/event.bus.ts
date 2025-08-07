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

// ============================================================================
// EVENT HANDLERS ESPECÍFICOS
// ============================================================================

export class EntityEventHandler implements IEventHandler {
  constructor(private entityType: string) {}

  async handle(event: IEvent): Promise<void> {
    switch (event.type) {
      case `${this.entityType}.created`:
        await this.onEntityCreated(event.payload)
        break
      case `${this.entityType}.updated`:
        await this.onEntityUpdated(event.payload)
        break
      case `${this.entityType}.deleted`:
        await this.onEntityDeleted(event.payload)
        break
      case `${this.entityType}.validation.failed`:
        await this.onValidationFailed(event.payload)
        break
      case `${this.entityType}.search.performed`:
        await this.onSearchPerformed(event.payload)
        break
    }
  }

  protected async onEntityCreated(payload: any): Promise<void> {
    // Event handled
  }

  protected async onEntityUpdated(payload: any): Promise<void> {
    // Event handled
  }

  protected async onEntityDeleted(payload: any): Promise<void> {
    // Event handled
  }

  protected async onValidationFailed(payload: any): Promise<void> {
    // Validation failed event handled
  }

  protected async onSearchPerformed(payload: any): Promise<void> {
    // Search performed event handled
  }
}

// ============================================================================
// EVENT TYPES CONSTANTS
// ============================================================================

export const EventTypes = {
  // Cliente
  CLIENT_CREATED: 'client.created',
  CLIENT_UPDATED: 'client.updated',
  CLIENT_DELETED: 'client.deleted',
  CLIENT_VALIDATION_FAILED: 'client.validation.failed',
  CLIENT_SEARCH_PERFORMED: 'client.search.performed',

  // Empleado
  EMPLOYEE_CREATED: 'employee.created',
  EMPLOYEE_UPDATED: 'employee.updated',
  EMPLOYEE_DELETED: 'employee.deleted',
  EMPLOYEE_VALIDATION_FAILED: 'employee.validation.failed',
  EMPLOYEE_SEARCH_PERFORMED: 'employee.search.performed',

  // Usuario
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_VALIDATION_FAILED: 'user.validation.failed',
  USER_SEARCH_PERFORMED: 'user.search.performed',

  // Sistema
  THEME_CHANGED: 'theme.changed',
  ROUTE_CHANGED: 'route.changed',
  ERROR_OCCURRED: 'error.occurred',
} as const

// ============================================================================
// EVENT DECORATORS - Para facilitar el uso de eventos
// ============================================================================

export function EventHandler(eventType: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args)

      // Publicar evento después de ejecutar el método
      const eventBus = EventBus.getInstance()
      const event = EventFactory.create(eventType, { result, args })
      await eventBus.publish(event)

      return result
    }
  }
}

export function EventListener(eventType: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const eventBus = EventBus.getInstance()
    const handler: IEventHandler = {
      handle: async (event: IEvent) => {
        await descriptor.value.call(target, event)
      },
    }

    eventBus.subscribe(eventType, handler)
  }
}
