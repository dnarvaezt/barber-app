import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  CreateStockMovementRequest,
  ProductStockSummary,
  StockMovement,
  StockMovementFilters,
} from './stock.model'

export interface StockRepository {
  findMovements(
    filters: StockMovementFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<StockMovement>>
  findMovementsByProduct(
    productId: string,
    filters: Omit<StockMovementFilters, 'productId' | 'productIds'>,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<StockMovement>>
  getCurrentStock(productId: string): Promise<number>
  getCurrentStockBulk(productIds: string[]): Promise<ProductStockSummary[]>
  createMovement(data: CreateStockMovementRequest): Promise<StockMovement>
}
