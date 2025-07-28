// ============================================================================
// DOMAIN ENTITY INTERFACES - Principio de Inversión de Dependencias
// ============================================================================

export interface IEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface IAuditableEntity extends IEntity {
  createdBy: string
  updatedBy?: string
}

export interface ISearchableEntity extends IEntity {
  name: string
  phoneNumber?: string
  email?: string
}

export interface IPersonEntity extends ISearchableEntity, IAuditableEntity {
  birthDate: Date
  address?: string
}

// ============================================================================
// REPOSITORY INTERFACES - Patrón Repository Genérico
// ============================================================================

export interface IBaseRepository<T extends IEntity> {
  findAll(pagination: PaginationParams): Promise<PaginatedResponse<T>>
  findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>>
  find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>>
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  update(data: Partial<T> & { id: string }): Promise<T>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}

export interface ISearchableRepository<T extends ISearchableEntity>
  extends IBaseRepository<T> {
  findByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>>
  findByPhoneNumber(
    phoneNumber: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>>
}

// ============================================================================
// SERVICE INTERFACES - Patrón Service Genérico
// ============================================================================

export interface IBaseService<T extends IEntity> {
  getAll(pagination: PaginationParams): Promise<PaginatedResponse<T>>
  getById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>>
  search(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>>
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  update(data: Partial<T> & { id: string }): Promise<T>
  delete(id: string): Promise<boolean>
}

export interface ISearchableService<T extends ISearchableEntity>
  extends IBaseService<T> {
  getByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>>
}

// ============================================================================
// VALIDATION INTERFACES - Patrón Validator
// ============================================================================

export interface IValidator<T> {
  validate(data: Partial<T>): ValidationResult
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// ============================================================================
// FACTORY INTERFACES - Patrón Factory
// ============================================================================

export interface IEntityFactory<T extends IEntity> {
  create(data: Partial<T>): T
  createFromRequest(request: any): T
}

// ============================================================================
// COMMAND INTERFACES - Patrón Command
// ============================================================================

export interface ICommand<T> {
  execute(data: T): Promise<void>
}

export interface ICommandHandler<T> {
  handle(command: ICommand<T>): Promise<void>
}

// ============================================================================
// QUERY INTERFACES - Patrón Query
// ============================================================================

export interface IQuery<T> {
  execute(): Promise<T>
}

export interface IQueryHandler<T> {
  handle(query: IQuery<T>): Promise<T>
}

// ============================================================================
// EVENT INTERFACES - Patrón Observer
// ============================================================================

export interface IEvent {
  type: string
  payload: any
  timestamp: Date
}

export interface IEventHandler {
  handle(event: IEvent): Promise<void>
}

export interface IEventBus {
  publish(event: IEvent): Promise<void>
  subscribe(eventType: string, handler: IEventHandler): void
  unsubscribe(eventType: string, handler: IEventHandler): void
}

// ============================================================================
// PAGINATION TYPES - Reexportación para evitar imports circulares
// ============================================================================

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
