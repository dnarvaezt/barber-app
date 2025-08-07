import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  CreateStockMovementRequest,
  ProductStockSummary,
  StockMovement,
  StockMovementFilters,
} from './stock.model'
import type { StockRepository } from './stock.repository.interface'

export class StockRepositoryMemory implements StockRepository {
  private movements: StockMovement[] = []

  constructor(seed: StockMovement[] = []) {
    this.movements = seed.length > 0 ? seed : this.createSeedData()
  }

  private createSeedData(): StockMovement[] {
    const baseDate = new Date('2024-06-01T10:00:00Z')
    return [
      {
        id: 'mov_001',
        productId: 'prod_001',
        type: 'IN',
        quantity: 50,
        date: new Date(baseDate),
        note: 'Compra inicial',
        userId: 'admin_001',
        createdAt: new Date(baseDate),
      },
      {
        id: 'mov_002',
        productId: 'prod_001',
        type: 'OUT',
        quantity: 5,
        date: new Date(baseDate.getTime() + 3600_000),
        note: 'Venta mostrador',
        userId: 'admin_001',
        createdAt: new Date(baseDate.getTime() + 3600_000),
      },
      {
        id: 'mov_003',
        productId: 'prod_002',
        type: 'IN',
        quantity: 20,
        date: new Date(baseDate),
        note: 'Compra proveedor',
        userId: 'admin_001',
        createdAt: new Date(baseDate),
      },
    ]
  }

  private applyFilters(
    filters: StockMovementFilters,
    source: StockMovement[]
  ): StockMovement[] {
    return source.filter(mov => {
      if (filters.type && mov.type !== filters.type) return false
      if (filters.productId && mov.productId !== filters.productId) return false
      if (
        filters.productIds &&
        filters.productIds.length > 0 &&
        !filters.productIds.includes(mov.productId)
      )
        return false
      if (filters.dateFrom && mov.date < filters.dateFrom) return false
      if (filters.dateTo && mov.date > filters.dateTo) return false
      return true
    })
  }

  private paginate<T>(
    items: T[],
    pagination: PaginationParams
  ): PaginatedResponse<T> {
    const validated = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validated

    const sorted = sortBy
      ? [...items].sort((a: any, b: any) => {
          const aValue = a[sortBy as keyof T]
          const bValue = b[sortBy as keyof T]
          if (aValue === undefined || bValue === undefined) return 0
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
          }
          if (aValue instanceof Date && bValue instanceof Date) {
            return sortOrder === 'asc'
              ? aValue.getTime() - bValue.getTime()
              : bValue.getTime() - aValue.getTime()
          }
          return 0
        })
      : items

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const data = sorted.slice(startIndex, endIndex)

    return {
      data,
      meta: {
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit),
        hasNextPage: endIndex < items.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findMovements(
    filters: StockMovementFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<StockMovement>> {
    const filtered = this.applyFilters(filters, this.movements)
    return this.paginate(filtered, pagination)
  }

  async findMovementsByProduct(
    productId: string,
    filters: Omit<StockMovementFilters, 'productId' | 'productIds'>,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<StockMovement>> {
    const finalFilters: StockMovementFilters = { ...filters, productId }
    return this.findMovements(finalFilters, pagination)
  }

  async getCurrentStock(productId: string): Promise<number> {
    return this.movements
      .filter(m => m.productId === productId)
      .reduce((acc, m) => acc + (m.type === 'IN' ? m.quantity : -m.quantity), 0)
  }

  async getCurrentStockBulk(
    productIds: string[]
  ): Promise<ProductStockSummary[]> {
    const map = new Map<string, number>()
    for (const id of productIds) map.set(id, 0)
    for (const m of this.movements) {
      if (!map.has(m.productId)) continue
      const prev = map.get(m.productId) || 0
      map.set(m.productId, prev + (m.type === 'IN' ? m.quantity : -m.quantity))
    }
    return productIds.map(id => ({ productId: id, stock: map.get(id) || 0 }))
  }

  async createMovement(
    data: CreateStockMovementRequest
  ): Promise<StockMovement> {
    if (!data.productId) throw new Error('productId is required')
    if (!data.type) throw new Error('type is required')
    if (data.quantity == null || data.quantity <= 0)
      throw new Error('quantity must be > 0')

    // Validar stock suficiente para salida
    if (data.type === 'OUT') {
      const current = await this.getCurrentStock(data.productId)
      if (current < data.quantity) {
        throw new Error('No hay stock suficiente para realizar la salida')
      }
    }

    const now = new Date()
    const movement: StockMovement = {
      id: `mov_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      productId: data.productId,
      type: data.type,
      quantity: data.quantity,
      date: data.date ?? now,
      note: data.note,
      userId: data.userId,
      createdAt: now,
    }

    this.movements.unshift(movement)
    return movement
  }
}
