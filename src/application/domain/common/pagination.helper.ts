import type { PaginationMeta, PaginationParams } from './pagination.types'

export class PaginationHelper {
  static calculateMeta(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    }
  }

  static validateParams(params: PaginationParams): PaginationParams {
    const { page, limit, sortBy, sortOrder } = params

    return {
      page: Math.max(1, page),
      limit: Math.max(1, Math.min(100, limit)), // Máximo 100 elementos por página
      sortBy: sortBy || 'id',
      sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
    }
  }

  static getOffset(page: number, limit: number): number {
    return (page - 1) * limit
  }
}
