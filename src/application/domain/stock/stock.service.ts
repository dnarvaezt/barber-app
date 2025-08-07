import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  CreateStockMovementRequest,
  ProductStockSummary,
  StockMovement,
  StockMovementFilters,
} from './stock.model'
import type { StockRepository } from './stock.repository.interface'

export class StockService {
  private readonly stockRepository: StockRepository

  constructor(stockRepository: StockRepository) {
    this.stockRepository = stockRepository
  }

  async getMovements(
    filters: StockMovementFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<StockMovement>> {
    const validated = PaginationHelper.validateParams(pagination)
    const paginationWithSort = {
      ...validated,
      sortBy: validated.sortBy || 'date',
      sortOrder: validated.sortOrder || 'desc',
    }
    return this.stockRepository.findMovements(filters, paginationWithSort)
  }

  async getMovementsByProduct(
    productId: string,
    filters: Omit<StockMovementFilters, 'productId' | 'productIds'>,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<StockMovement>> {
    const validated = PaginationHelper.validateParams(pagination)
    const paginationWithSort = {
      ...validated,
      sortBy: validated.sortBy || 'date',
      sortOrder: validated.sortOrder || 'desc',
    }
    return this.stockRepository.findMovementsByProduct(
      productId,
      filters,
      paginationWithSort
    )
  }

  async getCurrentStock(productId: string): Promise<number> {
    return this.stockRepository.getCurrentStock(productId)
  }

  async getCurrentStockBulk(
    productIds: string[]
  ): Promise<ProductStockSummary[]> {
    return this.stockRepository.getCurrentStockBulk(productIds)
  }

  async registerEntry(
    data: Omit<CreateStockMovementRequest, 'type'>
  ): Promise<StockMovement> {
    return this.stockRepository.createMovement({ ...data, type: 'IN' })
  }

  async registerExit(
    data: Omit<CreateStockMovementRequest, 'type'>
  ): Promise<StockMovement> {
    return this.stockRepository.createMovement({ ...data, type: 'OUT' })
  }
}
