// ============================================================================
// DEPENDENCY INJECTION CONTAINER - Patrón Service Locator
// ============================================================================

export type ServiceIdentifier<T> = string | symbol | (new (...args: any[]) => T)

export interface ServiceDescriptor<T = any> {
  identifier: ServiceIdentifier<T>
  factory: () => T
  singleton?: boolean
}

export class DIContainer {
  private static instance: DIContainer
  private services = new Map<ServiceIdentifier<any>, any>()
  private factories = new Map<ServiceIdentifier<any>, ServiceDescriptor>()

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer()
    }
    return DIContainer.instance
  }

  // ============================================================================
  // REGISTRATION METHODS
  // ============================================================================

  register<T>(
    identifier: ServiceIdentifier<T>,
    factory: () => T,
    singleton = true
  ): void {
    this.factories.set(identifier, {
      identifier,
      factory,
      singleton,
    })
  }

  registerSingleton<T>(
    identifier: ServiceIdentifier<T>,
    factory: () => T
  ): void {
    this.register(identifier, factory, true)
  }

  registerTransient<T>(
    identifier: ServiceIdentifier<T>,
    factory: () => T
  ): void {
    this.register(identifier, factory, false)
  }

  // ============================================================================
  // RESOLUTION METHODS
  // ============================================================================

  resolve<T>(identifier: ServiceIdentifier<T>): T {
    const descriptor = this.factories.get(identifier)
    if (!descriptor) {
      throw new Error(`Service not registered: ${String(identifier)}`)
    }

    if (descriptor.singleton) {
      if (!this.services.has(identifier)) {
        this.services.set(identifier, descriptor.factory())
      }
      return this.services.get(identifier)
    } else {
      return descriptor.factory()
    }
  }

  tryResolve<T>(identifier: ServiceIdentifier<T>): T | null {
    try {
      return this.resolve(identifier)
    } catch {
      return null
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  isRegistered(identifier: ServiceIdentifier<any>): boolean {
    return this.factories.has(identifier)
  }

  clear(): void {
    this.services.clear()
    this.factories.clear()
  }

  reset(): void {
    this.services.clear()
  }
}

// ============================================================================
// DECORATORS PARA INYECCIÓN AUTOMÁTICA
// ============================================================================

export function Injectable() {
  return function (target: any) {
    // Marcar la clase como inyectable
    target.prototype.__injectable = true
  }
}

export function Inject(identifier: ServiceIdentifier<any>) {
  return function (target: any, propertyKey: string | symbol) {
    if (!target.__injections) {
      target.__injections = new Map()
    }
    target.__injections.set(propertyKey, identifier)
  }
}

// ============================================================================
// FACTORY FUNCTIONS PARA SERVICIOS COMUNES
// ============================================================================

export function createServiceFactory<T>(
  ServiceClass: new (...args: any[]) => T,
  dependencies: ServiceIdentifier<any>[] = []
): () => T {
  return () => {
    const container = DIContainer.getInstance()
    const resolvedDependencies = dependencies.map(dep => container.resolve(dep))
    return new ServiceClass(...resolvedDependencies)
  }
}

export function createRepositoryFactory<T>(
  RepositoryClass: new (...args: any[]) => T,
  data: any[] = []
): () => T {
  return () => new RepositoryClass(data)
}

// ============================================================================
// CONSTANTES PARA IDENTIFICADORES DE SERVICIOS
// ============================================================================

export const ServiceIds = {
  // Repositorios
  CLIENT_REPOSITORY: Symbol('ClientRepository'),
  EMPLOYEE_REPOSITORY: Symbol('EmployeeRepository'),
  USER_REPOSITORY: Symbol('UserRepository'),

  // Servicios
  CLIENT_SERVICE: Symbol('ClientService'),
  EMPLOYEE_SERVICE: Symbol('EmployeeService'),
  USER_SERVICE: Symbol('UserService'),

  // Validadores
  CLIENT_VALIDATOR: Symbol('ClientValidator'),
  EMPLOYEE_VALIDATOR: Symbol('EmployeeValidator'),
  USER_VALIDATOR: Symbol('UserValidator'),

  // Event Bus
  EVENT_BUS: Symbol('EventBus'),
} as const
