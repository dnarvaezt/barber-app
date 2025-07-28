import type { PaginatedResponse, PaginationParams } from './pagination.types'

export abstract class BaseRepository<T> {
  protected abstract data: T[]

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

        // Convertir a string y normalizar
        const stringValue = String(value).toLowerCase().trim()

        // Búsqueda exacta o parcial
        if (stringValue.includes(normalizedSearchTerm)) {
          return true
        }

        // Para números de teléfono, también buscar sin espacios ni guiones
        if (field === 'phoneNumber') {
          const cleanPhone = stringValue.replace(/[\s\-()]/g, '')
          const cleanSearch = normalizedSearchTerm.replace(/[\s\-()]/g, '')
          if (cleanPhone.includes(cleanSearch)) {
            return true
          }
        }

        // Para nombres, buscar palabras individuales
        if (field === 'name') {
          const nameWords = stringValue.split(/\s+/)
          const searchWords = normalizedSearchTerm.split(/\s+/)

          return searchWords.some(searchWord =>
            nameWords.some(nameWord => nameWord.includes(searchWord))
          )
        }

        return false
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
    // Aplicar ordenamiento
    const sortedData = this.sortEntities(data, pagination)

    // Aplicar paginación
    const offset = (pagination.page - 1) * pagination.limit
    const paginatedData = sortedData.slice(offset, offset + pagination.limit)

    // Calcular metadatos
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

  private sortEntities(data: T[], pagination: PaginationParams): T[] {
    const sortedData = [...data]

    if (pagination.sortBy) {
      sortedData.sort((a, b) => {
        const aValue = (a as any)[pagination.sortBy!]
        const bValue = (b as any)[pagination.sortBy!]

        // Comparar strings de manera case-insensitive
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

        // Comparar otros tipos
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
}
