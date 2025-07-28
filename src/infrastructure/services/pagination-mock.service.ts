import type {
  PaginatedResponse,
  PaginationParams,
} from '../../application/domain/common'
import { PaginationHelper } from '../../application/domain/common'

export class PaginationMockService {
  /**
   * Simula paginación para cualquier array de datos
   */
  static paginateData<T>(
    data: T[],
    pagination: PaginationParams
  ): PaginatedResponse<T> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const offset = PaginationHelper.getOffset(
      validatedPagination.page,
      validatedPagination.limit
    )
    const total = data.length

    // Aplicar ordenamiento si se especifica
    const sortedData = [...data]
    if (validatedPagination.sortBy) {
      sortedData.sort((a, b) => {
        const aValue = (a as any)[validatedPagination.sortBy!]
        const bValue = (b as any)[validatedPagination.sortBy!]

        if (aValue < bValue) {
          return validatedPagination.sortOrder === 'desc' ? 1 : -1
        }
        if (aValue > bValue) {
          return validatedPagination.sortOrder === 'desc' ? -1 : 1
        }
        return 0
      })
    }

    // Aplicar paginación
    const paginatedData = sortedData.slice(
      offset,
      offset + validatedPagination.limit
    )

    // Calcular metadatos
    const meta = PaginationHelper.calculateMeta(
      validatedPagination.page,
      validatedPagination.limit,
      total
    )

    return {
      data: paginatedData,
      meta,
    }
  }

  /**
   * Simula búsqueda con paginación
   */
  static searchWithPagination<T>(
    data: T[],
    searchTerm: string,
    pagination: PaginationParams
  ): PaginatedResponse<T> {
    // Normalizar el término de búsqueda
    const normalizedSearchTerm = searchTerm.toLowerCase().trim()

    if (!normalizedSearchTerm) {
      return this.paginateData(data, pagination)
    }

    // Filtrar por término de búsqueda
    const filteredData = data.filter(item => {
      const searchableFields = ['name', 'phoneNumber', 'email']

      return searchableFields.some(field => {
        const value = (item as any)[field]

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

    return this.paginateData(filteredData, pagination)
  }

  /**
   * Simula filtrado por mes de nacimiento con paginación
   */
  static filterByBirthMonthWithPagination<T>(
    data: T[],
    month: number,
    pagination: PaginationParams
  ): PaginatedResponse<T> {
    // Filtrar por mes de nacimiento
    const filteredData = data.filter(item => {
      const birthDate = (item as any).birthDate
      if (!birthDate) return false

      const itemMonth = new Date(birthDate).getMonth() + 1
      return itemMonth === month
    })

    return this.paginateData(filteredData, pagination)
  }

  /**
   * Simula búsqueda por ID con paginación
   */
  static findByIdWithPagination<T>(
    data: T[],
    id: string,
    pagination: PaginationParams
  ): PaginatedResponse<T> {
    // Buscar por ID
    const foundItem = data.find(item => (item as any).id === id)

    if (!foundItem) {
      const meta = PaginationHelper.calculateMeta(
        pagination.page,
        pagination.limit,
        0
      )
      return {
        data: [],
        meta,
      }
    }

    const meta = PaginationHelper.calculateMeta(
      pagination.page,
      pagination.limit,
      1
    )

    return {
      data: [foundItem],
      meta,
    }
  }
}
