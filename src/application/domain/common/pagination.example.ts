import { PaginationHelper } from './pagination.helper'
import type { PaginatedResponse, PaginationParams } from './pagination.types'

// Ejemplo de implementación de paginación en un repositorio
export class PaginationExample {
  /**
   * Ejemplo de cómo implementar el método find con paginación
   */
  static async findWithPagination<T>(
    items: T[],
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    // Validar y normalizar los parámetros de paginación
    const validatedPagination = PaginationHelper.validateParams(pagination)

    // Filtrar elementos por término de búsqueda (ejemplo simple)
    const filteredItems = items.filter(item =>
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Calcular offset y límite
    const offset = PaginationHelper.getOffset(
      validatedPagination.page,
      validatedPagination.limit
    )
    const total = filteredItems.length

    // Aplicar paginación
    const paginatedItems = filteredItems.slice(
      offset,
      offset + validatedPagination.limit
    )

    // Calcular metadatos de paginación
    const meta = PaginationHelper.calculateMeta(
      validatedPagination.page,
      validatedPagination.limit,
      total
    )

    return {
      data: paginatedItems,
      meta,
    }
  }

  /**
   * Ejemplo de cómo implementar el método findById con paginación
   */
  static async findByIdWithPagination<T>(
    items: T[],
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)

    // Buscar elemento por ID (ejemplo simple)
    const foundItem = items.find(item => (item as any).id === id)

    if (!foundItem) {
      return {
        data: [],
        meta: PaginationHelper.calculateMeta(
          validatedPagination.page,
          validatedPagination.limit,
          0
        ),
      }
    }

    return {
      data: [foundItem],
      meta: PaginationHelper.calculateMeta(
        validatedPagination.page,
        validatedPagination.limit,
        1
      ),
    }
  }

  /**
   * Ejemplo de cómo implementar el método findByBirthMonth con paginación
   */
  static async findByBirthMonthWithPagination<T>(
    items: T[],
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)

    // Filtrar elementos por mes de nacimiento (ejemplo simple)
    const filteredItems = items.filter(item => {
      const birthDate = (item as any).birthDate
      if (!birthDate) return false
      return new Date(birthDate).getMonth() + 1 === month
    })

    const offset = PaginationHelper.getOffset(
      validatedPagination.page,
      validatedPagination.limit
    )
    const total = filteredItems.length

    const paginatedItems = filteredItems.slice(
      offset,
      offset + validatedPagination.limit
    )

    const meta = PaginationHelper.calculateMeta(
      validatedPagination.page,
      validatedPagination.limit,
      total
    )

    return {
      data: paginatedItems,
      meta,
    }
  }
}
