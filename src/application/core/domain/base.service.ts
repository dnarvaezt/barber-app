import type {
  IBaseRepository,
  IBaseService,
  IEntity,
  IValidator,
  PaginatedResponse,
  PaginationParams,
} from './entity.interface'

// ============================================================================
// BASE SERVICE - Patrón Template Method + Strategy
// ============================================================================

export abstract class BaseService<T extends IEntity>
  implements IBaseService<T>
{
  protected constructor(
    protected readonly repository: IBaseRepository<T>,
    protected readonly validator?: IValidator<T>
  ) {}

  // ============================================================================
  // PUBLIC METHODS - API pública del servicio
  // ============================================================================

  async getAll(pagination: PaginationParams): Promise<PaginatedResponse<T>> {
    this.validatePaginationParams(pagination)
    return this.repository.findAll(this.normalizePagination(pagination))
  }

  async getById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    this.validateId(id)
    this.validatePaginationParams(pagination)
    return this.repository.findById(id, this.normalizePagination(pagination))
  }

  async search(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    this.validateSearchTerm(searchTerm)
    this.validatePaginationParams(pagination)
    return this.repository.find(
      searchTerm,
      this.normalizePagination(pagination)
    )
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    this.validateCreateData(data)
    await this.validateUniqueConstraints(data as Partial<T>)
    return this.repository.create(data)
  }

  async update(data: Partial<T> & { id: string }): Promise<T> {
    this.validateUpdateData(data)
    await this.validateEntityExists(data.id)
    await this.validateUniqueConstraints(data, data.id)
    return this.repository.update(data)
  }

  async delete(id: string): Promise<boolean> {
    this.validateId(id)
    await this.validateEntityExists(id)
    return this.repository.delete(id)
  }

  // ============================================================================
  // PROTECTED METHODS - Métodos para subclases
  // ============================================================================

  protected validatePaginationParams(pagination: PaginationParams): void {
    if (!pagination.page || pagination.page < 1) {
      throw new Error('Page must be a positive number')
    }
    if (!pagination.limit || pagination.limit < 1) {
      throw new Error('Limit must be a positive number')
    }
  }

  protected validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('ID is required')
    }
  }

  protected validateSearchTerm(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }
  }

  protected validateCreateData(
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): void {
    if (this.validator) {
      const result = this.validator.validate(data as Partial<T>)
      if (!result.isValid) {
        throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`)
      }
    }
  }

  protected validateUpdateData(data: Partial<T> & { id: string }): void {
    if (!data.id) {
      throw new Error('ID is required for update')
    }
  }

  protected async validateEntityExists(id: string): Promise<void> {
    const exists = await this.repository.exists(id)
    if (!exists) {
      throw new Error('Entity not found')
    }
  }

  protected async validateUniqueConstraints(
    data: Partial<T>,
    excludeId?: string
  ): Promise<void> {
    // Implementación base que valida campos únicos comunes
    // Las subclases pueden sobrescribir para validaciones específicas

    if (!data || Object.keys(data).length === 0) {
      return // No hay datos para validar
    }

    // Validación base: verificar que no haya campos vacíos en campos únicos
    const uniqueFields = this.getUniqueConstraints()
    for (const field of uniqueFields) {
      if (
        data[field as keyof T] !== undefined &&
        data[field as keyof T] !== null
      ) {
        const value = data[field as keyof T]
        if (typeof value === 'string' && value.trim() === '') {
          throw new Error(`${field} cannot be empty`)
        }
      }
    }
  }

  protected normalizePagination(
    pagination: PaginationParams
  ): PaginationParams {
    return {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      sortBy: pagination.sortBy || this.getDefaultSortBy(),
      sortOrder: pagination.sortOrder || 'asc',
    }
  }

  protected getDefaultSortBy(): string {
    return 'name'
  }

  // ============================================================================
  // ABSTRACT METHODS - Deben ser implementados por subclases
  // ============================================================================

  protected abstract getSearchableFields(): string[]
  protected abstract getUniqueConstraints(): string[]
}
