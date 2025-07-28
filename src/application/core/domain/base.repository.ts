import type {
  IBaseRepository,
  IEntity,
  PaginatedResponse,
  PaginationParams,
} from './entity.interface'

// ============================================================================
// BASE REPOSITORY - Patrón Template Method + Strategy
// ============================================================================

export abstract class BaseRepository<T extends IEntity>
  implements IBaseRepository<T>
{
  protected abstract data: T[]

  // ============================================================================
  // PUBLIC METHODS - API pública del repositorio
  // ============================================================================

  async findAll(pagination: PaginationParams): Promise<PaginatedResponse<T>> {
    return this.paginateAndSort(this.data, pagination)
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const entity = this.data.find(item => item.id === id)
    if (!entity) {
      return this.createEmptyResponse(pagination)
    }
    return this.paginateAndSort([entity], pagination)
  }

  async find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const filteredData = this.searchEntities(
      searchTerm,
      this.getSearchableFields()
    )
    return this.paginateAndSort(filteredData, pagination)
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const newEntity = this.createEntity(data)
    this.data.push(newEntity)
    return newEntity
  }

  async update(data: Partial<T> & { id: string }): Promise<T> {
    const index = this.data.findIndex(item => item.id === data.id)
    if (index === -1) {
      throw new Error('Entity not found')
    }

    const updatedEntity = this.updateEntity(this.data[index], data)
    this.data[index] = updatedEntity
    return updatedEntity
  }

  async delete(id: string): Promise<boolean> {
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) {
      return false
    }

    this.data.splice(index, 1)
    return true
  }

  async exists(id: string): Promise<boolean> {
    return this.data.some(item => item.id === id)
  }

  // ============================================================================
  // PROTECTED METHODS - Métodos para subclases
  // ============================================================================

  protected searchEntities(
    searchTerm: string,
    searchableFields: string[]
  ): T[] {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim()

    if (!normalizedSearchTerm) {
      return this.data
    }

    return this.data.filter(entity => {
      return searchableFields.some(field => {
        const value = (entity as any)[field]
        if (!value) return false

        const stringValue = String(value).toLowerCase().trim()

        // Búsqueda exacta o parcial
        if (stringValue.includes(normalizedSearchTerm)) {
          return true
        }

        // Búsqueda especializada por tipo de campo
        return this.performSpecializedSearch(
          field,
          stringValue,
          normalizedSearchTerm
        )
      })
    })
  }

  protected filterByBirthMonth(month: number): T[] {
    return this.data.filter(entity => {
      const birthDate = (entity as any).birthDate
      if (!birthDate) return false

      const itemMonth = new Date(birthDate).getMonth() + 1
      return itemMonth === month
    })
  }

  protected paginateAndSort(
    data: T[],
    pagination: PaginationParams
  ): PaginatedResponse<T> {
    const sortedData = this.sortEntities(data, pagination)
    const offset = (pagination.page - 1) * pagination.limit
    const paginatedData = sortedData.slice(offset, offset + pagination.limit)

    const total = data.length
    const totalPages = Math.ceil(total / pagination.limit)
    const hasNextPage = pagination.page < totalPages
    const hasPrevPage = pagination.page > 1

    return {
      data: paginatedData,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    }
  }

  protected createEntity(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const now = new Date()
    return {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T
  }

  protected updateEntity(existingEntity: T, updateData: Partial<T>): T {
    return {
      ...existingEntity,
      ...updateData,
      updatedAt: new Date(),
    }
  }

  protected createEmptyResponse(
    pagination: PaginationParams
  ): PaginatedResponse<T> {
    return {
      data: [],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  // ============================================================================
  // PRIVATE METHODS - Lógica interna
  // ============================================================================

  private sortEntities(data: T[], pagination: PaginationParams): T[] {
    const sortedData = [...data]

    if (pagination.sortBy) {
      sortedData.sort((a, b) => {
        const aValue = (a as any)[pagination.sortBy!]
        const bValue = (b as any)[pagination.sortBy!]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const aLower = aValue.toLowerCase()
          const bLower = bValue.toLowerCase()

          if (aLower < bLower) {
            return pagination.sortOrder === 'desc' ? 1 : -1
          }
          if (aLower > bLower) {
            return pagination.sortOrder === 'desc' ? -1 : 1
          }
          return 0
        }

        if (aValue < bValue) {
          return pagination.sortOrder === 'desc' ? 1 : -1
        }
        if (aValue > bValue) {
          return pagination.sortOrder === 'desc' ? -1 : 1
        }
        return 0
      })
    }

    return sortedData
  }

  private performSpecializedSearch(
    field: string,
    value: string,
    searchTerm: string
  ): boolean {
    // Búsqueda especializada para números de teléfono
    if (field === 'phoneNumber') {
      const cleanValue = value.replace(/[\s\-()]/g, '')
      const cleanSearch = searchTerm.replace(/[\s\-()]/g, '')
      return cleanValue.includes(cleanSearch)
    }

    // Búsqueda especializada para nombres
    if (field === 'name') {
      const nameWords = value.split(/\s+/)
      const searchWords = searchTerm.split(/\s+/)

      return searchWords.some(searchWord =>
        nameWords.some(nameWord => nameWord.includes(searchWord))
      )
    }

    return false
  }

  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // ============================================================================
  // ABSTRACT METHODS - Deben ser implementados por subclases
  // ============================================================================

  protected abstract getSearchableFields(): string[]
}
